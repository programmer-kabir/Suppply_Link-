<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once __DIR__ . '/../db.php';

// helper
function getBody() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

function sendJson($data, $status = 200) {
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

// read body
$body = getBody();

if (empty($body['id'])) {
    sendJson([
        "success" => false,
        "message" => "ID required"
    ], 400);
}

$id = intval($body['id']);

// delete query
$stmt = $mysqli->prepare("DELETE FROM cash WHERE id=?");

if (!$stmt) {
    sendJson([
        "success" => false,
        "message" => $mysqli->error
    ], 500);
}

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    sendJson([
        "success" => false,
        "message" => $stmt->error
    ], 500);
}

sendJson([
    "success" => true,
    "message" => "Deleted successfully"
]);