<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// ================= ERROR =================
function apiError($message, $debug = null, $code = 500) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message,
        "debug"   => $debug
    ]);
    exit;
}

// ================= INPUT =================
$input = json_decode(file_get_contents("php://input"), true);

$card_id         = $input["card_id"] ?? null;
$installment_no  = $input["installment_no"] ?? null;

$due_amount      = $input["due_amount"] ?? 0;
$principal       = $input["principal_amount"] ?? 0;
$profit          = $input["profit_amount"] ?? 0;

if (!$card_id || !$installment_no) {
    apiError("Missing required fields");
}

// ================= TRANSACTION =================
$mysqli->begin_transaction();

try {

    // ✅ 1. UPDATE current installment (6th)
    $stmt1 = $mysqli->prepare("
        UPDATE installment_payments
        SET 
            due_amount = ?,
            principal_amount = ?,
            profit_amount = ?,
            status = 'Paid',
            paid_date = CURDATE()
        WHERE card_id = ? AND installment_no = ?
    ");

    $stmt1->bind_param("dddii",
        $due_amount,
        $principal,
        $profit,
        $card_id,
        $installment_no
    );

    if (!$stmt1->execute()) {
        throw new Exception($stmt1->error);
    }

    // ❌ 2. DELETE future installments (7–12)
    $stmt2 = $mysqli->prepare("
        DELETE FROM installment_payments
        WHERE card_id = ? AND installment_no > ?
    ");

    $stmt2->bind_param("ii", $card_id, $installment_no);

    if (!$stmt2->execute()) {
        throw new Exception($stmt2->error);
    }

    // ✅ 3. UPDATE card status
    $stmt3 = $mysqli->prepare("
        UPDATE installment_cards
        SET status = 'Fully Paid'
        WHERE id = ?
    ");

    $stmt3->bind_param("i", $card_id);

    if (!$stmt3->execute()) {
        throw new Exception($stmt3->error);
    }

    // ================= COMMIT =================
    $mysqli->commit();

    echo json_encode([
        "success" => true,
        "message" => "Full settlement completed successfully"
    ]);

} catch (Exception $e) {

    $mysqli->rollback();
    apiError("Transaction failed", $e->getMessage());
}