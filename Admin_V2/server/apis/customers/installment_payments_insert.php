<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

function apiError($message, $debug = null, $code = 400) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message,
        "debug" => $debug
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    apiError("Invalid payload, array expected");
}

$sql = "
INSERT INTO installment_payments (
    card_id,
    installment_no,
    tag,
    due_amount,
    principal_amount,
    profit_amount,
    due_date,
    paid_date,
    payment_method,
    receipt_number,
    status,
    signature,
    created_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
)
";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    apiError("Prepare failed", $mysqli->error, 500);
}

$inserted = 0;

foreach ($input as $row) {

    // validation
    $required = [
        "card_id","installment_no","tag",
        "due_amount","principal_amount","profit_amount",
        "due_date","status"
    ];

    foreach ($required as $field) {
        if (!isset($row[$field])) {
            apiError("Missing field: {$field}", $row);
        }
    }

    $card_id          = (int)$row["card_id"];
    $installment_no   = (int)$row["installment_no"];
    $tag              = trim($row["tag"]);
    $due_amount       = (float)$row["due_amount"];
    $principal_amount = (float)$row["principal_amount"];
    $profit_amount    = (float)$row["profit_amount"];
    $due_date         = $row["due_date"];
    $paid_date        = $row["paid_date"] ?? null;
    $payment_method   = $row["payment_method"] ?? "Cash";
    $receipt_number   = $row["receipt_number"] ?? null;
    $status           = $row["status"];
    $signature        = $row["signature"] ?? null;

    $stmt->bind_param(
        "iisdddssssss",
        $card_id,
        $installment_no,
        $tag,
        $due_amount,
        $principal_amount,
        $profit_amount,
        $due_date,
        $paid_date,
        $payment_method,
        $receipt_number,
        $status,
        $signature
    );

    if (!$stmt->execute()) {
        apiError("Insert failed", $stmt->error, 500);
    }

    $inserted++;
}

echo json_encode([
    "success" => true,
    "message" => "Installments inserted successfully",
    "inserted" => $inserted
], JSON_UNESCAPED_UNICODE);
