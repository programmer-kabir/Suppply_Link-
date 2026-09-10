<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

// OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// Only POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Use POST request"
  ]);
  exit;
}

// 🔹 Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$memo_no = $data['memo_no'] ?? '';
$date = $data['date'] ?? '';
$shop_name = $data['shop_name'] ?? '';
$supplier = $data['supplier'] ?? '';
$brand = $data['brand'] ?? '';
$total_amount = $data['total_amount'] ?? 0;
$paid = $data['paid'] ?? 0;
$due = $data['due'] ?? 0;
$remarks = $data['remarks'] ?? '';

// 🔴 ID check
if (!$id) {
  echo json_encode([
    "success" => false,
    "message" => "ID is required"
  ]);
  exit;
}

// 🔥 Update query (image untouched)
$stmt = $mysqli->prepare("UPDATE supplier_payment SET 
memo_no = ?, 
date = ?, 
shop_name = ?, 
supplier = ?, 
brand = ?, 
total_amount = ?, 
paid = ?, 
due = ?, 
remarks = ?
WHERE id = ?");

$stmt->bind_param(
  "ssssssddsi",
  $memo_no,
  $date,
  $shop_name,
  $supplier,
  $brand,
  $total_amount,
  $paid,
  $due,
  $remarks,
  $id
);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "Payment updated successfully"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Update failed",
    "error" => $stmt->error
  ]);
}