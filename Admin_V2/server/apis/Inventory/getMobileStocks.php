<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// OPTIONS handle (CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

// Only GET allowed
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Method not allowed. Use GET."
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

/**
 * ✅ Fetch all stock
 */
$sql = "SELECT * FROM Stock_Inventory ORDER BY id ASC";

$result = $mysqli->query($sql);

if (!$result) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Query failed",
    "error"   => $mysqli->error
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$stocks = [];

while ($row = $result->fetch_assoc()) {
  $stocks[] = [
    "id" => (int)$row["id"],
    "date" => $row["date"],
    "brand" => $row["brand"],
    "model" => $row["model"],
    "imei1" => $row["imei1"],
    "imei2" => $row["imei2"],
    "variant" => $row["variant"],
    "color" => $row["color"],
    "purchase_price" => (float)$row["purchase_price"],
    "mrp" => (float)$row["mrp"],
    "supplier" => $row["supplier"],
    "status" => $row["status"],
    "created_at" => $row["created_at"]
  ];
}

echo json_encode([
  "success" => true,
  "data" => $stocks
], JSON_UNESCAPED_UNICODE);