function toShamsi(dateInput) {
    let date;

    if (typeof dateInput === "number") {
        // اگر عدد بود (timestamp)
        // بررسی کنیم آیا بر حسب ثانیه داده شده یا میلی‌ثانیه
        if (dateInput.toString().length <= 10) {
            // ثانیه‌ای
            date = new Date(dateInput * 1000);
        } else {
            // میلی‌ثانیه‌ای
            date = new Date(dateInput);
        }
    } else {
        // اگر رشته یا آبجکت تاریخ بود
        date = new Date(dateInput);
    }

    return date.toLocaleString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function get_id() {
    const name = 'dpchat_id';
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
        const [key, value] = cookie.trim().split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}
function truncateText(text, maxLength = 20) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
// -------------------------
// ساخت HTML پیام
// -------------------------
let svg_check_send = `<div class="svg_check_send"><svg width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 109.76" style="enable-background:new 0 0 122.88 109.76" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#777777;}</style><g><path class="st0" d="M0,52.88l22.68-0.3c8.76,5.05,16.6,11.59,23.35,19.86C63.49,43.49,83.55,19.77,105.6,0h17.28 C92.05,34.25,66.89,70.92,46.77,109.76C36.01,86.69,20.96,67.27,0,52.88L0,52.88z"/></g></svg></div>`
let svg_check_seen = `<div class="svg_check_seen"><svg width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 109.76" style="enable-background:new 0 0 122.88 109.76" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#777777;}</style><g><path class="st0" d="M0,52.88l22.68-0.3c8.76,5.05,16.6,11.59,23.35,19.86C63.49,43.49,83.55,19.77,105.6,0h17.28 C92.05,34.25,66.89,70.92,46.77,109.76C36.01,86.69,20.96,67.27,0,52.88L0,52.88z"/></g></svg></div>`
function buildMessageHTML(id=0,message, type, senderClass = 'sent', timestamp = null ,seen = false) {

    const time = timestamp || toShamsi(Date.now() / 1000);
    let safeMessage = message.replace(/\n/g, "<br>");
    let svg_check = ''
    if (senderClass === 'sent'){
        svg_check = svg_check_send
        if (seen){
            svg_check += svg_check_seen
        }
    }
    if (type === 'image') {
        return `
        <div class="message ${senderClass}" id="message_${id}" data-id="${id}">
            <div class="message-bubble image_message">
                <a href="${message}" target="_blank">
                    <img src="${message}">
                </a>
                <div class="message-time">${time}</div>
            </div>
            ${svg_check}
        </div>`;
    } else if (type === 'voice') {
        return `
        <div class="message ${senderClass}" id="message_${id}" data-id="${id}">
            <div class="message-bubble voice_message">
                <audio id="player" src="${message}" controls></audio>
                <div class="message-time">${time}</div>
            </div>
            ${svg_check}
        </div>`;
    } else {
        return `
        <div class="message ${senderClass}" id="message_${id}" data-id="${id}">
            <div class="message-bubble">
                ${safeMessage}
                <div class="message-time">${time}</div>
            </div>
            ${svg_check}
        </div>`;
    }
}

// -------------------------
// اضافه کردن پیام به DOM
// -------------------------
function appendMessage(chatBox, messageHTML) {
    chatBox.append(messageHTML);
    chatBox.scrollTop(chatBox[0].scrollHeight);
}

// -------------------------
// ارسال پیام
// -------------------------
function send_messages_chat(chat_id, message, type = 'text') {
    if(message !== '') {
        const chatBox = $('.chat_user_box_messages');
        let id = Date.now()
        const messageHTML = buildMessageHTML(id, message, type, 'sent');
        appendMessage(chatBox, messageHTML);
        if ($('.chat_user_box_messages').find('.not_find_message').length) {
            $('.chat_user_box_messages').find('.not_find_message').remove()
        }
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: {action: "send_messages_to_chat", chat_id, message, type},
            dataType: "json",
            success: function (response) {
                if (response) {

                    $('#message_' + id).attr('data-id', response.id)
                    $('#message_' + id).attr('id', 'message_' + response.id)
                } else {
                    // حالت دیگه
                }
            },
            error: function (xhr, status, error) {
                $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
            }
        });
    }
}

