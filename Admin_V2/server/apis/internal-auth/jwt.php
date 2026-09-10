<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = "SUPPLYLINK_INTERNAL_SECRET_2025";

function generateJWT($payload) {
    global $JWT_SECRET;
    return JWT::encode($payload, $JWT_SECRET, 'HS256');
}

function verifyJWT($token) {
    global $JWT_SECRET;
    return JWT::decode($token, new Key($JWT_SECRET, 'HS256'));
}
