<?php
$code = $_GET['code'];
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/check-doctor',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS =>  'code=' . $code .'&redirect_uri=' . 'https://drgram.darkube.app/',
    CURLOPT_HTTPHEADER => array(
        'Content-Type: application/x-www-form-urlencoded'
    ),
));

$response = curl_exec($curl);

curl_close($curl);
$response = json_decode($response, true);
$user_id = $response['user_id'];
$url = "https://drgram.darkube.app/?id_client=" . urlencode($user_id);

// ریدایرکت
header("Location: $url");
exit();