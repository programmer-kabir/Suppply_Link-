<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$amount   = $data['amount'] ?? null;
$date     = $data['date'] ?? null;
$receiver = $data['receiver'] ?? null;
$userId   = $data['userId'] ?? null;
$cardId   = $data['cardId'] ?? null;

// VALIDATION
if (!$amount || !$date || !$receiver || !$userId || !$cardId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All fields are required!"
    ]);
    exit;
}

if (!is_numeric($amount)) {
    echo json_encode([
        "success" => false,
        "message" => "Amount must be number"
    ]);
    exit;
}

// 🔥 DUPLICATE CHECK
$stmt = $mysqli->prepare("
    SELECT id FROM daily_installments 
    WHERE userId = ? AND cardId = ? AND date = ? LIMIT 1
");

$stmt->bind_param("iis", $userId, $cardId, $date);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Already added for this date ❌"
    ]);
    exit;
}

// 🔥 INSERT
$stmt = $mysqli->prepare("
    INSERT INTO daily_installments 
    (userId, cardId, amount, date, receiver) 
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("iidss", $userId, $cardId, $amount, $date, $receiver);
$stmt->execute();

$insertId = $stmt->insert_id;

// 🔥 FETCH
$result = $mysqli->query("SELECT * FROM daily_installments WHERE id = $insertId");
$row = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "message" => "Payment Added ✅",
    "data" => $row
]);