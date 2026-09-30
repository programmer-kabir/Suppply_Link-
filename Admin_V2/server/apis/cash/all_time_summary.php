<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php'; // $mysqli

function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// ==========================
// ✅ 1. Timeline Query
// ==========================
$stmt = $mysqli->prepare("
    SELECT 
        DATE_FORMAT(date, '%Y-%m') as ym,
        DATE_FORMAT(date, '%b (%Y)') as label,
        SUM(CASE WHEN type='in' THEN amount ELSE 0 END) as total_in,
        SUM(CASE WHEN type='out' THEN amount ELSE 0 END) as total_out
    FROM cash
    WHERE (is_deleted = 0 OR is_deleted IS NULL)
    GROUP BY ym
    ORDER BY ym ASC
");

$stmt->execute();
$result = $stmt->get_result();

$months = [];
$totalIn = 0;
$totalOut = 0;

// ==========================
// ✅ 2. Loop
// ==========================
while ($row = $result->fetch_assoc()) {
    $in = (float)$row['total_in'];
    $out = (float)$row['total_out'];
    $net = $in - $out;

    $months[] = [
        "label" => $row['label'], // Jan (2025)
        "in" => $in,
        "out" => $out,
        "net" => $net
    ];

    $totalIn += $in;
    $totalOut += $out;
}

// ==========================
// ✅ 3. Response
// ==========================
sendJson([
    "success" => true,
    "type" => "timeline",
    "totalIn" => $totalIn,
    "totalOut" => $totalOut,
    "net" => $totalIn - $totalOut,
    "months" => $months
]);