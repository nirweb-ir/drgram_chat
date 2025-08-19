<div class="input-area ">

    <!-- باتن ارسال پیام -->
    <button class="send-button" id="sendButton"> ➤</button>
    <input type="hidden" id="chat_id_input" value="">

    <!-- باتن اتخاب عکس -->

    <div class="attach_file" id="btnUpload">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.27 122.88"
             width="25px">
            <path d="M11.1,67.22a4.09,4.09,0,1,1-5.79-5.79L58,8.75a30.77,30.77,0,0,1,43.28,43.74L38.05,115.74l-.33.3c-4.77,4.21-9.75,6.59-15,6.82s-10.62-1.77-15.89-6.34h0l-.07-.06h0l-.15-.15a23.21,23.21,0,0,1-5.34-8A18.84,18.84,0,0,1,.14,99.16a22.87,22.87,0,0,1,4-10.47,51.46,51.46,0,0,1,6.43-7.35l58.68-58.7a13.05,13.05,0,0,1,18.34-.09l.09.09a13,13,0,0,1,.24,18.15l-.24.27L37.14,91.58a4.09,4.09,0,0,1-5.79-5.79L82,35.12a4.89,4.89,0,0,0-.13-6.67l0,0a4.84,4.84,0,0,0-6.83,0L16.33,87.12a46,46,0,0,0-5.45,6.17,15,15,0,0,0-2.62,6.83,10.92,10.92,0,0,0,.64,5.25,15.28,15.28,0,0,0,3.42,5.07c3.56,3.06,6.91,4.4,10.09,4.26s6.51-1.81,9.88-4.79l63.2-63.2A22.59,22.59,0,0,0,63.75,14.57L11.1,67.22Z"/>
        </svg>

    </div>

    <button class="startRecord disable" id="startRecord">
        <svg height="26px" id="Layer_1" fill="#555555" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.05 122.88"><title>mic-microphone</title><path d="M59.89,20.83V52.3c0,27-37.73,27-37.73,0V20.83c0-27.77,37.73-27.77,37.73,0Zm-14.18,76V118.2a4.69,4.69,0,0,1-9.37,0V96.78a40.71,40.71,0,0,1-12.45-3.51A41.63,41.63,0,0,1,12.05,85L12,84.91A41.31,41.31,0,0,1,3.12,71.68,40.73,40.73,0,0,1,0,56a4.67,4.67,0,0,1,8-3.31l.1.1A4.68,4.68,0,0,1,9.37,56a31.27,31.27,0,0,0,2.4,12.06A32,32,0,0,0,29,85.28a31.41,31.41,0,0,0,24.13,0,31.89,31.89,0,0,0,10.29-6.9l.08-.07a32,32,0,0,0,6.82-10.22A31.27,31.27,0,0,0,72.68,56a4.69,4.69,0,0,1,9.37,0,40.65,40.65,0,0,1-3.12,15.65A41.45,41.45,0,0,1,70,85l-.09.08a41.34,41.34,0,0,1-11.75,8.18,40.86,40.86,0,0,1-12.46,3.51Z"/></svg>
    </button>

    <input type="file" id="fileInput" accept="image/*" style="display:none">

    <textarea class="message-input" id="messageInput" placeholder="پیام خود را بنویسید..." rows="1"></textarea>

    <script>
        jQuery(document).ready(function ($) {
            $("#messageInput").on("input", function () {
                let $this = $(this);
                let parent = $(this).parent('.input-area');

                // ریست ارتفاع
                $this.css("height", "auto");

                // ارتفاع واقعی محتوای داخل
                let newHeight = this.scrollHeight;

                // حداکثر ارتفاع مجاز
                // let maxHeight = parseInt($this.css("max-height"));
                let maxHeight = parseInt(parent.css("max-height"));

                if (newHeight > maxHeight) {
                    $this.css({
                        "height": maxHeight + "px",
                        "overflow-y": "auto"
                    });
                } else {
                    $this.css({
                        "height": newHeight + "px",
                        "overflow-y": "hidden"
                    });
                }
            });
        });
    </script>


    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(function () {

            // آپلود از گالری یا فایل
            $("#btnUpload").on("click", function () {
                $("#fileInput").click();
            });

            // گرفتن عکس از دوربین
            $("#btnCamera").on("click", function () {
                $("#fileInput").attr("capture", "camera").click();
            });

            // وقتی کاربر فایلی انتخاب کرد
            $("#fileInput").on("change", function () {
                let file = this.files[0];
                if (!file) return;

                let formData = new FormData();
                formData.append("file", file);

                $.ajax({
                    url: "functions/upload.php",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {


                        if (data.status === "success") {
                            let chat_id = $('#chat_id_input').val()
                            send_messages_chat(chat_id, data.url,'image')
                        } else {
                            alert(data.message);
                        }

                    }
                });
            });

            function sendToN8N(fileUrl) {
                $.post("to_n8n.php", {file: fileUrl}, function (resp) {
                    console.log("Sent to n8n:", resp);
                });
            }

        });

        let mediaRecorder;
        let audioChunks = [];

        $('body').on("click",".startRecord.disable", async function () {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                audioChunks = [];
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = function () {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    $("#player").attr("src", audioUrl);

                    let formData = new FormData();
                    formData.append("file", audioBlob, "voice.webm");

                    $.ajax({
                        url: "functions/upload.php",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            console.log(res);
                            if (res.status === "success") {

                                let chat_id = $('#chat_id_input').val()
                                send_messages_chat(chat_id, res.url,'voice')
                            } else {
                                alert("خطا: " + res.message);
                            }
                        },
                        error: function () {
                            alert("خطا در ارسال فایل به سرور");
                        }
                    });
                };

                mediaRecorder.start();
                $(".startRecord").removeClass('disable')
                $(".startRecord").addClass('enable')

            } catch (e) {
                alert("اجازه ضبط صدا داده نشد یا مرورگر پشتیبانی نمی‌کند");
                console.error(e);
            }
        });

        $("body").on("click",".startRecord.enable", function () {

            mediaRecorder.stop();
            $(".startRecord").removeClass('enable')
            $(".startRecord").addClass('disable')
        });

    </script>
</div>
<div class="box_input_finished hide">
    <p>
        این گفتگو پایان یافته است
    </p>
</div>