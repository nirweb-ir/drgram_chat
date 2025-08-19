function toShamsi(dateInput) {
    const date = new Date(dateInput * 1000);
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
function buildMessageHTML(message, type, senderClass = 'sent', timestamp = null) {
    const time = timestamp || toShamsi(Date.now() / 1000);
    let safeMessage = message.replace(/\n/g, "<br>");
    if (type === 'image') {
        return `
        <div class="message ${senderClass}">
            <div class="message-bubble image_message">
                <a href="${message}" target="_blank">
                    <img src="${message}">
                </a>
                <div class="message-time">${time}</div>
            </div>
        </div>`;
    } else {
        return `
        <div class="message ${senderClass}">
            <div class="message-bubble">
                ${safeMessage}
                <div class="message-time">${time}</div>
            </div>
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
    const chatBox = $('.chat_user_box_messages');
    const messageHTML = buildMessageHTML(message, type, 'sent');
    appendMessage(chatBox, messageHTML);
    if ($('.chat_user_box_messages').find('.not_find_message')){
        $('.chat_user_box_messages').find('.not_find_message').remove()
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "send_messages_to_chat", chat_id, message, type },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response) {
                // می‌تونی اینجا لاجیک اضافه کنی
            } else {
                // حالت دیگه
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });
}

// -------------------------
// گرفتن پیام‌ها
// -------------------------
function get_messages_chat(chat_id) {
    const chatBox = $('.chat_user_box_messages');
    chatBox.html('<div class="chat_loading"></div>');

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "get_messages_chat", chat_id },
        dataType: "json",
        success: function (response) {
            if (response && response.length) {
                response.reverse();
                let html = '';
                response.forEach(msg => {
                    const senderClass = Number(get_id()) === Number(msg.sender_id) ? 'sent' : 'received';
                    const timestamp = new Date(msg.created_at).getTime() / 1000;
                    html += buildMessageHTML(msg.message, msg.type, senderClass, toShamsi(timestamp));
                });
                chatBox.html(html);
            } else {
                let start_time = $('.chat_item_'+chat_id).attr('start-time')
                let end_time = $('.chat_item_'+chat_id).attr('end-time')
                start_time = toShamsi(start_time)
                end_time = toShamsi(end_time)
                chatBox.html(`<p class='not_find_message'>پیام خود را بنویسید <br> زمان پاسخ گویی بین ${start_time} تا ${end_time} است </p>`);
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
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
        const msgHTML = buildMessageHTML(data.message, data.message_type, 'received');

        if ($('.chat_user_box_messages').find('.not_find_message')){
            $('.chat_user_box_messages').find('.not_find_message').remove()
        }
        appendMessage(chatBox, msgHTML);

        seen_message(data.message_id)
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
function seen_message(message_id) {
    if (message_id > 0) {
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: {action: "seen_message", message_id},
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response) {


                } else {
                    $("#response").html("<p style='color:red'>" + response.message + "</p>");
                }
            },
            error: function (xhr, status, error) {
                $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
            }
        });
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
    }
}

// -------------------------
// گرفتن لیست چت‌ها
// -------------------------
function buildChatItemHTML(value) {
    let message = value.last_message || "...";
    if (value.last_message_type === 'image') {
        message = "فایل رسانه";
    }
    let new_m = value.unread_count > 0 ? `<span class="new_message">${value.unread_count}</span>` : '';

    return `
        <div class="chat-item chat_item_${value.conversation_id}" data-chat="${value.conversation_id}" status="${value.conversation_status}"
        start-time="${value.book_start_time}" end-time="${value.book_end_time}">
            ${new_m}
            <div class="chat-avatar">
                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="1.5"/>
                    <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="chat-info">
                <div class="chat-name">${value.other_display_name}</div>
                <div class="chat-last-message">${truncateText(message)}</div>
            </div>
            <div class="chat-meta"></div>
        </div>`;
}

function get_list_chats(user_id) {
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "get_list_chats", user_id },
        dataType: "json",
        success: function (response) {

            if (response && response[0].conversation_status) {
                let data_new = '';
                let data_finish = '';
                let data = '';

                $.each(response, function (index, value) {
                    if (value.conversation_status === 'new') {
                        data_new += buildChatItemHTML(value);
                    } else if(value.conversation_status === 'finished') {
                        data_finish += buildChatItemHTML(value);
                    }else  {
                        data += buildChatItemHTML(value);
                    }
                });

                if (data_new !== '') $('.chat_list_awaiting_answer').html(data_new);
                if (data_finish !== '') $('.chat_list_finished_chats').html(data_finish);
                if (data !== '') $('.chat_list_answered_chats').html(data);

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
    let idClient = urlParams.get('id_client');

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: { action: "check_user_id", id_client: idClient },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                let user_id = response.user_id;
                connect_io(user_id);
                get_list_chats(user_id);
                $('.loading_page_back').hide();
            } else {
                $("#response").html("<p style='color:red'>" + response.message + "</p>");
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });
});
