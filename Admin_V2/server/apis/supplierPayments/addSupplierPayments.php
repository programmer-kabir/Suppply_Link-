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

// 🔹 Get data
$memo_no = $_POST['memo_no'] ?? '';
$date = $_POST['date'] ?? '';
$shop_name = $_POST['shop_name'] ?? '';
$supplier = $_POST['supplier'] ?? '';
$brand = $_POST['brand'] ?? '';
$total_amount = $_POST['total_amount'] ?? 0;
$paid = $_POST['paid'] ?? 0;
$due = $_POST['due'] ?? 0;
$remarks = $_POST['remarks'] ?? '';

// 🔹 Upload folder
$uploadDir = __DIR__ . "/../../uploads/";
$dbPath = "";

if (!file_exists($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

// 🔥 Handle image
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

  $tmpName = $_FILES['image']['tmp_name'];

  // 🔹 new name: telecomname_memono.webp
$safeMemo = preg_replace('/[^A-Za-z0-9]/', '', $memo_no);
$safeShop = preg_replace('/[^A-Za-z0-9]/', '_', strtolower($shop_name));
$safeShop = str_replace(' ', '_', $safeShop);

$fileName = $safeShop . "_" . $safeMemo . ".webp";
  $targetPath = $uploadDir . $fileName;

  // 🔹 Get image type
  $imageInfo = getimagesize($tmpName);

  if ($imageInfo === false) {
    echo json_encode(["success" => false, "message" => "Invalid image"]);
    exit;
  }

  $mime = $imageInfo['mime'];

  // 🔹 Create image resource
  switch ($mime) {
    case 'image/jpeg':
      $image = imagecreatefromjpeg($tmpName);
      break;
    case 'image/png':
      $image = imagecreatefrompng($tmpName);
      break;
    case 'image/gif':
      $image = imagecreatefromgif($tmpName);
      break;
    case 'image/webp':
      $image = imagecreatefromwebp($tmpName);
      break;
    default:
      echo json_encode(["success" => false, "message" => "Unsupported format"]);
      exit;
  }

  // 🔥 Convert to WEBP
  imagewebp($image, $targetPath, 80);
  imagedestroy($image);

  // 🔹 Save DB path
  $dbPath = "uploads/" . $fileName;
}

// 🔥 Insert query
$stmt = $mysqli->prepare("INSERT INTO supplier_payment 
(memo_no, date, shop_name, supplier, brand, total_amount, paid, due, image, remarks) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
  "ssssssddss",
  $memo_no,
  $date,
  $shop_name,
  $supplier,
  $brand,
  $total_amount,
  $paid,
  $due,
  $dbPath,
  $remarks
);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "Payment added successfully"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Insert failed",
    "error" => $stmt->error
  ]);
}