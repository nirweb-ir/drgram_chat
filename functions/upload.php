<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// ===== تنظیمات =====
$MAX_SIZE = 6 * 1024 * 1024; // 6MB
$ALLOWED_EXT = ['jpg','jpeg','png','gif','webp','mp3','wav','ogg','webm','m4a','pdf','doc','docx','ppt','pptx','xls','xlsx'];
$ALLOWED_MIME = [
    'jpg'  => ['image/jpeg'],
    'jpeg' => ['image/jpeg'],
    'png'  => ['image/png'],
    'gif'  => ['image/gif'],
    'webp' => ['image/webp'],
    'mp3'  => ['audio/mpeg', 'audio/mp3'],
    'wav'  => ['audio/wav', 'audio/x-wav'],
    'ogg'  => ['audio/ogg', 'video/ogg'],
    'webm' => ['video/webm', 'audio/webm'],
    'm4a'  => ['audio/mp4', 'audio/m4a', 'audio/aac'],
    'pdf'  => ['application/pdf'],
    'doc'  => ['application/msword'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'ppt'  => ['application/vnd.ms-powerpoint'],
    'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    'xls'  => ['application/vnd.ms-excel'],
    'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
];

// ===== ابزار =====
function human_bytes(int $bytes): string {
    $units = ['B','KB','MB','GB','TB']; $i = 0;
    while ($bytes >= 1024 && $i < count($units)-1) { $bytes /= 1024; $i++; }
    return round($bytes, 2) . ' ' . $units[$i];
}

function json_fail(string $code, string $message, array $extra = [], int $http = 400): void {
    http_response_code($http);
    $payload = array_merge(['status'=>'error','code'=>$code,'message'=>$message], $extra);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    log_error($code, $message, $extra);
    exit;
}

function json_ok(array $data): void {
    http_response_code(200);
    echo json_encode(array_merge(['status'=>'success'], $data), JSON_UNESCAPED_UNICODE);
    exit;
}

function client_ip(): string {
    foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','HTTP_CLIENT_IP','REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            $v = $_SERVER[$k];
            if ($k === 'HTTP_X_FORWARDED_FOR') { $v = explode(',', $v)[0]; }
            return trim($v);
        }
    }
    return 'unknown';
}

function scheme(): string {
    // پشت پراکسی‌ها
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
        return $_SERVER['HTTP_X_FORWARDED_PROTO'] . '://';
    }
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return 'https://';
    }
    return 'http://';
}

function base_path_prefix(): string {
    // اگر روی لوکال‌هاست داخل ساب‌فولدر هستید
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($host === 'localhost') {
        return '/drgram_chat';
    }
    return '';
}

function log_error(string $code, string $message, array $extra = []): void {
    $dir = dirname(__DIR__) . '/logs';
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    $file = $dir . '/upload-' . date('Y-m') . '.log';
    $line = sprintf(
        "[%s] ip=%s ua=%s code=%s msg=%s extra=%s\n",
        date('Y-m-d H:i:s'),
        client_ip(),
        $_SERVER['HTTP_USER_AGENT'] ?? '-',
        $code,
        $message,
        json_encode($extra, JSON_UNESCAPED_UNICODE)
    );
    @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
}

// جلوگیری از خروجی خطای PHP
ini_set('display_errors', '0');
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    // خطاهای runtime را هم لاگ کن
    log_error('PHP_WARNING', "$errstr @ $errfile:$errline");
    return true;
});

// ===== اعتبارسنجی ابتدایی =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_fail('ERR_METHOD', 'متد درخواست نامعتبر است', [], 405);
}

if (!isset($_FILES['file'])) {
    json_fail('ERR_NO_FILE', 'هیچ فایلی ارسال نشد');
}

$file = $_FILES['file'];

