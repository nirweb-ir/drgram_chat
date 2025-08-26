function fixAppHeight() {
    jQuery(".box_app").css("height", window.innerHeight + "px");
}

jQuery(document).ready(function () {
    fixAppHeight();
    jQuery(window).on("resize orientationchange", fixAppHeight);
});

jQuery(document).ready(function ($) {

    function showToast(message, type = "error") {
        let toast = $("#toast");
        toast.removeClass("success error").addClass(type).text(message).addClass("show");

        setTimeout(() => {
            toast.removeClass("show");
        }, 3000); // بعد از ۳ ثانیه مخفی شود
    }

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
        // const chat_id = $(this).attr('data-chat');
        $('#chat_id_input').val(chat_id);

        let start = $('.chat_item_' + chat_id).attr('start-time')
        if (new Date(start) > new Date()) {
            $('.notifications_pin_top').show()
            $('.notifications_pin_top span').text(toShamsiPretty(start))

        } else {
            $('.notifications_pin_top').hide()
        }


        get_messages_chat(chat_id, true);
    })

    function send() {
        $('.startRecord').show()
        $('.send_message_button').hide()
        var item_active = $('.chat-item.active')
        let status = item_active.attr('status')
        if (status === 'new') {
            $('.chat-item.active').remove()
            $('.chat_list_answered_chats').prepend(item_active)
            $('.chat_list_answered_chats').find('.chat_list_empty').remove()
        }
        let chat_id = $('#chat_id_input').val()
        let message = $('#messageInput').val()

        send_messages_chat(chat_id, message)
        $('#messageInput').val('').trigger("input")
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
        const MAX_SIZE = 6 * 1024 * 1024; // 6MB
        const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'wav', 'ogg', 'webm', 'm4a', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

        const $fileInput = $("#fileInput");
        const $btnUpload = $("#btnUpload");
        const $btnCamera = $("#btnCamera");

        // فقط یک آپلود همزمان
        let uploading = false;

        // انتخاب فایل از گالری/فایل
        $btnUpload.on("click", function () {
            $fileInput.removeAttr("capture"); // برای انتخاب از گالری
            $fileInput.trigger("click");
        });

        // گرفتن از دوربین (در موبایل‌هایی که ساپورت می‌کنند)
        $btnCamera.on("click", function () {
            $fileInput.attr("capture", "environment").trigger("click");
        });

        $fileInput.on("change", function () {
            const file = this.files && this.files[0];
            if (!file) return;

            if (uploading) {
                showToast("آپلود در حال انجام است، لطفاً صبر کنید…", "warning");
                return;
            }

            // ولیدیشن سمت کاربر
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            if (!ALLOWED_EXT.includes(ext)) {
                showToast(`فرمت فایل مجاز نیست (${ext})`, "error");
                this.value = "";
                return;
            }
            if (file.size <= 0) {
                showToast("فایل خالی است", "error");
                this.value = "";
                return;
            }
            if (file.size > MAX_SIZE) {
                const mb = (file.size / 1024 / 1024).toFixed(2);
                showToast(`حجم فایل ${mb}MB است و از حد مجاز بیشتر است`, "error");
                this.value = "";
                return;
            }

            // تعیین نوع پیام (برای send_messages_chat)
            const isImage = file.type && file.type.startsWith("image/");
            const type = isImage ? "image" : "file";

            // پیام لودینگ داخل چت
            const chat_id = $('#chat_id_input').val();
            const loadingId = "loading_" + Date.now();
            const loadingHTML = `
      <div class="message sent" id="${loadingId}">
        <div class="message-bubble">
          <div class="loading-spinner"></div>
          <div class="message-time">در حال آپلود...</div>
        </div>
      </div>`;
            $(".chat_user_box_messages").append(loadingHTML);

            // آماده‌سازی فرم
            const formData = new FormData();
            formData.append("file", file);

            uploading = true;
            $btnUpload.prop("disabled", true);
            $btnCamera.prop("disabled", true);

            $.ajax({
                url: "functions/upload.php",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: "json",
                timeout: 60000,
                success: function (res) {
                    $("#" + loadingId).remove();
                    if (res && res.status === "success" && res.url) {
                        send_messages_chat(chat_id, res.url, type);
                        showToast("فایل با موفقیت آپلود شد ✅", "success");
                    } else {
                        const msg = (res && (res.message || res.code)) ? `${res.message} (${res.code || ''})` : "خطای ناشناخته در آپلود";
                        showToast("❌ " + msg, "error");
                    }
                },
                error: function (xhr, status, err) {
                    $("#" + loadingId).remove();
                    let msg = "خطا در برقراری ارتباط با سرور";
                    if (xhr && xhr.responseText) {
                        try {
                            const j = JSON.parse(xhr.responseText);
                            if (j && j.message) msg = `${j.message}${j.code ? " (" + j.code + ")" : ""}`;
                        } catch (_) {
                            // responseText غیر JSON (مثلاً خطای 500 با HTML)
                            msg = err || status || msg;
                        }
                    } else if (err) {
                        msg = err;
                    }
                    showToast("❌ " + msg, "error");
                },
                complete: function () {
                    uploading = false;
                    $btnUpload.prop("disabled", false);
                    $btnCamera.prop("disabled", false);
                    // ریست input تا انتخاب همان فایل دوباره هم تریگر شود
                    $fileInput.val("");
                }
            });
        });
    });


    /***** recode ****/
    let recorder;
    let stream;
    let audioBlob = null;
    let timerInterval;
    let seconds = 0;
    let isPaused = false;

