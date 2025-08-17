<div class="input-area ">

    <!-- باتن ارسال پیام -->
    <button class="send-button" id="sendButton"> ➤ </button>
    <input type="hidden" id="chat_id_input" value="">

    <!-- باتن اتخاب عکس -->

    <div class="attach_file" id="btnUpload">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.27 122.88" width="25px"><path d="M11.1,67.22a4.09,4.09,0,1,1-5.79-5.79L58,8.75a30.77,30.77,0,0,1,43.28,43.74L38.05,115.74l-.33.3c-4.77,4.21-9.75,6.59-15,6.82s-10.62-1.77-15.89-6.34h0l-.07-.06h0l-.15-.15a23.21,23.21,0,0,1-5.34-8A18.84,18.84,0,0,1,.14,99.16a22.87,22.87,0,0,1,4-10.47,51.46,51.46,0,0,1,6.43-7.35l58.68-58.7a13.05,13.05,0,0,1,18.34-.09l.09.09a13,13,0,0,1,.24,18.15l-.24.27L37.14,91.58a4.09,4.09,0,0,1-5.79-5.79L82,35.12a4.89,4.89,0,0,0-.13-6.67l0,0a4.84,4.84,0,0,0-6.83,0L16.33,87.12a46,46,0,0,0-5.45,6.17,15,15,0,0,0-2.62,6.83,10.92,10.92,0,0,0,.64,5.25,15.28,15.28,0,0,0,3.42,5.07c3.56,3.06,6.91,4.4,10.09,4.26s6.51-1.81,9.88-4.79l63.2-63.2A22.59,22.59,0,0,0,63.75,14.57L11.1,67.22Z"/></svg>

    </div>



    <input type="file" id="fileInput" accept="image/*" style="display:none">

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

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(function(){

            // آپلود از گالری یا فایل
            $("#btnUpload").on("click", function(){
                $("#fileInput").click();
            });

            // گرفتن عکس از دوربین
            $("#btnCamera").on("click", function(){
                $("#fileInput").attr("capture","camera").click();
            });

            // وقتی کاربر فایلی انتخاب کرد
            $("#fileInput").on("change", function(){
                let file = this.files[0];
                if(!file) return;

                let formData = new FormData();
                formData.append("file", file);

                $.ajax({
                    url: "functions/upload.php",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(res){
                        try {
                            let data = JSON.parse(res);
                            if(data.status === "success"){
                                $("#preview").html("<img src='"+data.url+"' width='150'>");
                                // اینجا آدرس فایل را می‌توانی به n8n بفرستی
                                sendToN8N(data.url);
                            } else {
                                alert(data.message);
                            }
                        } catch(e){
                            alert("خطای سرور");
                        }
                    }
                });
            });

            function sendToN8N(fileUrl){
                $.post("to_n8n.php", { file: fileUrl }, function(resp){
                    console.log("Sent to n8n:", resp);
                });
            }

        });
    </script>
</div>