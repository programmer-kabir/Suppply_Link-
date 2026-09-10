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


// ================= QUERY =================
$sql = "
    SELECT
        ip.id,
        ip.card_id,
        ip.installment_no,
        ip.tag,
        ip.due_amount,
        ip.principal_amount,
        ip.profit_amount,
        ip.due_date,
        ip.paid_date,
        ip.payment_method,
        ip.receipt_number,
        ip.signature,
        ip.status,
        ip.created_at,
        ip.collected_by
    FROM installment_payments ip
    
        WHERE NOT (
        ip.card_id = 241
        AND ip.installment_no = 2
    )
    
    ORDER BY ip.id ASC
";

$result = $mysqli->query($sql);

if (!$result) {
    apiError("Query failed", $mysqli->error);
}
// =================================================


// ================= RESULT BUILD =================
$data = [];

while ($row = $result->fetch_assoc()) {

    // type casting
    $row["id"]                = (int)$row["id"];
    $row["card_id"]           = (int)$row["card_id"];
    $row["installment_no"]    = (int)$row["installment_no"];

    $row["due_amount"]        = (float)$row["due_amount"];
    $row["principal_amount"] = (float)$row["principal_amount"];
    $row["profit_amount"]    = (float)$row["profit_amount"];

    $data[] = $row;
}
// =================================================


// ================= FINAL RESPONSE =================
echo json_encode([
    "success" => true,
    "total"   => count($data),
    "data"    => $data
], JSON_UNESCAPED_UNICODE);
