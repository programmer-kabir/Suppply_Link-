<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function jsonFail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $msg
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonFail("Invalid method. Use GET.", 405);
    }

    // ✅ Fetch ALL relations (no query params needed)
    $sql = "
        SELECT
            cg.id,
            cg.customer_user_id,
            cu.name   AS customer_name,
            cu.mobile AS customer_mobile,

            cg.guarantor_user_id,
            gu.name   AS guarantor_name,
            gu.mobile AS guarantor_mobile,

            cg.relation,
            cg.is_primary,
            cg.status,
            cg.assigned_at,
            cg.assigned_by
        FROM customer_guarantors cg
        JOIN users cu ON cu.id = cg.customer_user_id
        JOIN users gu ON gu.id = cg.guarantor_user_id
        ORDER BY cg.assigned_at DESC, cg.id DESC
    ";

    $res = $mysqli->query($sql);

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $row['is_primary'] = (int)$row['is_primary'];
        $rows[] = $row;
    }

    echo json_encode([
        "success" => true,
        "count" => count($rows),
        "data" => $rows
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to load customer guarantors",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
