<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// ================= ERROR HANDLER =================
function apiError($message, $debug = null, $code = 500) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message,
        "debug"   => $debug
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
// =================================================

$page   = isset($_GET['page']) ? (int)$_GET['page'] : null;
$limit  = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : '';

$where = [];
$params = [];
$types = "";

if ($search !== '') {
    $searchWildcard = "%" . $search . "%";
    $where[] = "(
        ic.card_id LIKE ? 
        OR ic.product_name LIKE ? 
        OR CAST(ic.user_id AS CHAR) LIKE ? 
        OR u.user_id LIKE ? 
        OR u.name LIKE ? 
        OR u.mobile LIKE ?
    )";
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
    $types .= "ssssss";
}

if ($status !== '' && strtolower($status) !== 'all') {
    $where[] = "ic.status = ?";
    $params[] = $status;
    $types .= "s";
}

$whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

// Count total matching and status counts
$countSql = "
    SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(CASE WHEN ic.status = 'Running' THEN 1 ELSE 0 END), 0) as running_count,
        COALESCE(SUM(CASE WHEN ic.status = 'Fully Paid' THEN 1 ELSE 0 END), 0) as fully_paid_count,
        COALESCE(SUM(CASE WHEN ic.status = 'Overdue' THEN 1 ELSE 0 END), 0) as overdue_count
    FROM installment_cards ic
    LEFT JOIN users u ON u.user_id = ic.user_id
    $whereClause
";

$countStmt = $mysqli->prepare($countSql);
if ($countStmt) {
    if (!empty($params)) {
        $countStmt->bind_param($types, ...$params);
    }
    $countStmt->execute();
    $countResult = $countStmt->get_result()->fetch_assoc();
    $totalRecords   = (int)($countResult['total_count'] ?? 0);
    $runningCount   = (int)($countResult['running_count'] ?? 0);
    $fullyPaidCount = (int)($countResult['fully_paid_count'] ?? 0);
    $overdueCount   = (int)($countResult['overdue_count'] ?? 0);
    $countStmt->close();
} else {
    $totalRecords   = 0;
    $runningCount   = 0;
    $fullyPaidCount = 0;
    $overdueCount   = 0;
}

// Data query
$dataSql = "
    SELECT
        ic.id,
        ic.card_id,
        ic.user_id,
        u.user_id AS customer_user_id,
        u.name AS user_name,
        u.mobile AS user_mobile,
        ic.product_name,
        ic.mrp,
        ic.purchase_price,
        ic.additional_cost,
        ic.cost_price,
        ic.sale_type,
        ic.sale_price,
        ic.down_payment,
        ic.total_due_amount,
        ic.installment_count,
        ic.per_installment_amount,
        ic.profit,
        ic.delivery_date,
        ic.first_installment_date,
        ic.supplier_id,
        ic.status,
        ic.description,
        ic.memo,
        ic.remarks,
        ic.reference_user_id,
        ic.created_at,
        EXISTS(SELECT 1 FROM installment_payments ip WHERE ip.card_id = ic.card_id LIMIT 1) AS has_chart
    FROM installment_cards ic
    LEFT JOIN users u ON u.user_id = ic.user_id
    $whereClause
    ORDER BY 
        CASE 
            WHEN ic.status = 'Running' THEN 1 
            WHEN ic.status = 'Overdue' THEN 2 
            WHEN ic.status = 'Fully Paid' THEN 3 
            ELSE 4 
        END ASC,
        ic.card_id ASC,
        ic.id ASC
";

if ($page !== null && $page > 0) {
    $currentLimit = ($limit !== null && $limit > 0) ? $limit : 25;
    $offset = ($page - 1) * $currentLimit;
    $dataSql .= " LIMIT ? OFFSET ?";
    $dataParams = array_merge($params, [$currentLimit, $offset]);
    $dataTypes = $types . "ii";
} else {
    $dataParams = $params;
    $dataTypes = $types;
}

$stmt = $mysqli->prepare($dataSql);
if (!$stmt) {
    apiError("Query prepare failed", $mysqli->error);
}

if (!empty($dataParams)) {
    $stmt->bind_param($dataTypes, ...$dataParams);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $row["id"]                    = (int)$row["id"];
    $row["user_id"]               = (int)$row["user_id"];
    $row["supplier_id"]           = (int)$row["supplier_id"];
    $row["installment_count"]     = (int)$row["installment_count"];
    $row["has_chart"]             = (bool)$row["has_chart"];

    $row["mrp"]                   = (float)$row["mrp"];
    $row["purchase_price"]        = (float)$row["purchase_price"];
    $row["additional_cost"]       = (float)$row["additional_cost"];
    $row["cost_price"]            = (float)$row["cost_price"];
    $row["sale_price"]            = (float)$row["sale_price"];
    $row["down_payment"]          = (float)$row["down_payment"];
    $row["total_due_amount"]      = (float)$row["total_due_amount"];
    $row["per_installment_amount"]= (float)$row["per_installment_amount"];
    $row["profit"]                = (float)$row["profit"];

    $data[] = $row;
}
$stmt->close();

$actualLimit = ($limit !== null && $limit > 0) ? $limit : ($page !== null ? 25 : count($data));
$totalPages = $actualLimit > 0 ? (int)ceil($totalRecords / $actualLimit) : 1;

echo json_encode([
    "success"       => true,
    "total"         => $totalRecords,
    "total_pages"   => $totalPages,
    "current_page"  => $page ?? 1,
    "limit"         => $actualLimit,
    "status_counts" => [
        "running"   => $runningCount,
        "fullyPaid" => $fullyPaidCount,
        "overdue"   => $overdueCount,
        "total"     => $totalRecords
    ],
    "data"          => $data
], JSON_UNESCAPED_UNICODE);
