<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    $user_id = (int) ($_POST['user_id'] ?? 0);
    $role    = trim($_POST['role'] ?? '');

    if ($user_id <= 0 || $role === '') {
        throw new Exception("User ID and role required");
    }

    // optional: check user exists
    $check = $mysqli->prepare("SELECT id FROM users WHERE id = ?");
    $check->bind_param("i", $user_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows === 0) {
        throw new Exception("User not found");
    }

    // insert role
    $stmt = $mysqli->prepare("
        INSERT INTO user_roles (user_id, role, assigned_at)
        VALUES (?, ?, NOW())
    ");
    $stmt->bind_param("is", $user_id, $role);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Role assigned successfully"
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Role assign failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
