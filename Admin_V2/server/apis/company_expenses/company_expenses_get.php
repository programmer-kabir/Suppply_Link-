<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// সব expense (কোনো params লাগবে না)
$sql = "SELECT * FROM company_expenses ORDER BY expense_date ASC, id ASC";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Prepare failed",
    "error"   => $mysqli->error
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$stmt->execute();
$res = $stmt->get_result();

$rows = [];
$total = 0;

while ($row = $res->fetch_assoc()) {
  $row["id"] = (int)$row["id"];
  $row["amount"] = (float)$row["amount"];
  $rows[] = $row;

  $total += $row["amount"];
}

echo json_encode([
  "success" => true,
  "total"   => $total,
  "count"   => count($rows),
  "data"    => $rows
], JSON_UNESCAPED_UNICODE);
