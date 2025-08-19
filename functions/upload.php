<?php
header('Content-Type: application/json; charset=utf-8');

// تنظیمات امنیتی
$maxSize = 2 * 1024 * 1024; // 2MB
$allowed = ['jpg','jpeg','png','gif','webp'];

if(!isset($_FILES['file'])){
    echo json_encode(["status"=>"error","message"=>"فایلی ارسال نشده"]);
    exit;
}

$file = $_FILES['file'];

if($file['error'] !== UPLOAD_ERR_OK){
    echo json_encode(["status"=>"error","message"=>"خطا در آپلود"]);
    exit;
}

if($file['size'] > $maxSize){
    echo json_encode(["status"=>"error","message"=>"حجم فایل بیش از حد مجاز"]);
    exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if(!in_array($ext, $allowed)){
    echo json_encode(["status"=>"error","message"=>"فرمت مجاز نیست"]);
    exit;
}

$year = date("Y");
$month = date("m");

// یک پوشه عقب‌تر از functions
$uploadDir = dirname(__DIR__) . "/uploads2/$year/$month/";
if(!is_dir($uploadDir)){
    mkdir($uploadDir, 0777, true);
}

$newName = bin2hex(random_bytes(16)) . "." . $ext;
$destPath = $uploadDir . $newName;

// پروتکل + دامنه
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ||
    $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
if ($host == "localhost") {
    $host.= '/drgram_chat';
}

if(move_uploaded_file($file['tmp_name'], $destPath)){
    $relativeUrl = "uploads2/$year/$month/$newName";
    $url = $protocol . $host . "/" . $relativeUrl;
    echo json_encode([
        "status"=>"success",
        "url"=>$url,
        "real_path"=>$destPath
    ]);
} else {
    echo json_encode(["status"=>"error","message"=>"خطا در ذخیره‌سازی"]);
}
