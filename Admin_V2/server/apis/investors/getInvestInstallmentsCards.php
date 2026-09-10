<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// কেবল তখনই filter করবো যখন investor_id পাওয়া যাবে AND empty নয়
$hasFilter = isset($_GET["investor_id"]) && $_GET["investor_id"] !== "";

if ($hasFilter) {
    // investor er card filter
    $investor_id = (int) $_GET["investor_id"];

    $sql = "SELECT * FROM investment_cards WHERE investor_id = ? ORDER BY id ASC";
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
    // সব card return করবে
    $sql = "SELECT * FROM investment_cards ORDER BY id ASC";
    $result = $mysqli->query($sql);

    if (!$result) {
        echo json_encode([
            "success" => false,
            "error"   => "Query failed: " . $mysqli->error
        ]);
        exit;
    }
}

$cards = [];

while ($row = $result->fetch_assoc()) {
    if (isset($row["id"])) $row["id"] = (int)$row["id"];
    if (isset($row["investor_id"])) $row["investor_id"] = (int)$row["investor_id"];
    $cards[] = $row;
}

echo json_encode([
    "success"     => true,
    "filtered"    => $hasFilter ? true : false,
    "total_cards" => count($cards),
    "cards"       => $cards
], JSON_UNESCAPED_UNICODE);
