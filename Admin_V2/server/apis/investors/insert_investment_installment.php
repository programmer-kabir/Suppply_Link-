<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "error" => "Invalid request method"
    ]);
    exit;
}

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = [
    "investment_card_no",
    "investor_id",
    "installment_no",
    "installment_date",
    "amount",
    "signature_by"
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

// Sanitize / assign
$investment_card_no = $input["investment_card_no"];
$investor_id        = (int) $input["investor_id"];
$installment_no     = (int) $input["installment_no"];
$installment_date   = $input["installment_date"];
$amount             = $input["amount"];
$signature_by       = $input["signature_by"];

// Prepare SQL
$sql = "INSERT INTO investment_installments 
(
    investment_card_no,
    investor_id,
    investment_no,
    investment_date,
    amount,
    signature_by
)
VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Prepare failed: " . $mysqli->error
    ]);
    exit;
}

// Bind params
$stmt->bind_param(
    "siisss",
    $investment_card_no,
    $investor_id,
    $installment_no,
    $installment_date,
    $amount,
    $signature_by
);

// Execute
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Installment added successfully",
        "insert_id" => $stmt->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Execute failed: " . $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();
