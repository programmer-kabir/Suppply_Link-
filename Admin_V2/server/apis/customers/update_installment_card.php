<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    /* ================= INPUT PARSING (JSON & POST) ================= */
    $rawInput = json_decode(file_get_contents("php://input"), true);
    $input = is_array($rawInput) ? $rawInput : $_POST;

    $id = (int) ($input['id'] ?? 0);

    // Business card_id (previously mistakenly called card_number)
    $card_id = (int) ($input['card_id'] ?? $input['card_number'] ?? 0);
    $user_id = (int) ($input['user_id'] ?? 0);
    $product_name = trim($input['product_name'] ?? '');

    $mrp             = (float) ($input['mrp'] ?? 0);
    $purchase_price  = (float) ($input['purchase_price'] ?? 0);
    $additional_cost = (float) ($input['additional_cost'] ?? 0);

    $sale_type    = in_array($input['sale_type'] ?? '', ['Cash', 'Installment']) ? $input['sale_type'] : 'Installment';
    $sale_price   = (float) ($input['sale_price'] ?? 0);
    $down_payment = (float) ($input['down_payment'] ?? 0);

    $installment_count      = (int) ($input['installment_count'] ?? 0);
    $delivery_date          = !empty($input['delivery_date']) ? $input['delivery_date'] : null;
    $first_installment_date = !empty($input['first_installment_date']) ? $input['first_installment_date'] : null;

    $client_per_installment = isset($input['per_installment_amount'])
        ? (float) $input['per_installment_amount']
        : 0;

    $supplier_id = !empty($input['supplier_id'])
        ? (int) $input['supplier_id']
        : null;

    $reference_user_id = !empty($input['reference_user_id'])
        ? (int) $input['reference_user_id']
        : null;

    $status  = in_array($input['status'] ?? '', ['Running', 'Fully Paid', 'Overdue', 'Pending']) ? $input['status'] : 'Running';
    $remarks = trim($input['remarks'] ?? '');

    /* ================= VALIDATION ================= */
    if ($id <= 0) {
        throw new Exception("Invalid card database record ID");
    }

    if ($card_id <= 0) {
        throw new Exception("Card ID number is required");
    }

    if (
        $user_id <= 0 ||
        $product_name === '' ||
        $mrp <= 0 ||
        $sale_price <= 0 ||
        $purchase_price < 0 ||
        empty($delivery_date)
    ) {
        throw new Exception("Required fields missing (User, Product, Price, or Dates)");
    }

    if ($sale_type === 'Installment') {
        if ($installment_count <= 0 || empty($first_installment_date)) {
            throw new Exception("Installment count and first installment date are required");
        }
    }

    if ($reference_user_id === null || $reference_user_id <= 0) {
        throw new Exception("Reference staff user is required");
    }

    /* ================= TRANSACTION START ================= */
    $mysqli->begin_transaction();

    // Check old card data
    $fetchOld = $mysqli->prepare("SELECT card_id FROM installment_cards WHERE id = ?");
    $fetchOld->bind_param("i", $id);
    $fetchOld->execute();
    $oldRes = $fetchOld->get_result();
    if ($oldRes->num_rows === 0) {
        throw new Exception("Card record not found in database");
    }
    $oldCard = $oldRes->fetch_assoc();
    $old_card_id = (int)$oldCard['card_id'];
    $fetchOld->close();

    /* ================= DUPLICATE CARD_ID CHECK ================= */
    $check = $mysqli->prepare("
        SELECT id FROM installment_cards 
        WHERE card_id = ? AND id != ?
    ");
    $check->bind_param("ii", $card_id, $id);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        throw new Exception("Card ID {$card_id} is already in use by another card");
    }
    $check->close();

    /* ================= CALCULATION ================= */
    $total_due_amount = max(0, $sale_price - $down_payment);

    if ($client_per_installment > 0) {
        $per_installment_amount = $client_per_installment;
    } elseif ($installment_count > 0) {
        $per_installment_amount = round($total_due_amount / $installment_count, 2);
    } else {
        $per_installment_amount = 0;
    }

    $cost_price = $purchase_price + $additional_cost;
    $profit = $sale_price - $cost_price;

    /* ================= UPDATE INSTALLMENT CARD ================= */
    $stmt = $mysqli->prepare("
        UPDATE installment_cards SET
            card_id = ?,
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
        "iisddddsdddiddssiissi",
        $card_id,
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
    $stmt->close();

    // If card_id changed, sync corresponding installment_payments
    if ($old_card_id > 0 && $old_card_id !== $card_id) {
        $syncPayments = $mysqli->prepare("UPDATE installment_payments SET card_id = ? WHERE card_id = ?");
        $syncPayments->bind_param("ii", $card_id, $old_card_id);
        $syncPayments->execute();
        $syncPayments->close();
    }

    $mysqli->commit();

    echo json_encode([
        "success" => true,
        "message" => "Installment card updated successfully ✅"
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    if (isset($mysqli) && $mysqli instanceof mysqli) {
        @$mysqli->rollback();
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}