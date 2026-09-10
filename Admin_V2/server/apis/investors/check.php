<?php
// cors_test.php - ensure CORS headers are sent; returns request headers and a test message
require_once __DIR__ . '/../cors.php';

header('Content-Type: application/json; charset=utf-8');

$response = [
    'success' => true,
    'message' => 'CORS headers should be present on this response',
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'server_time' => date('c'),
    'received_origin' => isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null,
    'note' => 'If you call from browser fetch with an origin different from server, check browser console for CORS errors'
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
