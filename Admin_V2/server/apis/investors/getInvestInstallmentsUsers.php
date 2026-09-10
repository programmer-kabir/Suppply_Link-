<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// Check if id exists AND not empty
$hasFilter = isset($_GET["id"]) && $_GET["id"] !== "";

if ($hasFilter) {

    // Filter by investor ID
    $investor_id = (int) $_GET["id"];

    $sql = "SELECT * FROM investors WHERE id = ? LIMIT 1";
    $stmt = $mysqli->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "error"   => "Prepare failed: " . $mysqli->error
        ]);
        exit;
    }

    $stmt->bind_param("i", $investor_id);
    $stmt->execute();
    $result = $stmt->get_result();

} else {

    // No filter → return all investors
    $sql = "SELECT * FROM investors ORDER BY id DESC";
    $result = $mysqli->query($sql);

    if (!$result) {
        echo json_encode([
            "success" => false,
            "error"   => "Query failed: " . $mysqli->error
        ]);
        exit;
    }
}

$investors = [];

while ($row = $result->fetch_assoc()) {
    if (isset($row["id"])) $row["id"] = (int)$row["id"];
    $investors[] = $row;
}

// Response
echo json_encode([
    "success"   => true,
    "filtered"  => $hasFilter,
    "total"     => count($investors),
    "data"      => $investors
], JSON_UNESCAPED_UNICODE);
