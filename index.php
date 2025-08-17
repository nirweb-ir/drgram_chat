<?php


if ( isset($_GET['code']) && isset($_GET['state'])) {

    $code = $_GET['code'];
    $book_id = $_GET['state'];
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://n8n.nirweb.ir/webhook/check-user',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'book_id=' . $book_id. '&token=' . $code .'&redirect_uri=' . 'https://drgram.darkube.app/',
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    $response = json_decode($response, true);
    echo json_encode($response);
}
include "./header.php";


include "./template/head_chat_page.php";


?>
    <div class='container'>
        <div class='screen_black'></div>

        <?php


        include "./template/chat/show_user.php";


        include "./template/chat/show_text.php";


        ?>
    </div>
<?php


include "./footer.php";
