<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB
require_once __DIR__ . '/../db.php';

// helper
function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// ==========================
// ✅ Get Date
// ==========================
$date = $_GET["date"] ?? null;

if (!$date) {
    sendJson([
        "success" => false,
        "message" => "Date required"
    ], 400);
}

// ==========================
// ✅ Validate Date
// ==========================
if (!date_create($date)) {
    sendJson([
        "success" => false,
        "message" => "Invalid date format"
    ], 400);
}

// ==========================
// ✅ Cash In List
// ==========================
$stmt = $mysqli->prepare("
    SELECT * FROM cash 
    WHERE type='in' AND date=?
    ORDER BY id DESC
");
$stmt->bind_param("s", $date);
$stmt->execute();
$cashIn = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Cash Out List
// ==========================
$stmt = $mysqli->prepare("
    SELECT * FROM cash 
    WHERE type='out' AND date=?
    ORDER BY id DESC
");
$stmt->bind_param("s", $date);
$stmt->execute();
$cashOut = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Totals (SQL way - FAST)
// ==========================
$stmt = $mysqli->prepare("
    SELECT type, IFNULL(SUM(amount),0) as total 
    FROM cash 
    WHERE date=? 
    GROUP BY type
");
$stmt->bind_param("s", $date);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$totalIn = 0;
$totalOut = 0;

foreach ($rows as $r) {
    if ($r['type'] === 'in') $totalIn = $r['total'];
    if ($r['type'] === 'out') $totalOut = $r['total'];
}

// ==========================
// ✅ Response
// ==========================
sendJson([
    "success" => true,
    "date" => $date,
    "totalIn" => (float)$totalIn,
    "totalOut" => (float)$totalOut,
    "net" => (float)$totalIn - (float)$totalOut,
    "cashInList" => $cashIn,
    "cashOutList" => $cashOut
]);