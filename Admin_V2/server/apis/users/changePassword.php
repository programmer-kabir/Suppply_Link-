<?php


require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';
$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"] ?? null;
$current_password = $data["current_password"] ?? "";
$new_password = $data["new_password"] ?? "";

if (!$user_id || !$current_password || !$new_password) {
    echo json_encode([
        "success" => false,
        "message" => "সব password field দেওয়া লাগবে"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$dbUser = $result->fetch_assoc();

if (!$dbUser) {
    echo json_encode([
        "success" => false,
        "message" => "User পাওয়া যায়নি"
    ]);
    exit;
}

// আগের মতো plain password মিলিয়ে দেখা
if ($current_password !== $dbUser["password"]) {
    echo json_encode([
        "success" => false,
        "message" => "বর্তমান password সঠিক নয়"
    ]);
    exit;
}

// MySQL-এ plain password update
$update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$update->bind_param("si", $new_password, $user_id);

if ($update->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "MySQL password updated"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Password update failed"
    ]);
}<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"] ?? null;
$current_password = $data["current_password"] ?? "";
$new_password = $data["new_password"] ?? "";

if (!$user_id || !$current_password || !$new_password) {
    echo json_encode([
        "success" => false,
        "message" => "সব password field দেওয়া লাগবে"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "User পাওয়া যায়নি"
    ]);
    exit;
}

/*
 পুরোনো database-এ plain password আছে বলে দুইভাবেই check করা হয়েছে।
 সব user password একবার update হওয়ার পর শুধু password_verify রাখবি।
*/
$isValidPassword = password_verify($current_password, $user["password"]) 
    || $current_password === $user["password"];

if (!$isValidPassword) {
    echo json_encode([
        "success" => false,
        "message" => "বর্তমান password সঠিক নয়"
    ]);
    exit;
}

$hashedPassword = password_hash($new_password, PASSWORD_DEFAULT);

$update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$update->bind_param("si", $hashedPassword, $user_id);

if ($update->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Password changed successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Password change failed"
    ]);
}