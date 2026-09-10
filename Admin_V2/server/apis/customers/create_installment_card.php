<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// DEV MODE (production এ বন্ধ করবে)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    /* ================= INPUT ================= */
    $card_number   = trim($_POST['card_number'] ?? '');
    $user_id       = (int) ($_POST['user_id'] ?? 0);
    $product_name  = trim($_POST['product_name'] ?? '');

    $mrp             = (float) ($_POST['mrp'] ?? 0);
    $purchase_price  = (float) ($_POST['purchase_price'] ?? 0);
    $additional_cost = (float) ($_POST['additional_cost'] ?? 0);

    $sale_type    = $_POST['sale_type'] ?? 'Installment';
    $sale_price   = (float) ($_POST['sale_price'] ?? 0);
    $down_payment = (float) ($_POST['down_payment'] ?? 0);

    $installment_count      = (int) ($_POST['installment_count'] ?? 0);
    $delivery_date          = $_POST['delivery_date'] ?? null;
    $first_installment_date = $_POST['first_installment_date'] ?? null;

    // client side per installment (OPTIONAL)
    $client_per_installment = isset($_POST['per_installment_amount'])
        ? (float) $_POST['per_installment_amount']
        : 0;

    // supplier_id OPTIONAL
    $supplier_id = !empty($_POST['supplier_id'])
        ? (int) $_POST['supplier_id']
        : null;
$reference_user_id = !empty($_POST['reference_user_id'])
    ? (int) $_POST['reference_user_id']
    : null;
    /* ================= VALIDATION ================= */
    // frontend যেগুলো MUST করেছে
    if (
        $card_number === '' ||
        $user_id <= 0 ||
        $product_name === '' ||
        $mrp <= 0 ||
        $sale_price <= 0 ||
        $purchase_price <= 0 ||
        $installment_count <= 0 ||
        empty($delivery_date) ||
        empty($first_installment_date)
    ) {
        throw new Exception("Required field missing");
    }

    /* ================= CALCULATION ================= */

    // total due = sale_price - down_payment
    $total_due_amount = $sale_price - $down_payment;

    if ($total_due_amount <= 0) {
        throw new Exception("Invalid total due amount");
    }

    // per installment (client > backend)
    if ($client_per_installment > 0) {
        $per_installment_amount = $client_per_installment;
    } else {
        $per_installment_amount = round(
            $total_due_amount / $installment_count,
            2
        );
    }

    if ($per_installment_amount <= 0) {
        throw new Exception("Invalid per installment amount");
    }
if ($reference_user_id === null || $reference_user_id <= 0) {
    throw new Exception("Reference staff is required");
}
    // cost price
    $cost_price = $purchase_price + $additional_cost;

    // profit (as per your rule)
    // profit = (purchase + additional) - sale
    $profit = $cost_price - $sale_price;

    /* ================= INSERT ================= */
    $stmt = $mysqli->prepare("
        INSERT INTO installment_cards (
            card_number,
            user_id,
            product_name,
            mrp,
            purchase_price,
            additional_cost,
            cost_price,
            sale_type,
            sale_price,
            down_payment,
            total_due_amount,
            installment_count,
            per_installment_amount,
            profit,
            delivery_date,
            first_installment_date,
            supplier_id,
               reference_user_id,
            status,
            created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, 'Running', NOW()
        )
    ");

    $stmt->bind_param(
        "sisddddsdddiddssii",
        $card_number,            // s
        $user_id,                // i
        $product_name,           // s
        $mrp,                    // d
        $purchase_price,         // d
        $additional_cost,        // d
        $cost_price,             // d
        $sale_type,              // s
        $sale_price,             // d
        $down_payment,           // d
        $total_due_amount,       // d
        $installment_count,      // i
        $per_installment_amount, // d
        $profit,                 // d
        $delivery_date,          // s
        $first_installment_date, // s
        $supplier_id,             // i
            $reference_user_id       // i ✅ NEW

    );

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Installment card created successfully"
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Installment card create failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
