<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["success" => false, "message" => "Method not allowed"], JSON_UNESCAPED_UNICODE);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid JSON"], JSON_UNESCAPED_UNICODE);
  exit;
}

$id          = isset($data["id"]) ? (int)$data["id"] : 0;
$expense_date= isset($data["expense_date"]) ? trim((string)$data["expense_date"]) : "";
$title       = isset($data["title"]) ? trim((string)$data["title"]) : "";
$details     = isset($data["details"]) ? trim((string)$data["details"]) : null;
$amount_raw  = $data["amount"] ?? null;

if ($id <= 0) { http_response_code(422); echo json_encode(["success"=>false,"message"=>"id is required"], JSON_UNESCAPED_UNICODE); exit; }
if ($expense_date === "") { http_response_code(422); echo json_encode(["success"=>false,"message"=>"expense_date is required"], JSON_UNESCAPED_UNICODE); exit; }
if ($title === "") { http_response_code(422); echo json_encode(["success"=>false,"message"=>"title is required"], JSON_UNESCAPED_UNICODE); exit; }
if ($amount_raw === null || $amount_raw === "" || !is_numeric($amount_raw)) {
  http_response_code(422);
  echo json_encode(["success"=>false,"message"=>"amount must be numeric"], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($details === "") $details = null;
$amount = (float)$amount_raw;

$stmt = $mysqli->prepare("UPDATE company_expenses SET expense_date=?, title=?, details=?, amount=? WHERE id=?");
$stmt->bind_param("sssdi", $expense_date, $title, $details, $amount, $id);

if ($stmt->execute()) {
  echo json_encode(["success"=>true,"message"=>"Expense updated successfully"], JSON_UNESCAPED_UNICODE);
} else {
  http_response_code(500);
  echo json_encode(["success"=>false,"message"=>"Update failed","error"=>$stmt->error], JSON_UNESCAPED_UNICODE);
}
