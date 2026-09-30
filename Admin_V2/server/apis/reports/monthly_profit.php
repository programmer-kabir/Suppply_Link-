<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ==========================
// ✅ CORS & Headers
// ==========================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==========================
// ✅ Database Connection
// ==========================
require_once __DIR__ . '/../db.php'; // provides $mysqli

function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Helper: Check if table has a specific column
function tableHasColumn($mysqli, $table, $column) {
    static $cache = [];
    $key = "$table.$column";
    if (isset($cache[$key])) return $cache[$key];
    $res = $mysqli->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
    $exists = ($res && $res->num_rows > 0);
    $cache[$key] = $exists;
    return $exists;
}

$hasCashDeletedCol = tableHasColumn($mysqli, 'cash', 'is_deleted');
$cashDeletedClause = $hasCashDeletedCol ? " AND (is_deleted = 0 OR is_deleted IS NULL)" : "";

$hasCardNumberCol = tableHasColumn($mysqli, 'installment_cards', 'card_number');
$hasCardIdCol     = tableHasColumn($mysqli, 'installment_cards', 'card_id');

$cardSelectExpr = "ic.id as card_id";
$cardJoinExpr   = "ip.card_id = ic.id";

if ($hasCardNumberCol && $hasCardIdCol) {
    $cardSelectExpr = "COALESCE(ic.card_id, ic.card_number, ic.id) as card_id";
    $cardJoinExpr   = "(ip.card_id = ic.id OR ip.card_id = ic.card_id OR ip.card_id = ic.card_number)";
} elseif ($hasCardNumberCol) {
    $cardSelectExpr = "COALESCE(ic.card_number, ic.id) as card_id";
    $cardJoinExpr   = "(ip.card_id = ic.id OR ip.card_id = ic.card_number)";
} elseif ($hasCardIdCol) {
    $cardSelectExpr = "COALESCE(ic.card_id, ic.id) as card_id";
    $cardJoinExpr   = "(ip.card_id = ic.id OR ip.card_id = ic.card_id)";
}

// 0. Current Live Cash Balance
$cashBalanceQuery = "
    SELECT 
        IFNULL(SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END), 0) as total_in,
        IFNULL(SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END), 0) as total_out
    FROM cash
    WHERE 1=1 $cashDeletedClause
";
$resCash = $mysqli->query($cashBalanceQuery);
$cashRow = $resCash ? $resCash->fetch_assoc() : null;
$totalCashIn  = $cashRow ? (float)$cashRow['total_in'] : 0.0;
$totalCashOut = $cashRow ? (float)$cashRow['total_out'] : 0.0;
$availableCash = $totalCashIn - $totalCashOut;

$monthParam = isset($_GET['month']) ? trim($_GET['month']) : null; // e.g. "2026-09"
$yearParam  = isset($_GET['year']) ? trim($_GET['year']) : null;   // e.g. "2026"

