<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // ================== INPUT ==================
    $name       = trim($_POST['name'] ?? '');
    $mobile     = trim($_POST['mobile'] ?? '');
    $id_type    = trim($_POST['id_type'] ?? '');
    $id_number  = trim($_POST['id_number'] ?? '');
    $address    = trim($_POST['address'] ?? '');
    $start_date = $_POST['start_date'] ?? null;
    $password   = $_POST['password'] ?? '123';
    $role       = trim($_POST['role'] ?? '');
    $photo = $_POST['photot'] ?? null;

    // ================== VALIDATION ==================
    if (
        $name === '' ||
        $mobile === '' ||
        $id_number === '' ||
        $address === '' ||
        $role === ''
    ) {
        throw new Exception("Required field missing");
    }

    // ================== TRANSACTION START ==================
    $mysqli->begin_transaction();

    // ================== INSERT INTO users ==================
    $stmt = $mysqli->prepare("
        INSERT INTO users
        (name, mobile, id_type, id_number, address, start_date, password, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssssssss",
        $name,
        $mobile,
        $id_type,
        $id_number,
        $address,
        $start_date,
        $password,
        $photo
    );

    $stmt->execute();

    // 🔑 NEW USER ID
    $user_id = $stmt->insert_id;

    if (!$user_id) {
        throw new Exception("User insert failed");
    }

    // ================== INSERT INTO user_roles ==================
    $stmtRole = $mysqli->prepare("
        INSERT INTO user_roles (user_id, role, assigned_at)
        VALUES (?, ?, NOW())
    ");

    $stmtRole->bind_param("is", $user_id, $role);
    $stmtRole->execute();

    // ================== COMMIT ==================
    $mysqli->commit();

    echo json_encode([
        "success" => true,
        "message" => "User created successfully",
        "user_id" => $user_id
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // ❌ ROLLBACK IF ANY FAIL
    if ($mysqli->errno) {
        $mysqli->rollback();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "User create failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
