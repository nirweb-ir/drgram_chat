jQuery(document).ready(function ($) {


    // -------------------------------------------
    //  سویج بین پیوی های درحال انتظار و پیوی های جواب داده شود

    $(".filter_top_pv_item").on("click", function () {

        let status = $(this).attr("status");
        $(".filter_top_pv_item").removeClass("active");
        $(this).addClass("active");

        $(".chat_list_awaiting_answer").removeClass("active");
        $(".chat_list_answered_chats").removeClass("active");
        $(".chat_list_finished_chats").removeClass("active");

        if (status == "waiting") {
            $(".chat_list_awaiting_answer").addClass("active");
        } else if (status == "finish") {
            $(".chat_list_finished_chats").addClass("active");
        } else {
            $(".chat_list_answered_chats").addClass("active");
        }

    })

    // -------------------------------------------
    //  نمایش و پینهان کردن pv ها

    $(".section_show_message_header_icon_menu").on("click", function () {

        if (window.innerWidth > 768) {
            $(".sidebar").addClass("active")
            if ($(".sidebar").hasClass("active")) {
                $(this).find("p").html("نمایش گفتوگو ها");
                $(".sidebar").removeClass("active");
            } else {
                $(this).find("p").html("پنهان کردن گفتوگو ها");
                $(".sidebar").addClass("active");
            }

        } else {

            $(".sidebar").addClass("active")
            $(".sidebar_back").show()
        }
    })
    $(".sidebar_back").click(function () {
        $(".sidebar").removeClass("active")
        $(".sidebar_back").hide()
    })

    $('.sidebar_back').click(function () {

    })

    $("body").on("click", '.chat-item', function () {
        $(".sidebar").removeClass("active")
        $(".sidebar_back").hide()
        $('.chat-item').removeClass('hide')
        $(this).addClass('active')

        var chatBox = $('.chat_user_box_messages');
        if ($(".sidebar").hasClass("show")) {
            $(this).find("p").html("نمایش گفتوگو ها");
            $(".sidebar").removeClass("show");
        }
        let user_name = $(this).find('.chat-name').text()
        $(this).find('.new_message').remove()
        let chat_id = $(this).attr('data-chat')
        let status = $(this).attr('status')
        $('.chat-header-info h3').text(user_name)
        if (status === 'finished') {
            $('.input-area').addClass('hide')
            $('.box_input_finished ').removeClass('hide')
        } else {
            $('.input-area ').removeClass('hide')
            $('.box_input_finished').addClass('hide')
        }

        $('.chat_user_box').addClass('active')
        $('#chat_id_input').val(chat_id)
        get_messages_chat(chat_id)
        setTimeout(function () {
            chatBox.scrollTop(chatBox[0].scrollHeight);
        }, '1000')
    })

    function send() {
        $('.startRecord').hide()
        $('.send_message_button').show()
        var item_active = $('.chat-item.active')
        let status = item_active.attr('status')
        if (status === 'new') {
            $('.chat-item.active').remove()
            $('.chat_list_answered_chats').prepend(item_active)
            $('.chat_list_answered_chats').find('.chat_list_empty').remove()
        }
        let chat_id = $('#chat_id_input').val()
        let message = $('#messageInput').val()
        console.log(message)
        send_messages_chat(chat_id, message)
        $('#messageInput').val('')
    }

    $('body').on('click', '#sendButton', function () {
        send()
    })

    function isMobile() {
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    }

    $('#messageInput').keydown(function (e) {
        if (e.key === "Enter") {
            if (isMobile()) {
                // روی موبایل: فقط خط جدید بسازه (ارسال نکنه)
                return;
            } else {
                // روی دسکتاپ: Enter = ارسال / Shift+Enter = خط جدید
                if (!e.shiftKey) {
                    e.preventDefault(); // جلوگیری از رفتن به خط بعد
                    send();
                }
            }
        }
    });

    $(document).on('click', '.image_message img', function (e) {
        e.preventDefault();
        var src = $(this).attr('src');
        $('#lightbox-img').attr('src', src);
        $('#lightbox').fadeIn();
    });

    // بستن لایت‌باکس
    $('#lightbox .close').click(function () {
        $('#lightbox').fadeOut();
    });

    // بستن با کلیک روی بک‌گراند
    $('#lightbox').click(function (e) {
        if (e.target.id === 'lightbox') {
            $(this).fadeOut();
        }
    });

    /*****/
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
    /*********/

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
                        send_messages_chat(chat_id, data.url, 'image')
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

    /***** recode ****/
    let recorder;
    let stream;
    let audioBlob = null;
    let timerInterval;
    let seconds = 0;
    let isPaused = false;

    function formatTime(sec) {
        let m = Math.floor(sec / 60).toString().padStart(2, '0');
        let s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (!isPaused) {
                seconds++;
                $("#timer").text(formatTime(seconds));
            }
        }, 1000);
    }
    function pauseTimer() {
        clearInterval(timerInterval);
        $("#timer").addClass("blink");
    }
    function resumeTimer() {
        $("#timer").removeClass("blink");
        startTimer();
    }
    function resetTimer() {
        clearInterval(timerInterval);
        seconds = 0;
        $("#timer").text("00:00").removeClass("blink");
    }
    function stopStream() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    $("#startBtn").on("click", async function () {
        $('.box_record_options').addClass('active');
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        recorder = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=opus',
            recorderType: MediaStreamRecorder,
            numberOfAudioChannels: 1
        });

        recorder.startRecording();
        console.log("Recording started...");

        resetTimer();
        startTimer();

    });

    $("#pauseBtn").on("click", function () {
        if (!isPaused) {
            $('#pauseBtn_icon').hide();
            $('#pauseBtn_icon_play').show();

            recorder.pauseRecording();
            isPaused = true;
            pauseTimer();
        } else {
            $('#pauseBtn_icon_play').hide();
            $('#pauseBtn_icon').show();

            recorder.resumeRecording();
            isPaused = false;
            resumeTimer();
        }
    });

    $("#deleteBtn").on("click", function () {
        $('.box_record_options').removeClass('active');
        if (recorder) {
            recorder.stopRecording(function() {
                recorder.reset();
            });
        }
        audioBlob = null;
        $("#player").attr("src", "");
        resetTimer();
        stopStream()
    });

// 📤 ارسال (Stop و ارسال)
    $("#sendBtn").on("click", function () {
        if (!recorder) return;
        $('.box_record_options').removeClass('active');
        resetTimer();
        if (recorder.getState() === 'recording' || recorder.getState() === 'paused') {
            recorder.stopRecording(function() {
                audioBlob = recorder.getBlob();

                sendAudio();
            });
        } else {
            sendAudio();
        }
        stopStream()
    });

    function sendAudio() {
        if (!audioBlob) {
            console.log("⚠️ هیچ فایل ضبط شده‌ای وجود ندارد.");
            return;
        }

        let formData = new FormData();
        formData.append("file", audioBlob, "voice.webm");

        $.ajax({
            url: "functions/upload.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log("✅ upload response:", res);
                if (res.status === "success") {
                    let chat_id = $('#chat_id_input').val();
                    send_messages_chat(chat_id, res.url, 'voice');
                } else {
                    alert("خطا: " + res.message);
                }
            },
            error: function () {
                alert("خطا در ارسال فایل به سرور");
            }
        });
    }


    /**** show btns ***/
    $('#messageInput').on('input', function () {
        let val = $(this).val()
        if (val.length > 0) {
            $('.startRecord').hide()
            $('.send_message_button').show()
        } else {
            $('.send_message_button').hide()
            $('.startRecord').show()
        }
    })
})



