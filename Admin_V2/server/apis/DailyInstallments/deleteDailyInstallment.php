<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;

// ✅ VALIDATION
if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID is required!"
    ]);
    exit;
}

// 🔥 EXIST CHECK (optional but good)
$stmt = $mysqli->prepare("
    SELECT id FROM daily_installments 
    WHERE id = ?
    LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Installment not found ❌"
    ]);
    exit;
}

// 🔥 DELETE
$stmt = $mysqli->prepare("
    DELETE FROM daily_installments 
    WHERE id = ?
");

$stmt->bind_param("i", $id);
$success = $stmt->execute();

if (!$success) {
    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);
    exit;
}

// ✅ SUCCESS RESPONSE
echo json_encode([
    "success" => true,
    "message" => "Installment deleted ✅",
    "deleted_id" => $id
]);