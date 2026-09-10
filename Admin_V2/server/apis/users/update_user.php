<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function fail($msg, $debug = null, $code = 400) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $msg,
        "debug"   => $debug
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Only POST allowed
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        fail("Only POST request is allowed", null, 405);
    }

    // Input fields
    $id        = intval($_POST['id'] ?? $_POST['user_id'] ?? 0);
    $name      = trim($_POST['name'] ?? '');
    $mobile    = trim($_POST['mobile'] ?? '');
    $id_number = trim($_POST['id_number'] ?? '');
    $address   = trim($_POST['address'] ?? '');

    // Validation
    if (!$id) {
        fail("User ID is required");
    }
    if ($name === '') {
        fail("Name field is required");
    }
    if ($mobile === '') {
        fail("Mobile field is required");
    }

    // Check if user exists
    $stmt = $mysqli->prepare("SELECT id, name, photo FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $dbUser = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$dbUser) {
        fail("User not found");
    }

    // Photo Upload handling (optional)
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

        // filename from user name
        $base = strtolower($name);
        $base = preg_replace('/\s+/', '_', $base);
        $base = preg_replace('/[^a-z0-9_]/', '', $base);
        $base = trim($base, '_');
        if ($base === '') $base = 'user_' . $id;

        // upload directory
        $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/\\');
        $uploadDir = $docRoot ? $docRoot . "/uploads/" : __DIR__ . "/../../uploads/";
        if (!is_dir($uploadDir)) {
            $uploadDir = __DIR__ . "/../../uploads/";
        }
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // duplicate handling: _1, _2, ...
        $filename = $base . "." . $ext;
        $i = 1;
        while (file_exists($uploadDir . $filename)) {
            $filename = $base . "_" . $i . "." . $ext;
            $i++;
        }

        if (!move_uploaded_file($tmpName, $uploadDir . $filename)) {
            fail("Failed to save image");
        }

        $photoPathDb = "uploads/" . $filename;
    }

    // Update Database
    if ($photoPathDb !== null) {
        $update = $mysqli->prepare("
            UPDATE users 
            SET name = ?, mobile = ?, id_number = ?, address = ?, photo = ? 
            WHERE id = ?
        ");
        $update->bind_param("sssssi", $name, $mobile, $id_number, $address, $photoPathDb, $id);
    } else {
        $update = $mysqli->prepare("
            UPDATE users 
            SET name = ?, mobile = ?, id_number = ?, address = ? 
            WHERE id = ?
        ");
        $update->bind_param("ssssi", $name, $mobile, $id_number, $address, $id);
    }

    $update->execute();
    $update->close();

    echo json_encode([
        "success" => true,
        "message" => "User updated successfully",
        "user_id" => $id,
        "photo"   => $photoPathDb ?? $dbUser['photo']
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    fail("User update failed: " . $e->getMessage(), null, 500);
}