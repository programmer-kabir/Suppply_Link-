<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");

// Bangladesh Timezone
date_default_timezone_set("Asia/Dhaka");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "error" => "Invalid request method"
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

// Required fields
$requiredFields = [
    "id",
    "investment_date",
    "amount",
    "updated_by",
    "update_reason"
];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || $input[$field] === "") {
        echo json_encode([
            "success" => false,
            "error" => "Missing field: $field"
        ]);
        exit;
    }
}

$id              = (int)$input["id"];
$investment_date = trim($input["investment_date"]);
$amount          = (float)$input["amount"];
$updated_by      = trim($input["updated_by"]);
$update_reason   = trim($input["update_reason"]);

$updated_at = date("Y-m-d H:i:s");

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid ID"
    ]);
    exit;
}

if ($amount <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid amount"
    ]);
    exit;
}

// Check row exists
$check = $mysqli->prepare("SELECT id FROM investment_installments WHERE id=? LIMIT 1");
$check->bind_param("i", $id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "error" => "Installment not found"
    ]);
    exit;
}

$check->close();

// Update
$sql = "UPDATE investment_installments
SET
    investment_date = ?,
    amount = ?,
    updated_by = ?,
    updated_at = ?,
    update_reason = ?
WHERE id = ?";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => $mysqli->error
    ]);
    exit;
}

$stmt->bind_param(
    "sdsssi",
    $investment_date,
    $amount,
    $updated_by,
    $updated_at,
    $update_reason,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Installment updated successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);

}

$stmt->close();
$mysqli->close();