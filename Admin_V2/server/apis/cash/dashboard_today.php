<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB
require_once __DIR__ . '/../db.php'; // $mysqli

// helper
function sendJson($data) {
    echo json_encode($data);
    exit;
}

$today = date("Y-m-d");

// ==========================
// ✅ Today Deposit (IN)
// ==========================
$stmt = $mysqli->prepare("
    SELECT IFNULL(SUM(amount), 0) AS total 
    FROM cash 
    WHERE type='in' AND date=?
");
$stmt->bind_param("s", $today);
$stmt->execute();
$deposit = $stmt->get_result()->fetch_assoc()['total'];

// ==========================
// ✅ Today Withdraw (OUT)
// ==========================
$stmt = $mysqli->prepare("
    SELECT IFNULL(SUM(amount), 0) AS total 
    FROM cash 
    WHERE type='out' AND date=?
");
$stmt->bind_param("s", $today);
$stmt->execute();
$withdraw = $stmt->get_result()->fetch_assoc()['total'];

// ==========================
// ✅ Total IN
// ==========================
$res = $mysqli->query("
    SELECT IFNULL(SUM(amount), 0) AS total 
    FROM cash 
    WHERE type='in'
");
$totalIn = $res->fetch_assoc()['total'];

// ==========================
// ✅ Total OUT
// ==========================
$res = $mysqli->query("
    SELECT IFNULL(SUM(amount), 0) AS total 
    FROM cash 
    WHERE type='out'
");
$totalOut = $res->fetch_assoc()['total'];

// ==========================
// ✅ Response
// ==========================
sendJson([
    "todayDeposit" => (float)$deposit,
    "todayWithdraw" => (float)$withdraw,
    "todayNet" => (float)$deposit - (float)$withdraw,
    "handCash" => (float)$totalIn - (float)$totalOut
]);