<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "error" => "Invalid request method"
    ]);
    exit;
}

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["id"]) || $input["id"] === "") {
    echo json_encode([
        "success" => false,
        "error" => "Missing field: id"
    ]);
    exit;
}

$id = (int) $input["id"];

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid id"
    ]);
    exit;
}

// (Optional) Check row exists
$check = $mysqli->prepare("SELECT id FROM investment_installments WHERE id=? LIMIT 1");
if (!$check) {
    echo json_encode(["success" => false, "error" => "Prepare failed: " . $mysqli->error]);
    exit;
}
$check->bind_param("i", $id);
$check->execute();
$res = $check->get_result();
if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Installment not found"]);
    exit;
}
$check->close();

// Prepare SQL
$sql = "DELETE FROM investment_installments WHERE id = ?";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Prepare failed: " . $mysqli->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

// Execute
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Installment deleted successfully",
        "affected_rows" => $stmt->affected_rows
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Execute failed: " . $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();
