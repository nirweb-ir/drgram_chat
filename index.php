<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Chat Page</title>
    <script src="./assets/js/jquery.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html {
            height: 100%;
            overflow: hidden;
            font-family: sans-serif;
            background: #f2f2f2;
        }

        #app {
            display: flex;
            flex-direction: column;
            height: 100%; /* فقط پایه */
        }


        /* هدر */
        header {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            background: transparent; /* بکگراند حذف شد */
            color: #333;
        }
        header .icon {
            font-size: 20px;
            cursor: pointer;
        }

        /* باکس اصلی چت */
        .chat-box {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
            margin: 16px; /* حالت دسکتاپ */
        }

        /* در موبایل (عرض کم) باکس کامل صفحه بشه */
        @media (max-width: 768px) {
            .chat-box {
                margin: 0;
                border-radius: 0;
            }
        }

        /* بخش پیام‌ها */
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        .message {
            background: #fff;
            padding: 8px 12px;
            margin: 6px 0;
            border-radius: 10px;
            max-width: 70%;
        }
        .message.sent {
            align-self: flex-end;
            background: #d1e7ff;
        }
        .message.received {
            align-self: flex-start;
            background: #e0e0e0;
        }

        /* نوار ورودی */
        .input-bar {
            display: flex;
            border-top: 1px solid #ccc;
            padding: 8px;
            background: #fff;
        }
        .input-bar input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 20px;
            outline: none;
            font-size: 16px; /* جلوگیری از زوم در iOS */
        }
        .input-bar button {
            margin-right: 8px;
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            background: #1976d2;
            color: #fff;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div id="app">
    <!-- هدر -->
    <header>
        <div class="icon">☰</div>
        <div>چت</div>
        <div class="icon">⚙️</div>
    </header>

    <!-- باکس چت -->
    <div class="chat-box">
        <!-- پیام‌ها -->
        <div class="messages" id="messages">
            <div class="message received">سلام 👋</div>
            <div class="message sent">سلام، خوبی؟</div>
            <div class="message received">ممنونم، تو چطوری؟</div>
        </div>

        <!-- ورودی متن -->
        <div class="input-bar">
            <input type="text" placeholder="پیام خود را بنویسید..." id="msgInput">
            <button id="sendBtn">ارسال</button>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    function fixAppHeight() {
        jQuery("#app").css("height", window.innerHeight + "px");
    }

    jQuery(document).ready(function () {
        fixAppHeight();
        jQuery(window).on("resize orientationchange", fixAppHeight);
    });

</script>
</body>
</html>
