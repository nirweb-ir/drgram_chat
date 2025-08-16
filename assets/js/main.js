jQuery(document).ready(function ($) {


    // -------------------------------------------
    //  سویج بین پیوی های درحال انتظار و پیوی های جواب داده شود

    $(".filter_top_pv_item").on("click", function () {

        let status = $(this).attr("status");
        $(".filter_top_pv_item").removeClass("active");
        $(this).addClass("active");

        $(".chat_list_awaiting_answer").removeClass("active");
        $(".chat_list_answered_chats").removeClass("active");

        if ( status == "waiting" ) {
            $(".chat_list_awaiting_answer").addClass("active");
        } else {
            $(".chat_list_answered_chats").addClass("active");
        }

    })

    // -------------------------------------------
    //  نمایش و پینهان کردن pv ها

    $(".section_show_message_header_icon_menu").on("click", function () {

        if (window.innerWidth > 768) {

            if ( $(".sidebar").hasClass("active") ) {
                $(this).find("p").html("نمایش گفتوگو ها");
                $(".sidebar").removeClass("active");
            } else {
                $(this).find("p").html("پنهان کردن گفتوگو ها");
                $(".sidebar").addClass("active");
            }

        }
        else {

            if ( $(".sidebar").hasClass("show") ) {
                $(this).find("p").html("نمایش گفتوگو ها");
                $(".sidebar").removeClass("show");
            } else {
                $(this).find("p").html("پنهان کردن گفتوگو ها");
                $(".sidebar").addClass("show");
            }
        }
    })


    $(".chat-item").on("click", function () {

        if ( $(".sidebar").hasClass("show") ) {
            $(this).find("p").html("نمایش گفتوگو ها");
            $(".sidebar").removeClass("show");
        }

    })





})