// -------------------------
// گرفتن پیام‌ها
// -------------------------
function bindInfiniteScroll() {
    const $box = $('.chat_user_box_messages');
    if (!$box.length) return;

    // جلوگیری از دوبار بایند شدن
    $box.off('scroll.infinite');

    let isLoadingOlder = false;
    let lastLoadTime = 0; // برای محدودیت زمانی

    $box.on('scroll.infinite', function () {
        const el = this;

        if (el.scrollTop <= 5 && !isLoadingOlder) {
            const now = Date.now();
            if (now - lastLoadTime < 1000) {
                // کمتر از ۱ ثانیه از درخواست قبلی گذشته → بی‌خیال
                return;
            }
            lastLoadTime = now;
            isLoadingOlder = true;

            const firstMsgId = $box.find('.message').first().attr('data-id');
            const chat_id = $('#chat_id_input').val();
            const oldHeight = el.scrollHeight;

            // نمایش لودینگ بالا
            if (!$box.children('.chat_loading_top').length) {
                $box.prepend('<div class="chat_loading_top"><span class="spinner"></span></div>');
            }

            $.ajax({
                url: ajaxUrl,
                type: "POST",
                data: { action: "get_older_messages", chat_id, last_id: firstMsgId },
                dataType: "json"
            })
                .done(function (response) {
                    if (response && response.messages && response.messages.length) {
                        let html = '';
                        response.messages.reverse().forEach(msg => {
                            const senderClass = Number(get_id()) === Number(msg.user_id) ? 'sent' : 'received';
                            html += buildMessageHTML(msg.id, msg.content, msg.message_type, senderClass, toShamsi(msg.created_at), msg.status);
                        });

                        $box.prepend(html);

                        // جلوگیری از پرش اسکرول
                        const newHeight = el.scrollHeight;
                        el.scrollTop = newHeight - oldHeight;
                    } else {
                        // دیگه پیامی نیست
                        // می‌تونی اینجا پیام "پایان تاریخچه" نشون بدی
                    }
                })
                .fail(function (xhr, status, err) {
                    console.error('loadOlderMessages error:', err);
                })
                .always(function () {
                    // چه موفق چه خطا → لودینگ رو بردار
                    $('.chat_loading_top').remove();
                    isLoadingOlder = false;
                });
        }
    });
}



// وقتی چت را باز می‌کنی: لود کن، اسکرول را انتهای گفتگو ببر، بعد بایند کن
function get_messages_chat(chat_id, scrollToBottom = true) {
    const $box = $('.chat_user_box_messages');
    $box.html('<div class="chat_loading"></div>');

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "get_messages_chat", chat_id },
        dataType: "json",
        success: function (response) {
            if (response && response.messages && response.messages.length) {
                let html = '';
                // فرض: API جدید→قدیم می‌دهد؛ برای نمایش از قدیم→جدید:
                response.messages.reverse().forEach(msg => {
                    const senderClass = Number(get_id()) === Number(msg.user_id) ? 'sent' : 'received';
                    html += buildMessageHTML(msg.id, msg.content, msg.message_type, senderClass, toShamsi(msg.created_at), msg.status);
                });
                $box.html(html);

                if (scrollToBottom) {
                    $box.scrollTop($box[0].scrollHeight); // بدون تاخیر
                }

                // اینجا بایند کن تا مطمئن باشی عنصر وجود دارد
                bindInfiniteScroll();

            } else {
                let start_time = $('.chat_item_'+chat_id).attr('start-time')
                let end_time = $('.chat_item_'+chat_id).attr('end-time')
                start_time = toShamsi(start_time)
                end_time = toShamsi(end_time)
                $box.html(`<p class='not_find_message'>پیام خود را بنویسید <br> زمان پاسخ گویی بین ${start_time} تا ${end_time} است </p>`);
                bindInfiniteScroll();
            }
        }
    });
}

// -------------------------
// بررسی پیام جدید
// -------------------------
function check_message(data) {
    const chatBox = $('.chat_user_box_messages');
    const currentChatId = Number($('#chat_id_input').val());
    const chatId = Number(data.chat_id);
    if (chatId === currentChatId) {
        const msgHTML = buildMessageHTML(data.message_id,data.message, data.message_type, 'received');

        if ($('.chat_user_box_messages').find('.not_find_message')){
            $('.chat_user_box_messages').find('.not_find_message').remove()
        }
        appendMessage(chatBox, msgHTML);

        seen_message(data.message_id,data.chat_id)
    } else {
        const item = $('.chat_item_' + chatId);
        if (item.find('.new_message').length) {
            const num = Number(item.find('.new_message').text());
            item.find('.new_message').text(num + 1);
        } else {
            item.append('<span class="new_message">1</span>');
        }
        item.find('.chat-last-message').text(truncateText(data.message))
    }
}
// -------------------------
// بررسی پیام جدید
// -------------------------
function seen_message(message_id,chat_id) {
    console.log(message_id)
    console.log(chat_id)
    if (message_id > 0) {
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: {action: "seen_message", message_id,chat_id},
            dataType: "json",
            success: function (response) {
                if (response) {

                } else {

                }
            },
            error: function (xhr, status, error) {
                $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
            }
        });
    }
}
function seen_old_message(data) {

    let id = data.message_id

        var message =$('#message_'+id)

        if (!message.find('.svg_check_seen').length){
            message.append(svg_check_seen)
        }


}

