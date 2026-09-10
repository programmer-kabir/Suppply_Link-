<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB
require_once __DIR__ . '/../db.php'; // $mysqli

// helper
function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// ==========================
// ✅ Get Month (YYYY-MM)
// ==========================
$month = $_GET["month"] ?? null;

if (!$month) {
    sendJson([
        "success" => false,
        "message" => "Month required (YYYY-MM)"
    ], 400);
}

// validate
if (!preg_match("/^\d{4}-\d{2}$/", $month)) {
    sendJson([
        "success" => false,
        "message" => "Invalid month format"
    ], 400);
}

// ==========================
// ✅ Date Range
// ==========================
$start = $month . "-01";
$end   = date("Y-m-t", strtotime($start)); // last day of month

// ==========================
// ✅ Cash In List
// ==========================
$stmt = $mysqli->prepare("
    SELECT * FROM cash
    WHERE type='in' AND date BETWEEN ? AND ?
    ORDER BY date DESC
");
$stmt->bind_param("ss", $start, $end);
$stmt->execute();
$cashIn = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Cash Out List
// ==========================
$stmt = $mysqli->prepare("
    SELECT * FROM cash
    WHERE type='out' AND date BETWEEN ? AND ?
    ORDER BY date DESC
");
$stmt->bind_param("ss", $start, $end);
$stmt->execute();
$cashOut = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Totals (FAST SQL)
// ==========================
$stmt = $mysqli->prepare("
    SELECT type, IFNULL(SUM(amount),0) as total
    FROM cash
    WHERE date BETWEEN ? AND ?
    GROUP BY type
");
$stmt->bind_param("ss", $start, $end);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$totalIn = 0;
$totalOut = 0;

foreach ($rows as $r) {
    if ($r['type'] === 'in') $totalIn = $r['total'];
    if ($r['type'] === 'out') $totalOut = $r['total'];
}

$net = $totalIn - $totalOut;

// ==========================
// ✅ Previous Balance
// ==========================
$stmt = $mysqli->prepare("
    SELECT type, IFNULL(SUM(amount),0) as total
    FROM cash
    WHERE date < ?
    GROUP BY type
");
$stmt->bind_param("s", $start);
$stmt->execute();
$prev = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$prevIn = 0;
$prevOut = 0;

foreach ($prev as $r) {
    if ($r['type'] === 'in') $prevIn = $r['total'];
    if ($r['type'] === 'out') $prevOut = $r['total'];
}

$oldBalance = $prevIn - $prevOut;

// ==========================
// ✅ Response
// ==========================
sendJson([
    "success" => true,
    "month" => $month,
    "totalIn" => (float)$totalIn,
    "totalOut" => (float)$totalOut,
    "net" => (float)$net,
    "oldBalance" => (float)$oldBalance,
    "finalBalance" => (float)($oldBalance + $net),
    "cashInList" => $cashIn,
    "cashOutList" => $cashOut
]);