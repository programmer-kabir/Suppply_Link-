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
// ✅ Get Year
// ==========================
$year = $_GET["year"] ?? null;

if (!$year) {
    sendJson([
        "success" => false,
        "message" => "Year required"
    ], 400);
}

// validate year
if (!preg_match("/^\d{4}$/", $year)) {
    sendJson([
        "success" => false,
        "message" => "Invalid year format"
    ], 400);
}

// ==========================
// ✅ Query (FAST SQL)
// ==========================
$stmt = $mysqli->prepare("
    SELECT 
        DATE_FORMAT(date, '%m') as month,
        type,
        IFNULL(SUM(amount),0) as total
    FROM cash
    WHERE YEAR(date) = ? AND (is_deleted = 0 OR is_deleted IS NULL)
    GROUP BY month, type
    ORDER BY month ASC
");

$stmt->bind_param("i", $year);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ==========================
// ✅ Initialize 12 months
// ==========================
$months = [];

for ($m = 1; $m <= 12; $m++) {
    $mm = str_pad($m, 2, "0", STR_PAD_LEFT);
    $months[$mm] = [
        "in" => 0,
        "out" => 0,
        "net" => 0
    ];
}

// ==========================
// ✅ Fill Data
// ==========================
foreach ($rows as $r) {
    $month = $r['month'];

    if ($r['type'] === 'in') {
        $months[$month]['in'] = (float)$r['total'];
    } else {
        $months[$month]['out'] = (float)$r['total'];
    }
}

// ==========================
// ✅ Calculate Net
// ==========================
foreach ($months as $m => $data) {
    $months[$m]['net'] = $data['in'] - $data['out'];
}

// ==========================
// ✅ Response
// ==========================
sendJson([
    "success" => true,
    "year" => $year,
    "months" => $months
]);