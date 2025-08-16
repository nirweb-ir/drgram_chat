














//  سویج بین پیوی های درحال انتظار و پیوی های جواب داده شود
jQuery(document).ready(function ($) {

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

})
