<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// Only POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
  ]);
  exit;
}

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? (int)$data["id"] : 0;

if ($id <= 0) {
  http_response_code(422);
  echo json_encode([
    "success" => false,
    "message" => "Valid id is required"
  ]);
  exit;
}

// Check exists (optional but safe)
$check = $mysqli->prepare("SELECT id FROM company_expenses WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$res = $check->get_result();

if ($res->num_rows === 0) {
  http_response_code(404);
  echo json_encode([
    "success" => false,
    "message" => "Expense not found"
  ]);
  exit;
}

// Delete
$stmt = $mysqli->prepare("DELETE FROM company_expenses WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "Expense deleted successfully",
    "deleted_id" => $id
  ]);
} else {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Delete failed",
    "error" => $stmt->error
  ]);
}
