<?php
header('Content-Type: application/json; charset=utf-8');

// تنظیمات امنیتی
$maxSize = 2 * 1024 * 1024; // حداکثر 2MB
$allowed = ['jpg','jpeg','png','gif','webp'];

// بررسی وجود فایل
if(!isset($_FILES['file'])){
    echo json_encode(["status"=>"error","message"=>"فایلی ارسال نشده"]);
    exit;
}

$file = $_FILES['file'];

// خطاهای آپلود
if($file['error'] !== UPLOAD_ERR_OK){
    echo json_encode(["status"=>"error","message"=>"خطا در آپلود"]);
    exit;
}

// بررسی حجم
if($file['size'] > $maxSize){
    echo json_encode(["status"=>"error","message"=>"حجم فایل بیش از حد مجاز است"]);
    exit;
}

// بررسی فرمت
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if(!in_array($ext, $allowed)){
    echo json_encode(["status"=>"error","message"=>"فرمت فایل مجاز نیست"]);
    exit;
}

// پوشه بندی بر اساس سال/ماه
$year = date("Y");
$month = date("m");
$uploadDir = __DIR__ . "/uploads/$year/$month/";
if(!is_dir($uploadDir)){
    mkdir($uploadDir, 0777, true);
}

// تولید نام تصادفی
$newName = bin2hex(random_bytes(16)) . "." . $ext;
$destPath = $uploadDir . $newName;

// ذخیره فایل
if(move_uploaded_file($file['tmp_name'], $destPath)){
    $url = "uploads/$year/$month/$newName";
    echo json_encode(["status"=>"success","url"=>$url]);
} else {
    echo json_encode(["status"=>"error","message"=>"خطا در ذخیره‌سازی فایل"]);
}