// =========================================================================
// 1. SPECIFIC MONTH DETAIL VIEW (?month=YYYY-MM)
// =========================================================================
if ($monthParam) {
    if (!preg_match("/^\d{4}-\d{2}$/", $monthParam)) {
        sendJson([
            "success" => false,
            "message" => "Invalid month format. Expected YYYY-MM (e.g. 2026-09)"
        ], 400);
    }

    $startDate = $monthParam . "-01";
    $endDate   = date("Y-m-t", strtotime($startDate));

    // A. Collected Installment & Downpayment Profit (Realized Profit)
    $sqlPayments = "
        SELECT 
            ip.id,
            ip.card_id,
            ip.installment_no,
            ip.tag,
            ip.due_amount,
            ip.principal_amount,
            ip.profit_amount,
            ip.paid_date,
            ip.payment_method,
            ip.receipt_number,
            ic.user_id,
            ic.product_name,
            u.name as customer_name,
            u.mobile as customer_mobile
        FROM installment_payments ip
        LEFT JOIN installment_cards ic ON $cardJoinExpr
        LEFT JOIN users u ON ic.user_id = u.id
        WHERE ip.status = 'Paid' 
          AND ip.paid_date BETWEEN ? AND ?
        ORDER BY ip.paid_date DESC, ip.id DESC
    ";
    $stmtPayments = $mysqli->prepare($sqlPayments);
    $stmtPayments->bind_param("ss", $startDate, $endDate);
    $stmtPayments->execute();
    $paymentsList = $stmtPayments->get_result()->fetch_all(MYSQLI_ASSOC);

    $totalCollectedAmount    = 0.0;
    $totalCollectedPrincipal = 0.0;
    $totalCollectedProfit    = 0.0;

    foreach ($paymentsList as &$p) {
        $p['due_amount']        = (float)$p['due_amount'];
        $p['principal_amount']  = (float)$p['principal_amount'];
        $p['profit_amount']     = (float)$p['profit_amount'];
        $totalCollectedAmount    += $p['due_amount'];
        $totalCollectedPrincipal += $p['principal_amount'];
        $totalCollectedProfit    += $p['profit_amount'];
    }

    // B. Sales / Booked Cards in this Month
    $sqlCards = "
        SELECT 
            ic.id,
            $cardSelectExpr,
            ic.user_id,
            ic.product_name,
            ic.sale_type,
            ic.cost_price,
            ic.sale_price,
            ic.profit as booked_profit,
            ic.down_payment,
            ic.total_due_amount,
            ic.delivery_date,
            ic.status,
            u.name as customer_name,
            u.mobile as customer_mobile
        FROM installment_cards ic
        LEFT JOIN users u ON ic.user_id = u.id
        WHERE (ic.delivery_date BETWEEN ? AND ? OR (ic.delivery_date IS NULL AND DATE(ic.created_at) BETWEEN ? AND ?))
        ORDER BY ic.delivery_date DESC, ic.id DESC
    ";
    $stmtCards = $mysqli->prepare($sqlCards);
    $stmtCards->bind_param("ssss", $startDate, $endDate, $startDate, $endDate);
    $stmtCards->execute();
    $cardsList = $stmtCards->get_result()->fetch_all(MYSQLI_ASSOC);

    $totalSalesCount   = count($cardsList);
    $totalSalesAmount  = 0.0;
    $totalCostAmount   = 0.0;
    $totalBookedProfit = 0.0;

    foreach ($cardsList as &$c) {
        $c['cost_price']       = (float)$c['cost_price'];
        $c['sale_price']       = (float)$c['sale_price'];
        $c['booked_profit']    = (float)$c['booked_profit'];
        $c['down_payment']     = (float)$c['down_payment'];
        $c['total_due_amount'] = (float)$c['total_due_amount'];
        $totalSalesAmount     += $c['sale_price'];
        $totalCostAmount      += $c['cost_price'];
        $totalBookedProfit    += $c['booked_profit'];
    }

    // C. Company Expenses (source = 'company-expense') in this Month
    $sqlExpensesMonth = "
        SELECT 
            id,
            type,
            source,
            purpose,
            amount,
            category,
            remarks,
            date
        FROM cash
        WHERE type = 'out'
          AND LOWER(TRIM(source)) = 'company-expense'
          AND date BETWEEN ? AND ?
          $cashDeletedClause
        ORDER BY date DESC
    ";
    $stmtExpenses = $mysqli->prepare($sqlExpensesMonth);
    $stmtExpenses->bind_param("ss", $startDate, $endDate);
    $stmtExpenses->execute();
    $expensesList = $stmtExpenses->get_result()->fetch_all(MYSQLI_ASSOC);

    $companyExpensesTotal = 0.0;
    foreach ($expensesList as &$exp) {
        $amt = (float)$exp['amount'];
        $exp['amount'] = $amt;
        $companyExpensesTotal += $amt;
    }

    $netProfit = $totalCollectedProfit - $companyExpensesTotal;

    // D. Withdrawals Made for this Month
    $refIdKey = "profit-withdraw-" . $monthParam;
    $sqlWithdrawals = "
        SELECT 
            id,
            type,
            category,
            source,
            purpose,
            amount,
            date,
            remarks,
            createdAt
        FROM cash
        WHERE type = 'out'
          AND (refId = ? OR (category = 'profit-withdraw' AND purpose LIKE ?))
          $cashDeletedClause
        ORDER BY date DESC, id DESC
    ";
    $stmtW = $mysqli->prepare($sqlWithdrawals);
    $likePattern = "%" . $monthParam . "%";
    $stmtW->bind_param("ss", $refIdKey, $likePattern);
    $stmtW->execute();
    $withdrawalsList = $stmtW->get_result()->fetch_all(MYSQLI_ASSOC);

    $totalWithdrawn = 0.0;
    foreach ($withdrawalsList as &$w) {
        $wAmt = (float)$w['amount'];
        $w['amount'] = $wAmt;
        $totalWithdrawn += $wAmt;
    }

    $remainingProfit = max(0, $netProfit - $totalWithdrawn);
    $withdrawalStatus = "pending";
    if ($netProfit <= 0) {
        $withdrawalStatus = "loss";
    } elseif ($totalWithdrawn >= ($netProfit - 0.01)) {
        $withdrawalStatus = "completed";
    } elseif ($totalWithdrawn > 0) {
        $withdrawalStatus = "partial";
    }

    sendJson([
        "success" => true,
        "available_cash_balance" => round($availableCash, 2),
        "filter" => [
            "month" => $monthParam,
            "startDate" => $startDate,
            "endDate" => $endDate
        ],
        "summary" => [
            "month"                         => $monthParam,
            "month_label"                   => date("F Y", strtotime($startDate)),
            "collected_profit"              => round($totalCollectedProfit, 2),
            "total_collected_amount"        => round($totalCollectedAmount, 2),
            "total_collected_principal"      => round($totalCollectedPrincipal, 2),
            "total_payments_count"          => count($paymentsList),
            "total_sales_count"             => $totalSalesCount,
            "total_sales_amount"            => round($totalSalesAmount, 2),
            "total_cost_amount"             => round($totalCostAmount, 2),
            "booked_sales_profit"           => round($totalBookedProfit, 2),
            "operating_expenses"            => round($companyExpensesTotal, 2),
            "company_expenses"              => round($companyExpensesTotal, 2),
            "net_profit"                    => round($netProfit, 2),
            "withdrawn_amount"              => round($totalWithdrawn, 2),
            "remaining_profit"              => round($remainingProfit, 2),
            "withdrawal_status"             => $withdrawalStatus
        ],
        "collected_payments" => $paymentsList,
        "sales_cards"        => $cardsList,
        "expenses"           => $expensesList,
        "withdrawals"        => $withdrawalsList
    ]);
}

