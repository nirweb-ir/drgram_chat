<?php
$authUrl = "https://user.paziresh24.com/realms/paziresh24/protocol/openid-connect/auth";
$clientId = "drgram";
$responseType = "code";
$scope = "user.profile.read user.appointment.read";
$redirectUri = "https://drgram.darkube.app/";
$idpHint = "gozar";
$skipPrompt = "true";
$state = isset($_GET['book_id']) ? $_GET['book_id'] : null;

// اعتبارسنجی پارامترهای ضروری
if (empty($authUrl) || empty($clientId) || empty($redirectUri)) {
    throw new Exception("تنظیمات احراز هویت ناقص است");
}

// ساخت URL احراز هویت
$authRequestUrl = sprintf(
    "%s?client_id=%s&response_type=%s&scope=%s&redirect_uri=%s&kc_idp_hint=%s&skip_prompt=%s&state=%s",
    htmlspecialchars($authUrl, ENT_QUOTES, 'UTF-8'),
    urlencode($clientId),
    urlencode($responseType),
    urlencode($scope),
    urlencode($redirectUri),
    urlencode($idpHint),
    urlencode($skipPrompt),
    urlencode($state)
);

// بررسی اینکه URL معتبر است
if (filter_var($authRequestUrl, FILTER_VALIDATE_URL) === false) {
    throw new Exception("آدرس احراز هویت نامعتبر است");
}

// انجام redirect
header("HTTP/1.1 302 Found");
header("Location: " . $authRequestUrl);
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
exit();