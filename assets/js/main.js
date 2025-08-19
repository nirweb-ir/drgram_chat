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
     $(".sidebar_back").click(function (){
         $(".sidebar").removeClass("active")
         $(".sidebar_back").hide()
     })

     $('.sidebar_back').click(function (){

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

    function send(){
        var item_active = $('.chat-item.active')
        let status = item_active.attr('status')
        if (status === 'new'){
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

     $('#messageInput').keydown(function(e) {
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


})



