<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// Only POST allowed
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Method not allowed. Use POST."
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Invalid JSON body."
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// Required fields
$expense_date = isset($data["expense_date"]) ? trim((string)$data["expense_date"]) : "";
$title        = isset($data["title"]) ? trim((string)$data["title"]) : "";
$amount_raw   = $data["amount"] ?? null;

// Optional field
$details      = isset($data["details"]) ? trim((string)$data["details"]) : null;
if ($details === "") $details = null; // empty string -> NULL

// Validate required
if ($expense_date === "") {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "expense_date is required."], JSON_UNESCAPED_UNICODE);
  exit;
}
if ($title === "") {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "title is required."], JSON_UNESCAPED_UNICODE);
  exit;
}
if ($amount_raw === null || $amount_raw === "") {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "amount is required."], JSON_UNESCAPED_UNICODE);
  exit;
}

// Date format check YYYY-MM-DD
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $expense_date)) {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "expense_date must be YYYY-MM-DD."], JSON_UNESCAPED_UNICODE);
  exit;
}

// Amount validate
if (!is_numeric($amount_raw)) {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "amount must be numeric."], JSON_UNESCAPED_UNICODE);
  exit;
}

$amount = (float)$amount_raw;
if ($amount <= 0) {
  http_response_code(422);
  echo json_encode(["success" => false, "message" => "amount must be greater than 0."], JSON_UNESCAPED_UNICODE);
  exit;
}

/**
 * ✅ Insert
 * details optional -> NULL allowed
 */
$sql = "INSERT INTO company_expenses (expense_date, title, details, amount)
        VALUES (?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Prepare failed",
    "error"   => $mysqli->error
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// Bind: date(s), title(s), details(s or null), amount(d)
$stmt->bind_param("sssd", $expense_date, $title, $details, $amount);

$ok = $stmt->execute();
if (!$ok) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Insert failed",
    "error"   => $stmt->error
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$newId = (int)$stmt->insert_id;

// Return inserted row (same vibe as your list response)
echo json_encode([
  "success" => true,
  "message" => "Expense created successfully",
  "data" => [
    "id" => $newId,
    "expense_date" => $expense_date,
    "title" => $title,
    "details" => $details,     // null or string
    "amount" => (float)$amount
  ]
], JSON_UNESCAPED_UNICODE);
