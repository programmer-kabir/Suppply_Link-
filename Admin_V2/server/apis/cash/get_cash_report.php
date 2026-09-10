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
// ✅ Get All Cash Data
// ==========================
$stmt = $mysqli->prepare("
    SELECT *
    FROM cash
    ORDER BY date DESC, id DESC
");

$stmt->execute();

$data = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Total In / Out
// ==========================
$stmt = $mysqli->prepare("
    SELECT 
        type,
        IFNULL(SUM(amount),0) as total
    FROM cash
    GROUP BY type
");

$stmt->execute();

$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$totalIn = 0;
$totalOut = 0;

foreach ($rows as $r) {

    if ($r['type'] === 'in') {
        $totalIn = (float)$r['total'];
    }

    if ($r['type'] === 'out') {
        $totalOut = (float)$r['total'];
    }
}

// ==========================
// ✅ Response
// ==========================
sendJson([
    "success" => true,

    "summary" => [
        "totalIn" => $totalIn,
        "totalOut" => $totalOut,
        "net" => $totalIn - $totalOut
    ],

    "totalData" => count($data),

    // all rows
    "data" => $data
]);