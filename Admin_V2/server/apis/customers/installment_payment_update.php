<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");

function apiError($message, $debug = null, $code = 400) {
  http_response_code($code);
  echo json_encode([
    "success" => false,
    "message" => $message,
    "debug"   => $debug
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) apiError("Invalid JSON input");

$id             = (int)($input['id'] ?? 0);
$paid_date      = $input['paid_date'] ?? null;
$payment_method = $input['payment_method'] ?? null;
$receipt_number = $input['receipt_number'] ?? null;
$status         = $input['status'] ?? null;

// ✅ staff/user id who updated/collected
$collected_by   = (int)($input['signature'] ?? 0);

if ($id <= 0) apiError("Invalid installment ID");

// optional sanitize (avoid empty strings)
$paid_date = ($paid_date === "" ? null : $paid_date);
$payment_method = ($payment_method === "" ? null : $payment_method);
$receipt_number = ($receipt_number === "" ? null : $receipt_number);
$status = ($status === "" ? null : $status);

$sql = "
  UPDATE installment_payments SET
    paid_date = ?,
    payment_method = ?,
    receipt_number = ?,
    status = ?,
    collected_by = ?
  WHERE id = ?
";

$stmt = $mysqli->prepare($sql);
if (!$stmt) apiError("Prepare failed", $mysqli->error);

// paid_date nullable -> use "s" and pass null ok
$stmt->bind_param(
  "ssssii",
  $paid_date,
  $payment_method,
  $receipt_number,
  $status,
  $collected_by,
  $id
);

if (!$stmt->execute()) apiError("Execute failed", $stmt->error, 500);

echo json_encode([
  "success" => true,
  "message" => "Installment updated successfully",
  "updated_id" => $id,
  "collected_by" => $collected_by
], JSON_UNESCAPED_UNICODE);
