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
        "message" => "Method not allowed"
    ]);

    exit;
}

// ======================
// FORM DATA
// ======================

$date = $_POST["date"] ?? null;
$brand = $_POST["brand"] ?? "";
$model = $_POST["model"] ?? "";
$variant = $_POST["variant"] ?? "";
$color = $_POST["color"] ?? "";
$purchase_price = $_POST["purchase_price"] ?? 0;
$mrp = $_POST["mrp"] ?? 0;
$supplier = $_POST["supplier"] ?? "";
$status = $_POST["status"] ?? "available";

// ======================
// IMAGE UPLOAD (OPTIONAL)
// ======================

$imagePath = null;

if (
    isset($_FILES["image"]) &&
    $_FILES["image"]["error"] === 0
) {

    $uploadDir = "../uploads/mobile/";

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = pathinfo(
        $_FILES["image"]["name"],
        PATHINFO_EXTENSION
    );

    $fileName =
        time() .
        "_" .
        uniqid() .
        "." .
        $extension;

    $destination = $uploadDir . $fileName;

    if (
        move_uploaded_file(
            $_FILES["image"]["tmp_name"],
            $destination
        )
    ) {
        $imagePath = "uploads/mobile/" . $fileName;
    }
}

// ======================
// INSERT
// ======================

$stmt = $mysqli->prepare("
    INSERT INTO Stock_Inventory
    (
        date,
        brand,
        model,
        image,
        variant,
        color,
        purchase_price,
        mrp,
        supplier,
        status
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $mysqli->error
    ]);
    exit;
}

$stmt->bind_param(
    "ssssssddss",
    $date,
    $brand,
    $model,
    $imagePath,
    $variant,
    $color,
    $purchase_price,
    $mrp,
    $supplier,
    $status
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Stock added successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Insert failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();

?>