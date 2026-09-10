<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "POST only"
    ]);
    exit;
}

$id = (int)($_POST["id"] ?? 0);

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing ID"
    ]);
    exit;
}

$date = $_POST["date"] ?? "";
$brand = $_POST["brand"] ?? "";
$model = $_POST["model"] ?? "";
$variant = $_POST["variant"] ?? "";
$color = $_POST["color"] ?? "";
$purchase_price = $_POST["purchase_price"] ?? 0;
$mrp = $_POST["mrp"] ?? 0;
$supplier = $_POST["supplier"] ?? "";
$status = $_POST["status"] ?? "available";

$oldImage = $_POST["old_image"] ?? "";
$imagePath = $oldImage;

if (
    isset($_FILES["image"]) &&
    $_FILES["image"]["error"] === 0
) {

    $uploadDir = "../uploads/mobile/";

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $ext = pathinfo(
        $_FILES["image"]["name"],
        PATHINFO_EXTENSION
    );

    $fileName =
        time() .
        "_" .
        uniqid() .
        "." .
        $ext;

    move_uploaded_file(
        $_FILES["image"]["tmp_name"],
        $uploadDir . $fileName
    );

    $imagePath = "uploads/mobile/" . $fileName;

    // old image delete
    if (
        !empty($oldImage) &&
        file_exists("../" . $oldImage)
    ) {
        unlink("../" . $oldImage);
    }
}

$stmt = $mysqli->prepare("
UPDATE Stock_Inventory SET
date=?,
brand=?,
model=?,
image=?,
variant=?,
color=?,
purchase_price=?,
mrp=?,
supplier=?,
status=?
WHERE id=?
");

$stmt->bind_param(
    "ssssssddssi",
    $date,
    $brand,
    $model,
    $imagePath,
    $variant,
    $color,
    $purchase_price,
    $mrp,
    $supplier,
    $status,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}