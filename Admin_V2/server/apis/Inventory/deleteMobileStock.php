<?php

// ✅ CORS FIRST
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

// OPTIONS (preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// ✅ Only DELETE allowed
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Method not allowed. Use DELETE."
  ]);
  exit;
}

// ✅ GET id from query (?id=)
if (!isset($_GET["id"])) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Missing ID"
  ]);
  exit;
}

$id = (int)$_GET["id"];

// ✅ DELETE query
$stmt = $mysqli->prepare("DELETE FROM Stock_Inventory WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {

  if ($stmt->affected_rows > 0) {
    echo json_encode([
      "success" => true,
      "message" => "Deleted successfully"
    ]);
  } else {
    echo json_encode([
      "success" => false,
      "message" => "No record found"
    ]);
  }

} else {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Delete failed",
    "error" => $stmt->error
  ]);
}