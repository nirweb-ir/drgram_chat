<?php

header('Content-Type: application/json; charset=utf-8');

// فقط درخواست POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

// بررسی اینکه چه عملی باید انجام شود
$action = $_POST['action'] ?? null;

switch ($action) {
    case 'check_user_id':
        check_user_id();
        break;

    case 'get_list_chats':
        get_list_chats();
        break;

    case 'send_messages_to_chat':
        send_messages_to_chat();
        break;

    case 'seen_message':
        seen_message();
        break;

    case 'get_messages_chat':
        get_messages_chat();
        break;

    case 'get_older_messages':
        get_older_messages();
        break;


        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}


// -------------------------
// توابع مربوط به هر درخواست
// -------------------------
function check_user_id()
{
    $token = $_COOKIE['dpchat_token'] ?? '';
    $id_client = $_POST['id_client'];
    $curl = curl_init();

    if (!empty($id_client)) {
        $body ='code=' . $id_client;
    }else{
        $body ='token='.$token;
    }

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-check-user',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);


    curl_close($curl);
    $response = json_decode($response, true);
    if ($response['status'] === 'success') {
        $token = $response['token'] ?? '';
        $user_id = $response['user_id'] ?? '';
        $expiry_time = time() + (14 * 24 * 60 * 60);
        if ($token){
            setcookie(
                'dpchat_token',
                $token,
                [
                    'expires' => $expiry_time,
                    'path' => '/',
                    'domain' => '',
                    'secure' => true,
                    'httponly' => true,
                    'samesite' => 'None'
                ]
            );
        }
        if ($user_id){
            setcookie(
                'dpchat_id',
                $user_id,
                [
                    'expires' => $expiry_time,
                    'path' => '/',
                    'domain' => '',
                    'secure' => false,
                    'httponly' => false,
                ]
            );
        }

    }
    echo json_encode($response);

    exit();
}

function get_list_chats()
{

    $token = $_COOKIE['dpchat_token'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-get-conversation-list',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'token=' . $token ,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
//    var_dump($response);
    echo json_encode($response);

}

function get_messages_chat()
{

    $chat_id = $_POST['chat_id'];
    $token = $_COOKIE['dpchat_token'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-get-message-conversation',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'chat_id=' . $chat_id. '&token=' . $token,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
    echo json_encode($response);

}
function get_older_messages()
{
    $last_id = $_POST['last_id'];

    $chat_id = $_POST['chat_id'];
    $token = $_COOKIE['dpchat_token'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-get-old-message-conversation',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'chat_id=' . $chat_id. '&token=' . $token.'&last_id=' . $last_id,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
    echo json_encode($response);

}
function send_messages_to_chat()
{

    $type = $_POST['type'];
    $message = $_POST['message'];
    $chat_id = $_POST['chat_id'];
    $token = $_COOKIE['dpchat_token'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-send_message',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'conversation_id=' . $chat_id. '&token=' . $token. '&message=' . $message. '&message_type=' . $type,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
    echo json_encode($response);

}
function seen_message()
{


    $message_id = $_POST['message_id'];
    $chat_id = $_POST['chat_id'];
    $token = $_COOKIE['dpchat_token'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/nt-seen_message',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'token='.$token.'&message_id=' . $message_id. '&chat_id=' . $chat_id,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
    echo json_encode($response);

}
