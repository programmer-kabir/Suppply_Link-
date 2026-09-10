<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    /* ================= INPUT ================= */
    $id = (int) ($_POST['id'] ?? 0);

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

    $client_per_installment = isset($_POST['per_installment_amount'])
        ? (float) $_POST['per_installment_amount']
        : 0;

    $supplier_id = !empty($_POST['supplier_id'])
        ? (int) $_POST['supplier_id']
        : null;

    $reference_user_id = !empty($_POST['reference_user_id'])
        ? (int) $_POST['reference_user_id']
        : null;

    $status  = $_POST['status'] ?? 'Running';
    $remarks = $_POST['remarks'] ?? null;

    /* ================= VALIDATION ================= */
    if ($id <= 0) {
        throw new Exception("Invalid card ID");
    }

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

    if ($reference_user_id === null || $reference_user_id <= 0) {
        throw new Exception("Reference staff is required");
    }

    /* ================= DUPLICATE CHECK ================= */
    $check = $mysqli->prepare("
        SELECT id FROM installment_cards 
        WHERE card_number=? AND id!=?
    ");
    $check->bind_param("si", $card_number, $id);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        throw new Exception("Card number already exists");
    }

    /* ================= CALCULATION ================= */

    $total_due_amount = $sale_price - $down_payment;

    if ($total_due_amount <= 0) {
        throw new Exception("Invalid total due amount");
    }

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

    $cost_price = $purchase_price + $additional_cost;

    // ✅ FIXED PROFIT
    $profit = $sale_price - $cost_price;

    // ✅ NULL SAFE
    $supplier_id = $supplier_id ?: NULL;

    /* ================= UPDATE ================= */
    $stmt = $mysqli->prepare("
        UPDATE installment_cards SET
            card_number = ?,
            user_id = ?,
            product_name = ?,
            mrp = ?,
            purchase_price = ?,
            additional_cost = ?,
            cost_price = ?,
            sale_type = ?,
            sale_price = ?,
            down_payment = ?,
            total_due_amount = ?,
            installment_count = ?,
            per_installment_amount = ?,
            profit = ?,
            delivery_date = ?,
            first_installment_date = ?,
            supplier_id = ?,
            reference_user_id = ?,
            status = ?,
            remarks = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "sisddddsdddiddssiissi",
        $card_number,
        $user_id,
        $product_name,
        $mrp,
        $purchase_price,
        $additional_cost,
        $cost_price,
        $sale_type,
        $sale_price,
        $down_payment,
        $total_due_amount,
        $installment_count,
        $per_installment_amount,
        $profit,
        $delivery_date,
        $first_installment_date,
        $supplier_id,
        $reference_user_id,
        $status,
        $remarks,
        $id
    );

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Installment card updated successfully ✅"
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error"   => $e->getMessage()
    ]);
}