// =========================================================================
// 2. TIMELINE / YEARLY MONTHLY SUMMARY
// =========================================================================
$wherePaymentYear = "";
$whereCardYear    = "";
$whereCashYear    = "";

if ($yearParam) {
    if (!preg_match("/^\d{4}$/", $yearParam)) {
        sendJson([
            "success" => false,
            "message" => "Invalid year format. Expected YYYY (e.g. 2026)"
        ], 400);
    }
    $wherePaymentYear = "AND YEAR(ip.paid_date) = " . (int)$yearParam;
    $whereCardYear    = "AND (YEAR(ic.delivery_date) = " . (int)$yearParam . " OR (ic.delivery_date IS NULL AND YEAR(ic.created_at) = " . (int)$yearParam . "))";
    $whereCashYear    = "AND YEAR(date) = " . (int)$yearParam;
}

// A. Realized Profit per month from installment_payments
$sqlPayments = "
    SELECT 
        DATE_FORMAT(ip.paid_date, '%Y-%m') as ym,
        DATE_FORMAT(ip.paid_date, '%b %Y') as label,
        COUNT(ip.id) as payments_count,
        IFNULL(SUM(ip.due_amount), 0) as total_collected,
        IFNULL(SUM(ip.principal_amount), 0) as total_principal,
        IFNULL(SUM(ip.profit_amount), 0) as collected_profit
    FROM installment_payments ip
    WHERE ip.status = 'Paid' 
      AND ip.paid_date IS NOT NULL
      $wherePaymentYear
    GROUP BY ym
    ORDER BY ym ASC
