<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

$sql = "
SELECT
    f.id,
    f.user_id,
    f.card_id,
    f.has_cheque,
    f.file_received_date,
    f.approved_by,
    f.remarks,
    f.status,
    f.created_at,

    -- Customer Info
    u.name AS customer_name,
    u.mobile,
    u.address,
    u.photo,

    -- Card Info
    c.card_id,
    c.card_id AS card_number,
    c.product_name,
    c.sale_price,
    c.down_payment,
    c.installment_count,
    c.per_installment_amount,
    c.delivery_date,
    c.first_installment_date,
    c.status AS card_status,

    -- Approved By User
    au.name AS approved_by_name,

    -- First Installment
    (
        SELECT ip.installment_no
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no ASC
        LIMIT 1
    ) AS first_installment_no,

    (
        SELECT ip.due_amount
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no ASC
        LIMIT 1
    ) AS first_installment_amount,

    (
        SELECT ip.paid_date
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no ASC
        LIMIT 1
    ) AS first_installment_paid_date,

    -- Last Installment
    (
        SELECT ip.installment_no
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no DESC
        LIMIT 1
    ) AS last_installment_no,

    (
        SELECT ip.due_amount
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no DESC
        LIMIT 1
    ) AS last_installment_amount,

    (
        SELECT ip.paid_date
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        ORDER BY ip.installment_no DESC
        LIMIT 1
    ) AS last_installment_paid_date,

    -- Paid Summary
    (
        SELECT COUNT(*)
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        AND ip.status = 'Paid'
    ) AS total_paid_installments,

    (
        SELECT COALESCE(SUM(ip.due_amount), 0)
        FROM installment_payments ip
        WHERE ip.card_id = f.card_id
        AND ip.status = 'Paid'
    ) AS total_paid_amount

FROM installment_files f

LEFT JOIN users u
    ON u.id = f.user_id

LEFT JOIN users au
    ON au.id = f.approved_by

LEFT JOIN installment_cards c
    ON c.id = f.card_id

ORDER BY f.id ASC
";

$result = $mysqli->query($sql);

if (!$result) {
    echo json_encode([
        'success' => false,
        'error' => $mysqli->error
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'success' => true,
    'count'   => count($data),
    'data'    => $data
], JSON_UNESCAPED_UNICODE);