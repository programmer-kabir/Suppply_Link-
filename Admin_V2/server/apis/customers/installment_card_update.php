<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json");

// DEV MODE (production এ বন্ধ করবে)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    /* ================= INPUT ================= */
    // JSON input handle
    $input = json_decode(file_get_contents("php://input"), true);

    $card_id = (int) ($input['card_id'] ?? 0);
    $status  = trim($input['status'] ?? '');

    /* ================= VALIDATION ================= */
    if ($card_id <= 0) {
        throw new Exception("Invalid card id");
    }

    $allowed_status = ['Running', 'Fully Paid', 'Overdue'];
    if (!in_array($status, $allowed_status)) {
        throw new Exception("Invalid status value");
    }

    /* ================= UPDATE ================= */
    $stmt = $mysqli->prepare("
        UPDATE installment_cards
        SET status = ?
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->bind_param("si", $status, $card_id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        throw new Exception("No card updated (maybe already updated)");
    }

    echo json_encode([
        "success" => true,
        "message" => "Card status updated successfully"
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Card status update failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
