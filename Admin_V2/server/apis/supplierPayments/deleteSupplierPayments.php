<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

// OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// Only DELETE
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
  http_response_code(405);
  echo json_encode([
    "success" => false,
    "message" => "Use DELETE method"
  ]);
  exit;
}

// 🔹 Get ID from URL
$id = $_GET['id'] ?? null;

if (!$id) {
  echo json_encode([
    "success" => false,
    "message" => "ID required"
  ]);
  exit;
}

// 🔥 Get image path first
$result = $mysqli->query("SELECT image FROM supplier_payment WHERE id = $id");

if ($result->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "Data not found"
  ]);
  exit;
}

$row = $result->fetch_assoc();
$imagePath = $row['image'];

// 🔥 Delete image file
if ($imagePath) {
  $fullPath = __DIR__ . "/../../" . $imagePath;

  if (file_exists($fullPath)) {
    unlink($fullPath);
  }
}

// 🔥 Delete DB row
$delete = $mysqli->query("DELETE FROM supplier_payment WHERE id = $id");

if ($delete) {
  echo json_encode([
    "success" => true,
    "message" => "Deleted successfully"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Delete failed",
    "error" => $mysqli->error
  ]);
}