<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
        id,
        userId,
        cardId,
        amount,
        date,
        receiver,
        created_at,
        	update_by,
        	update_at,
        	update_reason
    FROM daily_installments
    ORDER BY id DESC
";

$result = $mysqli->query($sql);

if (!$result) {
    apiError("Query failed", $mysqli->error);
}
// =================================================


// ================= RESULT BUILD =================
$data = [];

while ($row = $result->fetch_assoc()) {

    $row["id"]     = (int)$row["id"];
    $row["userId"] = (int)$row["userId"];
    $row["amount"] = (float)$row["amount"];

    $data[] = $row;
}
// =================================================


// ================= FINAL RESPONSE =================
echo json_encode([
    "success" => true,
    "total"   => count($data),
    "data"    => $data
], JSON_UNESCAPED_UNICODE);