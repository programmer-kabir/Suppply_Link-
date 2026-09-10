<?php
// ⚠️ No space/BOM before this line

function ensure_dir($dir) {
  if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
  }
}

/**
 * Upload image -> convert to WEBP
 * SAVE: public_html/uploads/
 * RETURN: uploads/filename.webp   (ONLY this goes to DB)
 */
function upload_image_as_webp(
  $fieldName,
  $baseName = "image",
  $quality = 75,
  $maxWidth = 1600
) {
  if (!isset($_FILES[$fieldName])) return null;
  if ($_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
    throw new Exception("$fieldName upload error");
  }

  $tmp  = $_FILES[$fieldName]['tmp_name'];
  $mime = mime_content_type($tmp);

  if (!in_array($mime, ['image/jpeg','image/png','image/webp'])) {
    throw new Exception("$fieldName invalid image type");
  }

  // load image
  if ($mime === 'image/jpeg') $img = imagecreatefromjpeg($tmp);
  elseif ($mime === 'image/png') {
    $img = imagecreatefrompng($tmp);
    imagepalettetotruecolor($img);
    imagealphablending($img, true);
    imagesavealpha($img, true);
  } else {
    $img = imagecreatefromwebp($tmp);
  }

  if (!$img) throw new Exception("Failed to read image");

  // resize
  $w = imagesx($img);
  $h = imagesy($img);
  if ($w > $maxWidth) {
    $newW = $maxWidth;
    $newH = intval($h * ($newW / $w));
    $resized = imagecreatetruecolor($newW, $newH);
    imagecopyresampled($resized, $img, 0,0,0,0, $newW,$newH, $w,$h);
    imagedestroy($img);
    $img = $resized;
  }

  // upload dir = public_html/uploads
  $root = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
  $uploadDir = $root . "/uploads";
  ensure_dir($uploadDir);

  if (!is_writable($uploadDir)) {
    throw new Exception("uploads folder not writable");
  }

  // filename
  $safe = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $baseName);
  $filename = $safe . "_" . date("Ymd_His") . "_" . bin2hex(random_bytes(4)) . ".webp";

  $absPath = $uploadDir . "/" . $filename;

  if (!imagewebp($img, $absPath, $quality)) {
    imagedestroy($img);
    throw new Exception("Failed to save webp");
  }
  imagedestroy($img);

  // ✅ ONLY THIS goes to DB
  return "uploads/" . $filename;
}
