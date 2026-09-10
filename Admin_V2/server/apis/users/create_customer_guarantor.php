<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../cors.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function jsonFail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "message" => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonFail("Invalid method. Use POST.", 405);
    }

    $customer_user_id  = (int)($_POST['customer_user_id'] ?? 0);
    $guarantor_user_id = (int)($_POST['guarantor_user_id'] ?? 0);
    $relation          = trim($_POST['relation'] ?? '');
    $is_primary        = (int)($_POST['is_primary'] ?? 1);
    $assigned_by       = (int)($_POST['assigned_by'] ?? 0);

    if ($customer_user_id <= 0) jsonFail("customer_user_id required");
    if ($guarantor_user_id <= 0) jsonFail("guarantor_user_id required");
    if ($relation === '') jsonFail("relation required");
    if ($assigned_by <= 0) jsonFail("assigned_by required");

    if ($customer_user_id === $guarantor_user_id) {
        jsonFail("Customer and guarantor cannot be the same user");
    }

    $is_primary = ($is_primary === 1) ? 1 : 0;

    // check customer exists
    $check = $mysqli->prepare("SELECT id FROM users WHERE id = ?");
    $check->bind_param("i", $customer_user_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows === 0) jsonFail("Customer user not found");

    // check guarantor exists
    $check2 = $mysqli->prepare("SELECT id FROM users WHERE id = ?");
    $check2->bind_param("i", $guarantor_user_id);
    $check2->execute();
    $check2->store_result();
    if ($check2->num_rows === 0) jsonFail("Guarantor user not found");

    // role validation
    $rc = $mysqli->prepare("SELECT 1 FROM user_roles WHERE user_id = ? AND role = 'customer' LIMIT 1");
    $rc->bind_param("i", $customer_user_id);
    $rc->execute();
    $rc->store_result();
    if ($rc->num_rows === 0) jsonFail("This user is not a customer (role missing)");

    $rg = $mysqli->prepare("SELECT 1 FROM user_roles WHERE user_id = ? AND role IN ('granter','guarantor') LIMIT 1");
    $rg->bind_param("i", $guarantor_user_id);
    $rg->execute();
    $rg->store_result();
    if ($rg->num_rows === 0) jsonFail("This user is not a granter/guarantor (role missing)");

    // If primary, unset other primaries
    if ($is_primary === 1) {
        $up = $mysqli->prepare("
            UPDATE customer_guarantors
            SET is_primary = 0
            WHERE customer_user_id = ?
              AND status = 'active'
        ");
        $up->bind_param("i", $customer_user_id);
        $up->execute();
    }

    // Insert
    $stmt = $mysqli->prepare("
        INSERT INTO customer_guarantors
            (customer_user_id, guarantor_user_id, relation, is_primary, status, assigned_at, assigned_by)
        VALUES
            (?, ?, ?, ?, 'active', NOW(), ?)
    ");

    // ✅ correct types: i i s i i  => "iisii"
    $stmt->bind_param("iisii", $customer_user_id, $guarantor_user_id, $relation, $is_primary, $assigned_by);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Guarantor assigned successfully",
        "data" => [
            "customer_user_id" => $customer_user_id,
            "guarantor_user_id" => $guarantor_user_id,
            "relation" => $relation,
            "is_primary" => $is_primary
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    // ✅ duplicate key friendly message
    $msg = $e->getMessage();
    if (stripos($msg, "Duplicate entry") !== false) {
        jsonFail("Already assigned (duplicate).", 409);
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Guarantor assign failed",
        "error"   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
