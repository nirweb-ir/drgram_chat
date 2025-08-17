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

function send_messages_chat(chat_id, message,type = 'text') {
    var chatBox = $('.chat_user_box_messages');
    let data = ''
    let time = toShamsi(Date.now() / 1000)
    if (type === 'image') {
        data = `<div class="message sent">
                             <div class="message-bubble image_message">
                                <a href="` + message + `"  target="_blank">
                            <img src="` + message + `">
                                </a>
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`;

    }else {
        data = `<div class="message sent">
                            <div class="message-bubble">
                                ` + message + `
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`;
    }

    chatBox.append(data)
    chatBox.scrollTop(chatBox[0].scrollHeight);
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            action: "send_messages_to_chat",
            chat_id,message,type
        },
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response) {

            } else {

            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });
}

function get_messages_chat(chat_id) {
    var chatBox = $('.chat_user_box_messages');
    chatBox.html('<div class="chat_loading"></div>')
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            action: "get_messages_chat",
            chat_id
        },
        dataType: "json",
        success: function (response) {
            if (response) {

                let data = ''
                $.each(response, function (index, value) {
                    let timestamp = new Date(value.created_at).getTime();
                    let time = toShamsi(timestamp/1000)
                    if (value.type === 'image'){
                        data = data + `<div class="message received">
                            <div class="message-bubble image_message">
                                <a href="` + value.message + `"  target="_blank">
                            <img src="` + value.message + `">
                                </a>
                               
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`;
                    }else {
                        data = data + `<div class="message received">
                            <div class="message-bubble">
                                ` + value.message + `
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`;
                    }

                })
                $('.chat_user_box_messages').html(data)
            } else {
                $(".chat_user_box_messages").html("<p class='not_find_message'>پیامی یافت نشد!</p>");
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });
}


jQuery(document).ready(function ($) {


    function check_message(data) {
        var chatBox = $('.chat_user_box_messages');
        let time = toShamsi(Date.now() / 1000)
        if (data.message_type === 'image') {
            chatBox.append(`<div class="message received">
                            <div class="message-bubble image_message">
                                <a href="` + data.message + `" target="_blank">
                            <img src="` + data.message + `">
                                </a>
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`)

            chatBox.scrollTop(chatBox[0].scrollHeight);
        }else {
            chatBox.append(`<div class="message received">
                            <div class="message-bubble">
                                ` + data.message + `
                                    <div class="message-time"> ` + time + ` </div>
                            </div>
                        </div>`)
        }
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    function connect_io(idClient) {
        const socket = io("https://socketchat.darkube.app");


        const userId = idClient;

        if (userId) {
            // وقتی اتصال برقرار شد، userId را به سرور بفرست
            socket.on("connect", () => {
                console.log("اتصال برقرار شد:", socket.id);
                socket.emit("register", userId);
            });
            socket.on("new-message", (data) => {
                check_message(data)
            });
        }
    }

    function get_list_chats(user_id) {
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: {
                action: "get_list_chats",
                user_id
            },
            dataType: "json",
            success: function (response) {
                console.log(response)
                if (response) {
                    let data_new = ''
                    let data = ''
                    $.each(response, function (index, value) {
                        let message = '...'
                        if (value.last_message !== null) {
                            message = value.last_message
                        }
                        if (value.conversation_status === 'new') {

                            data_new = data_new + `<div class="chat-item " data-chat="` + value.conversation_id + `">
                        
                                <div class="chat-avatar">
                                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="1.5"/>
                                        <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div class="chat-info">
                                    <div class="chat-name">` + value.other_display_name + `</div>
                                    <div class="chat-last-message">` + message + `</div>
                                </div>
                                <div class="chat-meta">
                                    
                                </div>
                            </div>`
                        } else {
                            {
                                data = data + `<div class="chat-item " data-chat="` + value.conversation_id + `">
                        
                                <div class="chat-avatar">
                                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="1.5"/>
                                        <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div class="chat-info">
                                    <div class="chat-name">` + value.other_display_name + `</div>
                                    <div class="chat-last-message">` + message + `</div>
                                </div>
                                <div class="chat-meta">
                                    
                                </div>
                            </div>`
                            }
                        }
                    });
                    if (data_new !== '') {
                        $('.chat_list_awaiting_answer').html(data_new)
                    }
                    if (data !== '') {
                        $('.chat_list_answered_chats').html(data)
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


    const urlParams = new URLSearchParams(window.location.search);
    let idClient = urlParams.get('id_client');


    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            action: "check_user_id",
            id_client: idClient
        },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                let user_id = response.user_id

                connect_io(user_id)
                get_list_chats(user_id)
                $('.loading_page_back').hide()
            } else {
                $("#response").html("<p style='color:red'>" + response.message + "</p>");
            }
        },
        error: function (xhr, status, error) {
            $("#response").html("<p style='color:red'>Ajax error: " + error + "</p>");
        }
    });


})