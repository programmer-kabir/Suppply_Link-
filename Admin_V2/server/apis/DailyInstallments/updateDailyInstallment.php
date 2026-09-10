<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set('Asia/Dhaka');

$data = json_decode(file_get_contents("php://input"), true);

$id            = $data['id'] ?? null;
$amount        = $data['amount'] ?? null;
$date          = $data['date'] ?? null;
$receiver      = $data['receiver'] ?? null;
$cardId        = $data['cardId'] ?? null;
$updatedBy     = $data['updated_by'] ?? null;
$updateReason  = trim($data['update_reason'] ?? '');

// ✅ Validation
if (
    empty($id) ||
    $amount === null ||
    empty($date) ||
    empty($receiver) ||
    empty($cardId)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All fields are required!"
    ]);
    exit;
}

if (!is_numeric($amount)) {
    echo json_encode([
        "success" => false,
        "message" => "Amount must be number"
    ]);
    exit;
}

// 🔥 Duplicate Check (same card + same date, except current row)
$stmt = $mysqli->prepare("
    SELECT id
    FROM daily_installments
    WHERE cardId = ?
      AND date = ?
      AND id != ?
    LIMIT 1
");

$stmt->bind_param("isi", $cardId, $date, $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Already added for this date ❌"
    ]);
    exit;
}

$updateAt = date("Y-m-d H:i:s");

// 🔥 Update
$stmt = $mysqli->prepare("
    UPDATE daily_installments
    SET
        amount = ?,
        date = ?,
        receiver = ?,
        update_by = ?,
        update_at = ?,
        update_reason = ?
    WHERE id = ?
");

$stmt->bind_param(
    "dsiissi",
    $amount,
    $date,
    $receiver,
    $updatedBy,
    $updateAt,
    $updateReason,
    $id
);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => $stmt->error
    ]);
    exit;
}

// 🔥 Updated Data
$stmt = $mysqli->prepare("SELECT * FROM daily_installments WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$row = $stmt->get_result()->fetch_assoc();

echo json_encode([
    "success" => true,
    "message" => "Payment Updated Successfully ✅",
    "data" => $row
]);