<?php
    include "./template/chat/show_text/header_pv.php";
    include "./template/chat/show_text/message.php";
    include "./template/chat/show_text/show_image.php";
?>

<div class="chat-area">

    <?php
//        func_header_pv( "f" , "علی پارسا" );
        func_header_pv( "" , "" );
    ?>

    <div class="messages-container" id="messagesContainer">

        <?php
//            show_image("");
//            show_image("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgnb3288Ih_3BYFuAdq1_eMWEVGN8TQliJKeIEeVn9XmCtXj5CCSte1fv5EwjJMnSu2hE&usqp=CAU");
//            show_image("https://ircdn.zhaket.com/resources/5dc9cc00eaec370009202762/6721fa4356fd1054660d82a2.png");
//            func_message( "received" , "سلام، حالت چطوره؟" , "20:30" );
//            func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
//            func_message( "received" , "سلام، حالت چطوره؟" , "20:30" );
//            func_message( "send" , "سلام، حالت چطوره؟" , "20:30" );
        ?>

    </div>

    <div class="input-area">

        <!-- باتن ارسال پیام -->
        <button class="send-button" id="sendButton"> ➤ </button>

        <!-- باتن اتخاب عکس -->

        <form id="uploadForm" enctype="multipart/form-data" style="text-align:center;">
            <button type="button" id="selectButton">
                <svg class="icon_send_message" width="161" height="162" viewBox="0 0 161 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M95.6001 24.7705H151.208C153.899 24.7705 156.314 25.873 158.059 27.6316C159.818 29.3903 160.92 31.8315 160.92 34.4826V151.762C160.92 154.453 159.818 156.868 158.059 158.613C156.3 160.372 153.859 161.474 151.208 161.474H33.1149C30.4243 161.474 28.0095 160.372 26.2639 158.613C24.5052 156.854 23.4028 154.413 23.4028 151.762V93.9886C26.6445 95.301 30.0306 96.3247 33.5348 96.9941V123.61H33.5742C50.4916 107.428 61.6998 99.4352 78.5253 85.7727C78.5909 85.8383 78.6565 85.904 78.7221 85.9696C78.7615 86.009 78.7615 86.0483 78.8009 86.0483L114.001 127.692L119.382 94.5661C119.749 92.4399 121.744 90.9831 123.87 91.3506C124.684 91.4687 125.419 91.8756 125.996 92.4137L150.696 118.361V36.8319C150.696 36.3069 150.486 35.8475 150.119 35.5325C149.791 35.2044 149.305 34.9551 148.82 34.9551H98.1725C97.6344 31.4377 96.7682 28.0385 95.6001 24.7705ZM44.0212 0.20166C67.7895 0.20166 87.0561 19.4683 87.0561 43.2366C87.0561 67.0048 67.7895 86.2715 44.0212 86.2715C20.2529 86.2715 0.986328 67.0048 0.986328 43.2366C0.986328 19.4683 20.2529 0.20166 44.0212 0.20166ZM21.1585 43.9978H35.6479V64.6818H51.9877V43.9978H66.8971L44.0343 21.7782L21.1585 43.9978ZM124.71 47.0033C128.582 47.0033 132.138 48.5913 134.658 51.1243C137.231 53.6967 138.779 57.2009 138.779 61.0857C138.779 64.9574 137.191 68.5141 134.658 71.034C132.086 73.6064 128.582 75.1551 124.71 75.1551C120.838 75.1551 117.282 73.567 114.749 71.034C112.176 68.4616 110.628 64.9574 110.628 61.0857C110.628 57.214 112.216 53.6705 114.749 51.1243C117.334 48.5519 120.838 47.0033 124.71 47.0033Z" fill="white"/>
                </svg>
            </button>
            <input type="file" id="image" name="image" accept=".png,.jpg,.jpeg,.gif" required style="display:none" />
        </form>


        <textarea class="message-input" id="messageInput" placeholder="پیام خود را بنویسید..." rows="1"></textarea>

        <script>
            const messageInput = document.getElementById("messageInput");
            messageInput.addEventListener("input", () => {
                // تنظیم ارتفاع
                messageInput.style.height = "auto";
                messageInput.style.height = messageInput.scrollHeight + "px";

                // تنظیم عرض بر اساس طولانی‌ترین خط
                const lines = messageInput.value.split("\n");
                const longest = lines.reduce((a, b) => a.length > b.length ? a : b, "");
                const span = document.createElement("span");
                span.style.visibility = "hidden";
                span.style.whiteSpace = "pre";
                span.style.font = getComputedStyle(messageInput).font;
                span.textContent = longest || " ";
                document.body.appendChild(span);
                messageInput.style.width = span.offsetWidth + 40 + "px"; // 40 برای padding دو طرف
                span.remove();
            });
        </script>
    </div>

</div>

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




























