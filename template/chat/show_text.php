<?php
    include "./template/chat/show_text/header_pv.php";
    include "./template/chat/show_text/message.php";
    include "./template/chat/show_text/show_image.php";
?>


<div class="section_show_message_container">



    <div class="section_show_message">

        <div class=" chat-area ">



            <div class="messages-container" id="messagesContainer">

                <div class=" show_first_message_in_louding  active">  <!-- active -->
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 9H17M7 13H12M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p> دکتر گرام .... </p>
                </div>

                <div class="chat_user_box">
                    <?php
                    func_header_pv( "f" , "علی پارسا" );
                    ?>
                    <div class="chat_user_box_messages">
                        <?php
                        show_image("");
                        show_image("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgnb3288Ih_3BYFuAdq1_eMWEVGN8TQliJKeIEeVn9XmCtXj5CCSte1fv5EwjJMnSu2hE&usqp=CAU");
                        func_message( "received" , "سلام، حالت چطوره؟" , "20:30" );
                        func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
                        func_message( "received" , "سلام، حالت چطوره؟" , "20:30" );
                        func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
                        func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
                        func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
                        ?>
                    </div>
                    <?php
                    include "./template/chat/show_text/box_input.php";
                    ?>
                </div>


            </div>



        </div>  <!-- active -->
        <!------------------------------------------------>
        <!-- نمایش گالری -->
        <div class="container_show_image"> <!-- active -->
            <div class="container_image">
                <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="184.145" y="146.377" width="456.521" height="507.246" fill="white"/>
                    <path d="M399.999 44.6665C477.944 44.6665 538.617 44.6195 585.81 50.9644C633.634 57.3942 670.896 70.749 700.071 99.9253C729.249 129.102 742.604 166.365 749.034 214.19C755.379 261.382 755.333 322.054 755.333 400C755.333 477.944 755.379 538.618 749.034 585.81C742.604 633.635 729.249 670.896 700.072 700.072C670.897 729.249 633.635 742.605 585.81 749.035C538.617 755.38 477.944 755.333 399.999 755.333C322.054 755.333 261.382 755.38 214.189 749.035C166.364 742.605 129.101 729.25 99.9248 700.073V700.072C70.7485 670.896 57.3937 633.634 50.9639 585.81C44.619 538.618 44.666 477.944 44.666 400C44.666 322.054 44.6191 261.382 50.9639 214.19C57.3938 166.365 70.749 129.102 99.9258 99.9253C129.102 70.7489 166.365 57.3943 214.189 50.9644C261.382 44.6195 322.054 44.6665 399.999 44.6665ZM318.786 314.544C317.615 313.374 315.715 313.374 314.544 314.545C313.372 315.717 313.373 317.616 314.543 318.786L314.544 318.787L380.199 384.444L395.755 400L380.199 415.556L314.545 481.212C313.373 482.384 313.373 484.282 314.545 485.454C315.717 486.625 317.615 486.624 318.785 485.455L318.787 485.453L384.443 419.799L400 404.245L481.209 485.454C482.381 486.625 484.281 486.625 485.453 485.454C486.626 484.28 486.623 482.382 485.456 481.215L485.453 481.212L419.796 415.556L404.24 400L485.454 318.786C486.623 317.617 486.625 315.719 485.453 314.546C484.281 313.375 482.381 313.375 481.209 314.546L481.208 314.545L415.556 380.203L400 395.759L384.442 380.203L318.786 314.545V314.544Z" fill="#FF0000" stroke="white" stroke-width="44"/>
                </svg>
                <div class="loader" style="
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%,-50%);
            display: block;
        ">در حال بارگذاری عکس ...</div>
                <img class="main_image" src="  ">
            </div>
        </div>
        <!------------------------------------------------>
        <!-- انتخاب عکس -->
        <!-- مودال نمایش عکس -->
        <div style="display: none;" id="imageModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDesc">
            <div class="modal-content">
                <button id="closeModal" class="close" aria-label="بستن پنجره">&times;</button>
                <img id="previewImage" src="" alt="پیش نمایش عکس" />
                <button class="butten_send_message" type="button" id="submitBtn">ارسال عکس</button>
            </div>
        </div>

    </div>

</div>


