// خطاهای داخلی PHP
if ($file['error'] !== UPLOAD_ERR_OK) {
    $map = [
        UPLOAD_ERR_INI_SIZE   => 'حجم فایل از محدودیت سرور (upload_max_filesize) بیشتر است',
        UPLOAD_ERR_FORM_SIZE  => 'حجم فایل از محدودیت فرم (MAX_FILE_SIZE) بیشتر است',
        UPLOAD_ERR_PARTIAL    => 'فایل به صورت ناقص آپلود شد',
        UPLOAD_ERR_NO_FILE    => 'هیچ فایلی انتخاب نشده است',
        UPLOAD_ERR_NO_TMP_DIR => 'پوشه موقت سرور در دسترس نیست',
        UPLOAD_ERR_CANT_WRITE => 'عدم امکان نوشتن فایل روی دیسک (دسترسی/فضا)',
        UPLOAD_ERR_EXTENSION  => 'آپلود توسط یک افزونه PHP متوقف شد'
    ];
    $msg = $map[$file['error']] ?? ("خطای ناشناخته در آپلود (کد {$file['error']})");
    json_fail('ERR_PHP_UPLOAD', $msg, ['php_error'=>$file['error']]);
}

// محدودیت حجم
if ($file['size'] <= 0) {
    json_fail('ERR_EMPTY', 'فایل خالی است یا به درستی ارسال نشده');
}
if ($file['size'] > $MAX_SIZE) {
    json_fail('ERR_SIZE', 'حجم فایل بیش از حد مجاز است', [
        'max'=>human_bytes($MAX_SIZE),
        'size'=>human_bytes((int)$file['size'])
    ]);
}

// پسوند و MIME
$origName = $file['name'] ?? 'file';
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
if (!in_array($ext, $ALLOWED_EXT, true)) {
    json_fail('ERR_TYPE', "فرمت {$ext} مجاز نیست", ['allowed'=>$ALLOWED_EXT]);
}

// MIME واقعی سیستم
$finfo = new finfo(FILEINFO_MIME_TYPE);
$realMime = $finfo->file($file['tmp_name']) ?: ($file['type'] ?? 'application/octet-stream');
$allowedForExt = $ALLOWED_MIME[$ext] ?? [];
if ($allowedForExt && !in_array($realMime, $allowedForExt, true)) {
    // اجازه‌ی خطای جزئی برخی مرورگرها روی webm/ogg را بدهیم
    $looseMatch = (str_starts_with($realMime, 'audio/') && in_array('audio/ogg', $allowedForExt, true))
        || (str_starts_with($realMime, 'video/') && in_array('video/webm', $allowedForExt, true));
    if (!$looseMatch) {
        json_fail('ERR_MIME', 'نوع واقعی فایل با پسوند هم‌خوانی ندارد', [
            'ext'=>$ext, 'mime'=>$realMime, 'expected'=>$allowedForExt
        ]);
    }
}

// ساخت مسیر ذخیره‌سازی
$year = date('Y');
$month = date('m');
$uploadDir = dirname(__DIR__) . "/uploads/{$year}/{$month}/";
if (!is_dir($uploadDir) && !@mkdir($uploadDir, 0755, true)) {
    json_fail('ERR_MKDIR', 'امکان ایجاد پوشه ذخیره‌سازی وجود ندارد', ['dir'=>$uploadDir], 500);
}
if (!is_writable($uploadDir)) {
    json_fail('ERR_NOT_WRITABLE', 'پوشه ذخیره‌سازی دسترسی نوشتن ندارد', ['dir'=>$uploadDir], 500);
}

// نام امن فایل
try {
    $random = bin2hex(random_bytes(16));
} catch (Throwable $e) {
    $random = bin2hex(random_bytes(8)) . dechex(time());
}
$newName  = $random . '.' . $ext;
$destPath = $uploadDir . $newName;

// انتقال
if (!@move_uploaded_file($file['tmp_name'], $destPath)) {
    json_fail('ERR_MOVE', 'انتقال فایل به پوشه مقصد انجام نشد', ['dest'=>$destPath], 500);
}
@chmod($destPath, 0644);

// ساخت URL
$scheme = scheme();
$host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
$prefix = base_path_prefix();
$relative = "uploads/{$year}/{$month}/{$newName}";
$url = rtrim($scheme . $host . $prefix, '/') . '/' . $relative;

// موفق
header('X-Upload-Id: '.$random);
json_ok([
    'url'          => $url,
    'relative'     => $relative,
    'real_path'    => $destPath,
    'original'     => $origName,
    'size'         => $file['size'],
    'size_human'   => human_bytes((int)$file['size']),
    'mime'         => $realMime,
]);