// -------------------------
// اتصال به Socket.IO
// -------------------------
function connect_io(idClient) {
    const socket = io("https://socketchat.darkube.app");
    const userId = idClient;

    if (userId) {
        socket.on("connect", () => {
            console.log("اتصال برقرار شد:", socket.id);
            socket.emit("register", userId);
        });
        socket.on("new-message", (data) => {
            check_message(data);
        });
        socket.on("seen-message", (data) => {
            seen_old_message(data);
        });
    }
}

// -------------------------
// گرفتن لیست چت‌ها
// -------------------------
function buildChatItemHTML(value) {
    let message = value.last_message || "...";
    if (value.message_type === 'image') {
        message = "فایل رسانه";
    }
    if (value.message_type === 'voice') {
        message = "فایل صوتی";
    }
    let new_m = value.count > 0 ? `<span class="new_message">${value.count}</span>` : '';

    return `
        <div class="chat-item chat_item_${value.id}" data-chat="${value.id}" status="${value.status}"
        start-time="${value.start_at}" end-time="${value.end_at}">
            ${new_m}
            <div class="chat-avatar">
                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="1.5"/>
                    <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="chat-info">
                <div class="chat-name">${value.title}</div>
                <div class="chat-last-message">${truncateText(message)}</div>
            </div>
            <div class="chat-meta"></div>
        </div>`;
}

function get_list_chats(user_id,convesation_id) {
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "get_list_chats", user_id },
        dataType: "json",
        success: function (response) {
           let conversations_list   =response.conversations ?? []
            if (conversations_list) {
                let data_new = '';
                let data_finish = '';
                let data = '';
                $.each(conversations_list, function (index, value) {
                    if (value.status === 'new') {
                        data_new += buildChatItemHTML(value);
                    } else if(value.status === 'finished') {
                        data_finish += buildChatItemHTML(value);
                    }else  {
                        data += buildChatItemHTML(value);
                    }
                });

                if (data_new !== '') $('.chat_list_answered_chats').html(data_new);
                if (data_finish !== '') $('.chat_list_finished_chats').html(data_finish);
                if (data !== '') $('.chat_list_answered_chats').html(data);

                if (convesation_id){
                    console.log(convesation_id)
                    var chat_item =  $('.chat_item_'+convesation_id)
                    chat_item.addClass('active')
                    let user_name = chat_item.find('.chat-name').text()
                    chat_item.find('.new_message').remove()
                    let chat_id = chat_item.attr('data-chat')
                    let status = chat_item.attr('status')
                    $('.chat-header-info h3').text(user_name)
                    $('.chat_user_box').addClass('active')
                    $('#chat_id_input').val(chat_id);
                    get_messages_chat(chat_id, true);
                }

            } else {
                $("#response").html("<p style='color:red'>" + response.message + "</p>");
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });
}

// -------------------------
// شروع
// -------------------------
jQuery(document).ready(function ($) {
    const urlParams = new URLSearchParams(window.location.search);
    let idClient = urlParams.get('code');

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "check_user_id", id_client: idClient },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                let url = new URL(window.location.href);
                url.searchParams.delete("code");
                window.history.replaceState({}, document.title, url);
                let user_id = response.user_id;
                connect_io(user_id);
                get_list_chats(user_id,response.convesation_id);

                $('.loading_page_back').hide();
            } else {
                $('.loading_page_back').hide();
                show_error('خطا','کاربر یافت نشد')
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });



});
function show_error(title='خطا',message='خطایی رخ داده است'){
    $(".popup_error_message h3").text(title)
    $(".popup_error_message p").text(message)
    $(".popup_error_message_back").show()
    $(".popup_error_message").show()
}