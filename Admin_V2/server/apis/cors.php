<?php
// cors.php - include this at top of API files
// CHANGE $allowedOrigin to production origin when ready
// $allowedOrigin = 'https://admin.supplylinkbd.com'; // dev: '*' ; prod: 'https://app.yourdomain.com'
// // $allowedOrigin = 'http://localhost:5173'; // dev: '*' ; prod: 'https://app.yourdomain.com'
// // 
// if (isset($_SERVER['HTTP_ORIGIN'])) {
//     // optionally validate origin here
//     header("Access-Control-Allow-Origin: $allowedOrigin");
    
// } else {
//     header("Access-Control-Allow-Origin: $allowedOrigin");
// }
// header("Access-Control-Allow-Credentials: true");

// header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// header("Access-Control-Max-Age: 86400"); // 24 hours

// // If you plan to use cookies/auth with credentials:
// // header("Access-Control-Allow-Credentials: true"); // then $allowedOrigin cannot be '*'

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     // preflight request — short-circuit
//     http_response_code(204);
//     exit;
// }



$allowedOrigins = [
    'http://localhost:5173',
    'https://management.supplylinkbd.com',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}