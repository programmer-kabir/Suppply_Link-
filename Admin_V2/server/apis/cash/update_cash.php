<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id'] ?? 0);
$approval_status = trim($data['approval_status'] ?? '');
$approved_by = intval($data['approved_by'] ?? 0);
$reject_reason = trim($data['reject_reason'] ?? '');

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "Cash ID required"
    ]);
    exit;
}

if (!in_array($approval_status, ['approved', 'rejected'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid approval status"
    ]);
    exit;
}

if ($approval_status === 'approved') {

    $stmt = $mysqli->prepare("
        UPDATE cash
        SET
            approval_status = 'approved',
            approved_by = ?,
            approved_at = NOW(),
            reject_reason = NULL
        WHERE id = ?
    ");

    $stmt->bind_param("ii", $approved_by, $id);

} else {

    if (empty($reject_reason)) {
        echo json_encode([
            "success" => false,
            "message" => "Reject reason required"
        ]);
        exit;
    }

    $stmt = $mysqli->prepare("
        UPDATE cash
        SET
            approval_status = 'rejected',
            approved_by = ?,
            approved_at = NOW(),
            reject_reason = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "isi",
        $approved_by,
        $reject_reason,
        $id
    );
}

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => $approval_status === 'approved'
        ? 'Cash request approved successfully'
        : 'Cash request rejected successfully'
]);