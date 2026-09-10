<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ✅ DB connection ($mysqli)
require_once __DIR__ . '/../db.php';

// ==========================
// ✅ Helper Functions
// ==========================

function getBody() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

function sendJson($data, $status = 200) {
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

function safeDate($date) {
    $d = date_create($date);
    return $d ? date_format($d, "Y-m-d") : false;
}

// ==========================
// ✅ Get Request Data
// ==========================

$body = getBody();

// ==========================
// ✅ Validation
// ==========================

$missing = [];

if (empty($body['purpose'])) {
    $missing[] = 'purpose';
}

if (empty($body['amount']) && $body['amount'] !== 0 && $body['amount'] !== '0') {
    $missing[] = 'amount';
}

if (empty($body['date'])) {
    $missing[] = 'date';
}

if (!empty($missing)) {
    sendJson([
        "success" => false,
        "message" => "Missing fields: " . implode(', ', $missing),
        "body" => $body
    ], 400);
}

// ==========================
// ✅ Sanitize Data
// ==========================

$date = safeDate($body['date']);
if (!$date) {
    sendJson([
        "success" => false,
        "message" => "Invalid date format"
    ], 400);
}

$purpose  = $body['purpose'];
$amount   = floatval($body['amount']);
$category = $body['category'] ?? 'expense';
$source = $body['source'] ?? '';
// ==========================
// ✅ Insert Query
// ==========================

$stmt = $mysqli->prepare("
    INSERT INTO cash (
        type,
        category,
        purpose,
        amount,
        date,
        source,
        createdAt
    )
    VALUES ('out', ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    sendJson([
        "success" => false,
        "message" => "Prepare failed: " . $mysqli->error
    ], 500);
}

$bind = $stmt->bind_param(
    "ssdss",
    $category,
    $purpose,
    $amount,
    $date,
    $source
);

if (!$bind) {
    sendJson([
        "success" => false,
        "message" => "Bind failed: " . $stmt->error
    ], 500);
}
$exec = $stmt->execute();

if (!$exec) {
    sendJson([
        "success" => false,
        "message" => "Execute failed: " . $stmt->error
    ], 500);
}

// ==========================
// ✅ Success Response
// ==========================

sendJson([
    "success" => true,
    "message" => "Cash-out entry saved successfully",
    "insertedId" => $stmt->insert_id
], 200);