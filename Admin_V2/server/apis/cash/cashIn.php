<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS (basic)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// DB
require_once __DIR__ . '/../db.php'; // এখানে $mysqli আসবে
require_once __DIR__ . '/../cors.php';
// ✅ helper functions inline

function getBody() {
    $input = file_get_contents("php://input");
    return json_decode($input, true) ?? [];
}

function sendJson($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function safeDate($date) {
    $d = date_create($date);
    return $d ? date_format($d, "Y-m-d") : false;
}

// Read body
$body = getBody();

// Validate
$missing = [];
if (empty($body['source'])) $missing[] = 'source';
if (empty($body['amount']) && $body['amount'] !== 0 && $body['amount'] !== '0') $missing[] = 'amount';
if (empty($body['date'])) $missing[] = 'date';

if (!empty($missing)) {
    sendJson([
        "success" => false,
        "message" => "Missing fields: " . implode(', ', $missing),
        "body" => $body
    ], 400);
}

// sanitize
$date = safeDate($body['date']);
if (!$date) {
    sendJson(["success" => false, "message" => "Invalid date format"], 400);
}

$source   = $body['source'];
$amount   = floatval($body['amount']);
$category = $body['category'] ?? 'other';
$refId    = $body['refId'] ?? '';
$remarks  = $body['remarks'] ?? '';

// insert
$stmt = $mysqli->prepare("
    INSERT INTO cash (type, source, amount, category, refId, remarks, date, createdAt)
    VALUES ('in', ?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    sendJson([
        "success" => false,
        "message" => "Prepare failed: " . $mysqli->error
    ], 500);
}

$stmt->bind_param("sdssss", $source, $amount, $category, $refId, $remarks, $date);

if (!$stmt->execute()) {
    sendJson([
        "success" => false,
        "message" => "Execute failed: " . $stmt->error
    ], 500);
}

sendJson([
    "success" => true,
    "message" => "Cash-in entry saved",
    "insertedId" => $stmt->insert_id
]);