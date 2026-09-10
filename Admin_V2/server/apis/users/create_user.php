<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function fail($msg, $debug = null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $msg,
        "debug"   => $debug
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // ✅ Only POST
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ================== INPUT ==================
    $name       = trim($_POST['name'] ?? '');
    $mobile     = trim($_POST['mobile'] ?? '');
    $id_type    = trim($_POST['id_type'] ?? '');
    $id_number  = trim($_POST['id_number'] ?? '');
    $address    = trim($_POST['address'] ?? '');
    $start_date = $_POST['start_date'] ?? null;
    $password   = $_POST['password'] ?? '123';
    $role       = trim($_POST['role'] ?? '');

    // ================== VALIDATION ==================
    if ($name === '' || $mobile === '' || $id_number === '' || $address === '' || $role === '') {
        fail("Required field missing");
    }

    // ================== PHOTO UPLOAD (same idea as your code) ==================
    $photoPathDb = null;

    if (!empty($_FILES['photo']['name'])) {

        if ($_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
            fail("Photo upload error", $_FILES['photo']['error']);
        }

        // size limit 2MB
        if ($_FILES['photo']['size'] > 2 * 1024 * 1024) {
            fail("Image too large (max 2MB)");
        }

        $tmpName = $_FILES['photo']['tmp_name'];

        // mime check
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = finfo_file($finfo, $tmpName);
        finfo_close($finfo);

        $allowed = [
            "image/jpeg" => "jpg",
            "image/png"  => "png",
            "image/webp" => "webp",
        ];

        if (!isset($allowed[$mime])) {
            fail("Invalid image type. Only JPG/PNG/WEBP allowed", $mime);
        }

        $ext = $allowed[$mime];

        // ✅ filename from user name
        $base = strtolower($name);
        $base = preg_replace('/\s+/', '_', $base);
        $base = preg_replace('/[^a-z0-9_]/', '', $base);
        $base = trim($base, '_');
        if ($base === '') $base = 'user';

        // ✅ uploads folder like your code
        $uploadDir = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . "/uploads/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // ✅ duplicate handling: _1, _2, ...
        $filename = $base . "." . $ext;
        $i = 1;
        while (file_exists($uploadDir . $filename)) {
            $filename = $base . "_" . $i . "." . $ext;
            $i++;
        }

        if (!move_uploaded_file($tmpName, $uploadDir . $filename)) {
            fail("Failed to save image");
        }

        // ✅ DB value
        $photoPathDb = "uploads/" . $filename;
    }

    // ================== TRANSACTION ==================
    $mysqli->begin_transaction();

    // ================== INSERT users ==================
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
        $photoPathDb
    );

    $stmt->execute();
    $user_id = $stmt->insert_id;

    if (!$user_id) {
        throw new Exception("User insert failed");
    }

    // ================== INSERT user_roles ==================
    $stmtRole = $mysqli->prepare("
        INSERT INTO user_roles (user_id, role, assigned_at)
        VALUES (?, ?, NOW())
    ");
    $stmtRole->bind_param("is", $user_id, $role);
    $stmtRole->execute();

    $mysqli->commit();

    echo json_encode([
        "success" => true,
        "message" => "User created successfully",
        "user_id" => (int)$user_id,
        "photo"   => $photoPathDb
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    try { $mysqli->rollback(); } catch (Throwable $t) {}

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "User create failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

