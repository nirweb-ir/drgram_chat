<?php
    include "./template/chat/show_text/header_pv.php";
    include "./template/chat/show_text/message.php";
    include "./template/chat/show_text/show_image.php";
?>






    <div class="section_show_message">



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





    </div>



