";
$resPayments = $mysqli->query($sqlPayments);
$monthlyPayments = [];
while ($row = $resPayments->fetch_assoc()) {
    $monthlyPayments[$row['ym']] = $row;
}

// B. Booked Sales Profit per month from installment_cards
$sqlCards = "
    SELECT 
        DATE_FORMAT(IFNULL(ic.delivery_date, DATE(ic.created_at)), '%Y-%m') as ym,
        DATE_FORMAT(IFNULL(ic.delivery_date, DATE(ic.created_at)), '%b %Y') as label,
        COUNT(ic.id) as sales_count,
        IFNULL(SUM(ic.cost_price), 0) as total_cost,
        IFNULL(SUM(ic.sale_price), 0) as total_sales,
        IFNULL(SUM(ic.profit), 0) as booked_profit
    FROM installment_cards ic
    WHERE (ic.delivery_date IS NOT NULL OR ic.created_at IS NOT NULL)
      $whereCardYear
    GROUP BY ym
    ORDER BY ym ASC
";
$resCards = $mysqli->query($sqlCards);
$monthlyCards = [];
while ($row = $resCards->fetch_assoc()) {
    $monthlyCards[$row['ym']] = $row;
}

// C. Company Expenses (source = 'company-expense') per month
$sqlExpenses = "
    SELECT 
        DATE_FORMAT(date, '%Y-%m') as ym,
        IFNULL(SUM(CASE WHEN LOWER(TRIM(source)) = 'company-expense' THEN amount ELSE 0 END), 0) as company_expenses
    FROM cash
    WHERE type = 'out'
      $cashDeletedClause
      $whereCashYear
    GROUP BY ym
    ORDER BY ym ASC
";
$resExpenses = $mysqli->query($sqlExpenses);
$monthlyExpenses = [];
if ($resExpenses) {
    while ($row = $resExpenses->fetch_assoc()) {
        $monthlyExpenses[$row['ym']] = (float)$row['company_expenses'];
    }
}

// D. Profit Withdrawals per month
$hasRefIdCol = tableHasColumn($mysqli, 'cash', 'refId');
$sqlWithdrawnAll = "
    SELECT 
        COALESCE(
            NULLIF(REPLACE(refId, 'profit-withdraw-', ''), ''),
            DATE_FORMAT(date, '%Y-%m')
        ) as ym,
        IFNULL(SUM(amount), 0) as total_withdrawn
    FROM cash
    WHERE type = 'out'
      AND (category = 'profit-withdraw' OR source = 'profit-distribution' OR refId LIKE 'profit-withdraw-%')
      $cashDeletedClause
    GROUP BY ym
";
$resWithdrawn = $mysqli->query($sqlWithdrawnAll);
$monthlyWithdrawn = [];
if ($resWithdrawn) {
    while ($row = $resWithdrawn->fetch_assoc()) {
        $ymVal = trim($row['ym']);
        if (!empty($ymVal)) {
            $monthlyWithdrawn[$ymVal] = (float)$row['total_withdrawn'];
        }
    }
}

// Combine all distinct months
$allMonths = array_unique(array_merge(
    array_keys($monthlyPayments),
    array_keys($monthlyCards),
    array_keys($monthlyExpenses),
    array_keys($monthlyWithdrawn)
));
sort($allMonths);

$monthsData = [];
$totalOverallCollectedProfit = 0.0;
$totalOverallCollectedAmount = 0.0;
$totalOverallPrincipal       = 0.0;
$totalOverallSales           = 0.0;
$totalOverallCost            = 0.0;
$totalOverallBookedProfit    = 0.0;
$totalOverallCompanyExp      = 0.0;
$totalOverallNetProfit       = 0.0;
$totalOverallWithdrawn       = 0.0;
$totalOverallRemaining       = 0.0;

