<?php

// ✅ CORS FIRST
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

// OPTIONS handle
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// Only GET allowed
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Method not allowed. Use GET."
  ]);
  exit;
}

// 🔥 Query
$sql = "SELECT * FROM supplier_payment ORDER BY id ASC";
$result = $mysqli->query($sql);

if (!$result) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Query failed",
    "error" => $mysqli->error
  ]);
  exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = [
    "id" => (int)$row["id"],
    "memo_no" => $row["memo_no"],
    "date" => $row["date"],
    "shop_name" => $row["shop_name"],
    "supplier" => $row["supplier"],
    "brand" => $row["brand"],
    "total_amount" => (float)$row["total_amount"],
    "paid" => (float)$row["paid"],
    "due" => (float)$row["due"],
    "image" => $row["image"],
    "remarks" => $row["remarks"]
  ];
}

// ✅ response
echo json_encode([
  "success" => true,
  "data" => $data
]);