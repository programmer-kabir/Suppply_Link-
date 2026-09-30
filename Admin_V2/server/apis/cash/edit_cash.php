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
$edit_reason = trim($input['edit_reason'] ?? '');
$amount = isset($input['amount']) ? floatval($input['amount']) : null;
$date = trim($input['date'] ?? '');
$source = trim($input['source'] ?? '');
$purpose = trim($input['purpose'] ?? '');
$category = trim($input['category'] ?? '');
$remarks = trim($input['remarks'] ?? '');
$refId = trim($input['refId'] ?? '');
$user_id = intval($input['user_id'] ?? 0);
$user_name = trim($input['user_name'] ?? 'Admin');

if ($id <= 0) {
    sendJson(["success" => false, "message" => "Valid Transaction ID is required"], 400);
}

if (empty($edit_reason)) {
    sendJson(["success" => false, "message" => "সম্পাদনার কারণ (Edit reason) আবশ্যক!"], 400);
}

if ($amount === null || $amount <= 0) {
    sendJson(["success" => false, "message" => "সঠিক টাকার পরিমাণ আবশ্যক!"], 400);
}

if (empty($date) || !strtotime($date)) {
    sendJson(["success" => false, "message" => "সঠিক তারিখ আবশ্যক!"], 400);
}

// 1. Fetch current transaction record
$stmt = $mysqli->prepare("SELECT * FROM cash WHERE id = ? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();

if (!$existing) {
    sendJson(["success" => false, "message" => "Transaction not found"], 404);
}

if (intval($existing['is_deleted'] ?? 0) === 1) {
    sendJson(["success" => false, "message" => "Cannot edit a deleted transaction"], 400);
}

// 2. Build history snapshot
$snapshot = [
    "amount" => (float)$existing['amount'],
    "source" => $existing['source'],
    "purpose" => $existing['purpose'],
    "category" => $existing['category'],
    "refId" => $existing['refId'],
    "remarks" => $existing['remarks'],
    "date" => $existing['date'],
    "edited_at" => date("Y-m-d H:i:s"),
    "edited_by" => $user_id,
    "editor_name" => $user_name,
    "edit_reason" => $edit_reason
];

$history = json_decode($existing['edit_history'] ?? '[]', true) ?: [];
$history[] = $snapshot;
$historyJson = json_encode($history, JSON_UNESCAPED_UNICODE);

// 3. Update record with new values
$updateStmt = $mysqli->prepare("
    UPDATE cash
    SET
        source = ?,
        purpose = ?,
        category = ?,
        amount = ?,
        date = ?,
        remarks = ?,
        refId = ?,
        edit_history = ?,
        updated_at = NOW(),
        updated_by = ?,
        last_edit_reason = ?
    WHERE id = ?
");

if (!$updateStmt) {
    sendJson(["success" => false, "message" => "Prepare update failed: " . $mysqli->error], 500);
}

$updateStmt->bind_param(
    "sssdssssisi",
    $source,
    $purpose,
    $category,
    $amount,
    $date,
    $remarks,
    $refId,
    $historyJson,
    $user_id,
    $edit_reason,
    $id
);

if (!$updateStmt->execute()) {
    sendJson(["success" => false, "message" => "Execute update failed: " . $updateStmt->error], 500);
}

sendJson([
    "success" => true,
    "message" => "লেনদেন সফলভাবে আপডেট করা হয়েছে!",
    "id" => $id,
    "historyCount" => count($history)
]);