foreach ($allMonths as $ym) {
    if (empty($ym)) continue;

    $pay = $monthlyPayments[$ym] ?? null;
    $crd = $monthlyCards[$ym] ?? null;
    $compExp = $monthlyExpenses[$ym] ?? 0.0;
    $withdrawnAmt = $monthlyWithdrawn[$ym] ?? 0.0;

    $collectedProfit    = $pay ? (float)$pay['collected_profit'] : 0.0;
    $totalCollected     = $pay ? (float)$pay['total_collected'] : 0.0;
    $totalPrincipal     = $pay ? (float)$pay['total_principal'] : 0.0;
    $paymentsCount      = $pay ? (int)$pay['payments_count'] : 0;

    $salesCount         = $crd ? (int)$crd['sales_count'] : 0;
    $totalCost          = $crd ? (float)$crd['total_cost'] : 0.0;
    $totalSales         = $crd ? (float)$crd['total_sales'] : 0.0;
    $bookedProfit       = $crd ? (float)$crd['booked_profit'] : 0.0;

    $netProfit          = $collectedProfit - $compExp;
    $remainingProfit    = max(0, $netProfit - $withdrawnAmt);

    $withdrawalStatus = "pending";
    if ($netProfit <= 0) {
        $withdrawalStatus = "loss";
    } elseif ($withdrawnAmt >= ($netProfit - 0.01)) {
        $withdrawalStatus = "completed";
    } elseif ($withdrawnAmt > 0) {
        $withdrawalStatus = "partial";
    }

    $label = date("M Y", strtotime($ym . "-01"));

    $monthsData[] = [
        "month"                 => $ym,
        "label"                 => $label,
        "collected_profit"      => round($collectedProfit, 2),
        "total_collected"       => round($totalCollected, 2),
        "total_principal"       => round($totalPrincipal, 2),
        "payments_count"        => $paymentsCount,
        "sales_count"           => $salesCount,
        "total_sales"           => round($totalSales, 2),
        "total_cost"            => round($totalCost, 2),
        "booked_sales_profit"   => round($bookedProfit, 2),
        "operating_expenses"    => round($compExp, 2),
        "company_expenses"      => round($compExp, 2),
        "net_profit"            => round($netProfit, 2),
        "withdrawn_amount"      => round($withdrawnAmt, 2),
        "remaining_profit"      => round($remainingProfit, 2),
        "withdrawal_status"     => $withdrawalStatus
    ];

    $totalOverallCollectedProfit += $collectedProfit;
    $totalOverallCollectedAmount += $totalCollected;
    $totalOverallPrincipal       += $totalPrincipal;
    $totalOverallSales           += $totalSales;
    $totalOverallCost            += $totalCost;
    $totalOverallBookedProfit    += $bookedProfit;
    $totalOverallCompanyExp      += $compExp;
    $totalOverallNetProfit       += $netProfit;
    $totalOverallWithdrawn       += $withdrawnAmt;
    $totalOverallRemaining       += $remainingProfit;
}

sendJson([
    "success" => true,
    "available_cash_balance" => round($availableCash, 2),
    "filter"  => [
        "year" => $yearParam ?? "all"
    ],
    "totals" => [
        "total_collected_profit" => round($totalOverallCollectedProfit, 2),
        "total_collected_amount" => round($totalOverallCollectedAmount, 2),
        "total_principal_amount" => round($totalOverallPrincipal, 2),
        "total_sales_amount"     => round($totalOverallSales, 2),
        "total_cost_amount"      => round($totalOverallCost, 2),
        "total_booked_profit"    => round($totalOverallBookedProfit, 2),
        "total_company_expenses" => round($totalOverallCompanyExp, 2),
        "total_net_profit"       => round($totalOverallNetProfit, 2),
        "total_withdrawn_profit" => round($totalOverallWithdrawn, 2),
        "total_remaining_profit" => round($totalOverallRemaining, 2)
    ],
    "months" => $monthsData
]);
