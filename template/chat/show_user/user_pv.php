<?php



function func_user_pv( $active = false , $first_car_name = "" , $name = "" , $massage = "" , $counter_massage = null , $time = null )
{
    ?>
    <div class="chat-item  <?= $active == true ? "active" : ""  ?> " data-chat="4">

        <div class="chat-avatar">

            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="1.5"/>
                <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
            </svg>

        </div>


        <div class="chat-info">
            <div class="chat-name"><?= $name ?></div>
            <div class="chat-last-message"><?= $massage ?></div>
        </div>
        <div class="chat-meta">

            <?php
                if ( $time != null ) {
                    ?> <div class="chat-time"><?= $time ?></div> <?php
                }
                if ( $counter_massage != null ) {
                    ?> <div class="unread-badge"><?= $counter_massage ?></div> <?php
                }
            ?>

        </div>
    </div>
    <?php
}

?>

