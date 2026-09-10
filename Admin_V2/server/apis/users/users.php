<?php 

$host = $_SERVER['HTTP_HOST'] ?? ''; 
$isLocal = (strpos($host, 'localhost') !== false) || (strpos($host, '127.0.0.1') !== false); 

session_set_cookie_params([ 
    'lifetime' => 0, 
    'path' => '/', 
    'domain' => $isLocal ? '' : '.supplylinkbd.com', 
    'secure' => $isLocal ? false : true, 
    'httponly' => true, 
    'samesite' => $isLocal ? 'Lax' : 'None', 
]); 

session_start(); 

require_once __DIR__ . '/../db.php'; 
require_once __DIR__ . '/../cors.php'; 

header("Content-Type: application/json"); 

// ================= TEMP DEBUG (production এ OFF করবেন) ================= 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL); 
// ======================================================================= 

// ================= ERROR HANDLER ================= 
function apiError($message, $debug = null, $code = 500) { 
    http_response_code($code); 

    $res = [ 
        "success" => false, 
        "message" => $message 
    ]; 

    if ($debug !== null) { 
        $res["debug"] = $debug; 
    } 

    echo json_encode($res, JSON_UNESCAPED_UNICODE); 
    exit; 
} 
// ================================================= 

$sql = " 
    SELECT  
        u.id, 
        u.name, 
        u.mobile, 
        u.id_number, 
        u.address, 
        u.password, 
        u.photo, 
        GROUP_CONCAT(DISTINCT ur.role) AS roles 
    FROM users u 
    LEFT JOIN user_roles ur  
        ON ur.user_id = u.id 
    GROUP BY  
        u.id, 
        u.name, 
        u.mobile, 
        u.id_number, 
        u.address, 
        u.password, 
        u.photo 
    ORDER BY u.id ASC 
"; 

$result = $mysqli->query($sql); 

if (!$result) { 
    apiError("Query failed", $mysqli->error); 
} 

// ================= RESULT BUILD ================= 
$data = []; 

while ($row = $result->fetch_assoc()) { 

    $row["id"] = (int) $row["id"]; 

    // roles string → array 
    $row["roles"] = !empty($row["roles"]) 
        ? explode(",", $row["roles"]) 
        : []; 

    $data[] = $row; 
} 
// ================================================= 

// ================= FINAL RESPONSE ================= 
echo json_encode([ 
    "success" => true, 
    "total"   => count($data), 
    "data"    => $data 
], JSON_UNESCAPED_UNICODE);