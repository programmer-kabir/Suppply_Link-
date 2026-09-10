<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$user_id            = $_POST['user_id'] ?? null;
$card_id            = $_POST['card_id'] ?? null;
$has_cheque         = $_POST['has_cheque'] ?? 'no';
$file_received_date = date('Y-m-d');
$approved_by        = $_POST['approved_by'] ?? null;
$remarks            = $_POST['remarks'] ?? null;

if (!$user_id || !$card_id || !$approved_by) {
    echo json_encode([
        'success' => false,
        'message' => 'user_id, card_id and approved_by are required'
    ]);
    exit;
}

$stmt = $mysqli->prepare("
    INSERT INTO installment_files (
        user_id,
        card_id,
        has_cheque,
        file_received_date,
        approved_by,
        remarks,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, 'approved')
");

$stmt->bind_param(
    "iissis",
    $user_id,
    $card_id,
    $has_cheque,
    $file_received_date,
    $approved_by,
    $remarks
);

if ($stmt->execute()) {

    echo json_encode([
        'success' => true,
        'message' => 'Installment file added successfully',
        'id' => $mysqli->insert_id
    ]);

} else {

    echo json_encode([
        'success' => false,
        'message' => $stmt->error
    ]);

}

$stmt->close();
$mysqli->close();