<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

function sendJson($data, $status = 200) {
    http_response_code($status);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$id = intval($input['id'] ?? 0);
$delete_reason = trim($input['delete_reason'] ?? '');
$user_id = intval($input['user_id'] ?? 0);

if ($id <= 0) {
    sendJson(["success" => false, "message" => "Valid Transaction ID is required"], 400);
}

if (empty($delete_reason)) {
    sendJson(["success" => false, "message" => "মুছে ফেলার কারণ (Delete reason) আবশ্যক!"], 400);
}

// Check record
$stmt = $mysqli->prepare("SELECT id, is_deleted FROM cash WHERE id = ? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if (!$row) {
    sendJson(["success" => false, "message" => "Transaction not found"], 404);
}

if (intval($row['is_deleted'] ?? 0) === 1) {
    sendJson(["success" => false, "message" => "Transaction already deleted"], 400);
}

// Perform soft delete
$delStmt = $mysqli->prepare("
    UPDATE cash
    SET
        is_deleted = 1,
        deleted_at = NOW(),
        deleted_by = ?,
        delete_reason = ?
    WHERE id = ?
");

if (!$delStmt) {
    sendJson(["success" => false, "message" => "Prepare delete failed: " . $mysqli->error], 500);
}

$delStmt->bind_param("isi", $user_id, $delete_reason, $id);

if (!$delStmt->execute()) {
    sendJson(["success" => false, "message" => "Execute delete failed: " . $delStmt->error], 500);
}

sendJson([
    "success" => true,
    "message" => "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে!"
]);
