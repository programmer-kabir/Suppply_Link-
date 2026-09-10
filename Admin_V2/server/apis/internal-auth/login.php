<?php
$isLocal = (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') && (
    ($_SERVER['HTTP_HOST'] ?? '') === 'localhost' || 
    strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') !== false ||
    strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false
);

if ($isLocal) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
} else {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '.supplylinkbd.com',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
}

session_start();

require_once "../cors.php";
require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$password = $data['password'] ?? null;

if (!$id || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "ID and password required"]);
    exit;
}

/* 🔥 STEP 1: USER + ALL ROLES FETCH (Supports DB id, id_number, or mobile) */
$stmt = $mysqli->prepare("
    SELECT u.id, u.password, r.role
    FROM users u
    JOIN user_roles r ON r.user_id = u.id
    WHERE u.id = ? OR u.id_number = ? OR u.mobile = ?
");
$stmt->bind_param("sss", $id, $id, $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid credentials"]);
    exit;
}

/* 🔥 STEP 2: ALL ROLE COLLECT */
$roles = [];
$userData = null;

while ($row = $res->fetch_assoc()) {
    if (!$userData) {
        $userData = $row; // প্রথম row থেকে password নিবো
    }
    $roles[] = $row['role'];
}

/* 🔥 STEP 3: PASSWORD CHECK */
if ($password !== $userData['password']) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid credentials"]);
    exit;
}

/* 🔥 STEP 4: SESSION SAVE (ARRAY ROLE) */
$_SESSION['user'] = [
    "id" => (int)$userData['id'],
    "role" => $roles // ✅ multiple role array
];

/* 🔥 ACTIVITY LOG */
require_once __DIR__ . "/../helpers/log_activity.php";

logActivity(
    "auth",
    "login",
    "User logged in",
    "user",
    (int)$userData['id'],
    null,
    [
        "login_id" => $id,
        "roles" => $roles
    ]
);

/* 🔥 RESPONSE */
echo json_encode([
    "user" => $_SESSION['user']
], JSON_UNESCAPED_UNICODE);