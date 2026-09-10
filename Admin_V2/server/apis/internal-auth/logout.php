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

if (!empty($_SESSION['user']['id'])) {
    require_once __DIR__ . "/../helpers/log_activity.php";
    logActivity("auth", "logout", "User logged out", "user", (int)$_SESSION['user']['id']);
}

session_destroy();

echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