// 🎵 تبدیل WAV به MP3
    function convertBlobToMP3(blob, callback) {
        const reader = new FileReader();
        reader.onload = function () {
            const arrayBuffer = reader.result;
            const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
            if (!wav) {
                alert("خطا در خواندن فایل WAV. مطمئن شوید که ضبط WAV واقعی است.");
                return;
            }

            const samples = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
            const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
            const mp3Data = [];
            let sampleBlockSize = 1152;
            for (let i = 0; i < samples.length; i += sampleBlockSize) {
                const sampleChunk = samples.subarray(i, i + sampleBlockSize);
                const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) mp3Data.push(mp3buf);
            }
            const mp3buf = mp3Encoder.flush();
            if (mp3buf.length > 0) mp3Data.push(mp3buf);

            const mp3Blob = new Blob(mp3Data, {type: 'audio/mp3'});
            callback(mp3Blob);
        };
        reader.readAsArrayBuffer(blob);
    }

// ⏱ تایمر
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

// 🎙 شروع ضبط
    $("#startBtn").on("click", async function () {
        $('.box_record_options').addClass('active');
        stream = await navigator.mediaDevices.getUserMedia({audio: true});

        recorder = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            recorderType: StereoAudioRecorder, // ← مهم برای WAV واقعی
            numberOfAudioChannels: 1
        });

        recorder.startRecording();
        // console.log("Recording started...");

        resetTimer();
        startTimer();
    });

// ⏸ توقف/ادامه
    $("#pauseBtn").on("click", function () {
        if (!isPaused) {
            $('#pauseBtn_icon')?.hide();
            $('#pauseBtn_icon_play')?.show();
            $('.status_record').addClass('stop');

            recorder.pauseRecording();
            isPaused = true;
            pauseTimer();
        } else {
            $('#pauseBtn_icon_play')?.hide();
            $('#pauseBtn_icon')?.show();
            $('.status_record').removeClass('stop');
            recorder.resumeRecording();
            isPaused = false;
            resumeTimer();
        }
    });

// ❌ حذف ضبط
    $("#deleteBtn").on("click", function () {
        $('.box_record_options').removeClass('active');
        if (recorder) {
            recorder.stopRecording(function () {
                recorder.reset();
            });
        }
        audioBlob = null;
        $("#player").attr("src", "");
        resetTimer();
        stopStream();
    });

// 📤 ارسال صدا
    $("#sendBtn").on("click", function () {
        if (!recorder) return;
        $('.box_record_options').removeClass('active');
        resetTimer();

        if (recorder.getState() === 'recording' || recorder.getState() === 'paused') {
            recorder.stopRecording(function () {
                audioBlob = recorder.getBlob();

                convertBlobToMP3(audioBlob, function (mp3Blob) {
                    audioBlob = mp3Blob;
                    sendAudio();
                    // نمایش پیش‌نمایش MP3
                    const player = document.getElementById("player");
                    player.src = URL.createObjectURL(audioBlob);
                });
            });
        } else {
            sendAudio();
        }
        stopStream();
    });

// ارسال به سرور
    function sendAudio() {
        if (!audioBlob) {
            // console.log("⚠️ هیچ فایل ضبط شده‌ای وجود ندارد.");
            return;
        }

        let formData = new FormData();
        formData.append("file", audioBlob, "voice.mp3");

        $.ajax({
            url: "functions/upload.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                // console.log("✅ upload response:", res);
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



