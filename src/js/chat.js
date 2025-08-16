jQuery(document).ready(function ($) {

// باز شدن منوی همبرگری برای مشاهده chat های دیگر

    // open

    $(".show_ather_chat svg").click(function () {
        $(".menu_show_cart_pv").addClass("show");
        $(".screen_black").addClass("active");
    })

    // close

    $(".menu_show_cart_pv").on("click", ".chat-item", function (e) {
        $(".menu_show_cart_pv").removeClass("show");
        $(".screen_black").removeClass("active");
    })

    $(".chat-list .chat-item").click(function (e) {
        $(".menu_show_cart_pv").removeClass("show");
        $(".screen_black").removeClass("active");
    })

// دکتر وقتی که پیام ارسال میکنه

    // نوشتن پیام

    $(".send-button").on("click", function (e) {
        send_message();
    });


    $('.message-input').on('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send_message();
        }
    });


    function send_message() {

        let Error = false;
        let pv_focus = $(".chat-header").attr("id_pv");
        let text = $(".message-input").val();
        // بررسی خالی بودن
        if (!pv_focus || !text.trim()) {
            Error = true;
        }
        if (Error != true) {
            create_messahe(text, pv_focus);
            $(".message-input").val("");
        }
        $(".message-input").css("height", "40px");

    }


    // ساخت message و انتقال به پایین

    function create_messahe(message, pv_focus) {


        // اضافه کردن پیام جدید به دسته

        let class_new_message_hiden = "";
        array_user_pv = JSON.parse(sessionStorage.getItem('array_user_pv'));

        console.log(array_user_pv)

        array_user_pv.forEach(function (Item_, Key_) {
            if (Item_.id == pv_focus) {

                class_new_message_hiden = "hiden_" + Item_.messages.length;

                Item_.messages.push({
                    message_id: class_new_message_hiden,
                    text: message,
                    timestamp: Date.now().toString(),
                    new_or_old: true,
                    role: "Fixer"
                });
            }
        })
        sessionStorage.setItem('array_user_pv', JSON.stringify(array_user_pv))


        //  append message

        let Message__ = `<div class="${class_new_message_hiden} dont_Sin message sent">
                                    <div class="message-bubble">
                                        ${message}
                                    </div>
                                </div>`;
        $(".messages-container").append(Message__);
        let container = document.querySelector('.messages-container');
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
        });


        // صدا زدن api

        save_message_to_data_base(message, pv_focus, class_new_message_hiden);


    }

    // ارسال پیام جدید به سرور برای سیو شدن آن در دیتابیس

    function save_message_to_data_base(message, pv_focus, class_new_message_hiden) {

        let get_id_client = sessionStorage.getItem('id_client');

        callApi(
            'https://n8n.nirweb.ir/webhook/get_message_doctor',
            'POST',
            {
                message: message,
                pv_focus: pv_focus,
                class_new_message_hiden: class_new_message_hiden,
                get_id_client: get_id_client,
                timestamp_: Date.now().toString(),
            }
        )
            .then(data => sin_message(data))
            .catch(err => console.error(err));
    }

    // تغییر حالت پیام به سین شده
    function sin_message(data) {
        $(`.${data.id_chat}`).removeClass(`dont_Sin`);
    }

// -----------------------------------------------------------
// دکتر وقتی که پیام ارسال میکنه

    // OPEN

    $(".messages-container").on("click", ".container_image_message img", function () {
        let get_url_image = $(this).attr("src");
        $(".container_show_image").addClass("active");

        // متغیرها رو تعریف می‌کنیم (درست مثل قبل)
        var $img = $(".container_show_image .main_image");
        var $loader = $(".container_show_image .loader");

        // عکس رو مخفی کن و لودر رو نشون بده:
        $img.hide();
        $loader.show();

        // حالا سورس عکس رو تغییر بده:
        $img.attr("src", get_url_image);
    });

    // فقط یکبار لازم داری این رو ست کنی (بارگزاری اولیه)
    var $img = $(".container_show_image .main_image");
    var $loader = $(".container_show_image .loader");

    $img.on('load', function () {
        $loader.hide();
        $img.fadeIn(200);
    });


    // CLOSE

    $(".container_image svg").on("click", function () {
        $(".container_show_image").removeClass("active");
    })

    $(".container_show_image").on("click", function (e) {
        if (this === e.target) {
            $(".container_show_image").removeClass("active");
        }
    })


// -----------------------------------------------------------
// select image from send

    const $selectButton = $('#selectButton');
    const $fileInput = $('#image');
    const $modal = $('#imageModal');
    const $previewImage = $('#previewImage');
    const $closeModal = $('#closeModal');
    const $submitBtn = $('#submitBtn');
    const $form = $('#uploadForm');

    let id_client ;
    let id_pv ;

    let dont_send_image = true;

    $selectButton.on('click', function () {

        dont_send_image = true;
        $('#submitBtn').html("ارسال عکس");


        id_client = sessionStorage.getItem('id_client');
        id_pv = $(".chat-header").attr("id_pv");

        if (!id_client || !id_pv) {} else {
            $fileInput.click();
        }

    });

    $fileInput.on('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $previewImage.attr('src', e.target.result);
                $modal.fadeIn(200);
                $submitBtn.focus();
            };
            reader.readAsDataURL(this.files[0]);
            $selectButton.text(this.files[0].name);

        } else {
            $modal.fadeOut(200);
            $selectButton.html('<svg class="icon_send_message" width="161" height="162" viewBox="0 0 161 162" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<path d="M95.6001 24.7705H151.208C153.899 24.7705 156.314 25.873 158.059 27.6316C159.818 29.3903 160.92 31.8315 160.92 34.4826V151.762C160.92 154.453 159.818 156.868 158.059 158.613C156.3 160.372 153.859 161.474 151.208 161.474H33.1149C30.4243 161.474 28.0095 160.372 26.2639 158.613C24.5052 156.854 23.4028 154.413 23.4028 151.762V93.9886C26.6445 95.301 30.0306 96.3247 33.5348 96.9941V123.61H33.5742C50.4916 107.428 61.6998 99.4352 78.5253 85.7727C78.5909 85.8383 78.6565 85.904 78.7221 85.9696C78.7615 86.009 78.7615 86.0483 78.8009 86.0483L114.001 127.692L119.382 94.5661C119.749 92.4399 121.744 90.9831 123.87 91.3506C124.684 91.4687 125.419 91.8756 125.996 92.4137L150.696 118.361V36.8319C150.696 36.3069 150.486 35.8475 150.119 35.5325C149.791 35.2044 149.305 34.9551 148.82 34.9551H98.1725C97.6344 31.4377 96.7682 28.0385 95.6001 24.7705ZM44.0212 0.20166C67.7895 0.20166 87.0561 19.4683 87.0561 43.2366C87.0561 67.0048 67.7895 86.2715 44.0212 86.2715C20.2529 86.2715 0.986328 67.0048 0.986328 43.2366C0.986328 19.4683 20.2529 0.20166 44.0212 0.20166ZM21.1585 43.9978H35.6479V64.6818H51.9877V43.9978H66.8971L44.0343 21.7782L21.1585 43.9978ZM124.71 47.0033C128.582 47.0033 132.138 48.5913 134.658 51.1243C137.231 53.6967 138.779 57.2009 138.779 61.0857C138.779 64.9574 137.191 68.5141 134.658 71.034C132.086 73.6064 128.582 75.1551 124.71 75.1551C120.838 75.1551 117.282 73.567 114.749 71.034C112.176 68.4616 110.628 64.9574 110.628 61.0857C110.628 57.214 112.216 53.6705 114.749 51.1243C117.334 48.5519 120.838 47.0033 124.71 47.0033Z" fill="white"/>\n' +
                '</svg>');
        }
    });

    $closeModal.on('click', function () {

        dont_send_image = true;

        $modal.fadeOut(200);
        $fileInput.val('');
        $selectButton.html('<svg class="icon_send_message" width="161" height="162" viewBox="0 0 161 162" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<path d="M95.6001 24.7705H151.208C153.899 24.7705 156.314 25.873 158.059 27.6316C159.818 29.3903 160.92 31.8315 160.92 34.4826V151.762C160.92 154.453 159.818 156.868 158.059 158.613C156.3 160.372 153.859 161.474 151.208 161.474H33.1149C30.4243 161.474 28.0095 160.372 26.2639 158.613C24.5052 156.854 23.4028 154.413 23.4028 151.762V93.9886C26.6445 95.301 30.0306 96.3247 33.5348 96.9941V123.61H33.5742C50.4916 107.428 61.6998 99.4352 78.5253 85.7727C78.5909 85.8383 78.6565 85.904 78.7221 85.9696C78.7615 86.009 78.7615 86.0483 78.8009 86.0483L114.001 127.692L119.382 94.5661C119.749 92.4399 121.744 90.9831 123.87 91.3506C124.684 91.4687 125.419 91.8756 125.996 92.4137L150.696 118.361V36.8319C150.696 36.3069 150.486 35.8475 150.119 35.5325C149.791 35.2044 149.305 34.9551 148.82 34.9551H98.1725C97.6344 31.4377 96.7682 28.0385 95.6001 24.7705ZM44.0212 0.20166C67.7895 0.20166 87.0561 19.4683 87.0561 43.2366C87.0561 67.0048 67.7895 86.2715 44.0212 86.2715C20.2529 86.2715 0.986328 67.0048 0.986328 43.2366C0.986328 19.4683 20.2529 0.20166 44.0212 0.20166ZM21.1585 43.9978H35.6479V64.6818H51.9877V43.9978H66.8971L44.0343 21.7782L21.1585 43.9978ZM124.71 47.0033C128.582 47.0033 132.138 48.5913 134.658 51.1243C137.231 53.6967 138.779 57.2009 138.779 61.0857C138.779 64.9574 137.191 68.5141 134.658 71.034C132.086 73.6064 128.582 75.1551 124.71 75.1551C120.838 75.1551 117.282 73.567 114.749 71.034C112.176 68.4616 110.628 64.9574 110.628 61.0857C110.628 57.214 112.216 53.6705 114.749 51.1243C117.334 48.5519 120.838 47.0033 124.71 47.0033Z" fill="white"/>\n' +
            '</svg>');
    });

    $(window).on('click', function (event) {
        if ($(event.target).is($modal)) {
            $modal.fadeOut(200);
            $fileInput.val('');
            $selectButton.html('<svg class="icon_send_message" width="161" height="162" viewBox="0 0 161 162" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<path d="M95.6001 24.7705H151.208C153.899 24.7705 156.314 25.873 158.059 27.6316C159.818 29.3903 160.92 31.8315 160.92 34.4826V151.762C160.92 154.453 159.818 156.868 158.059 158.613C156.3 160.372 153.859 161.474 151.208 161.474H33.1149C30.4243 161.474 28.0095 160.372 26.2639 158.613C24.5052 156.854 23.4028 154.413 23.4028 151.762V93.9886C26.6445 95.301 30.0306 96.3247 33.5348 96.9941V123.61H33.5742C50.4916 107.428 61.6998 99.4352 78.5253 85.7727C78.5909 85.8383 78.6565 85.904 78.7221 85.9696C78.7615 86.009 78.7615 86.0483 78.8009 86.0483L114.001 127.692L119.382 94.5661C119.749 92.4399 121.744 90.9831 123.87 91.3506C124.684 91.4687 125.419 91.8756 125.996 92.4137L150.696 118.361V36.8319C150.696 36.3069 150.486 35.8475 150.119 35.5325C149.791 35.2044 149.305 34.9551 148.82 34.9551H98.1725C97.6344 31.4377 96.7682 28.0385 95.6001 24.7705ZM44.0212 0.20166C67.7895 0.20166 87.0561 19.4683 87.0561 43.2366C87.0561 67.0048 67.7895 86.2715 44.0212 86.2715C20.2529 86.2715 0.986328 67.0048 0.986328 43.2366C0.986328 19.4683 20.2529 0.20166 44.0212 0.20166ZM21.1585 43.9978H35.6479V64.6818H51.9877V43.9978H66.8971L44.0343 21.7782L21.1585 43.9978ZM124.71 47.0033C128.582 47.0033 132.138 48.5913 134.658 51.1243C137.231 53.6967 138.779 57.2009 138.779 61.0857C138.779 64.9574 137.191 68.5141 134.658 71.034C132.086 73.6064 128.582 75.1551 124.71 75.1551C120.838 75.1551 117.282 73.567 114.749 71.034C112.176 68.4616 110.628 64.9574 110.628 61.0857C110.628 57.214 112.216 53.6705 114.749 51.1243C117.334 48.5519 120.838 47.0033 124.71 47.0033Z" fill="white"/>\n' +
                '</svg>');
        }
    });

    $form.on('submit', function (e) {
        if (!$fileInput.val()) {
            e.preventDefault();
            alert('لطفا ابتدا عکس انتخاب کنید.');
            $modal.fadeOut(200);
        }
    });

    // --------------
    // send image api


    $('#submitBtn').on('click', function () {

        if ( dont_send_image ) {
            dont_send_image = false;

            // تغییر متن دکمه

            let save_html_butten = $(this).html();
            $(this).html("در حال ارسال ...");

            const fileInput = $('#image')[0];
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('لطفاً ابتدا عکس را انتخاب کنید');
                return;
            }

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);  // کلید 'file' یا 'image' به توافق با n8n
            formData.append('user_id', id_client );
            formData.append('id_pv', id_pv );


            fetch('https://n8n.nirweb.ir/webhook/send_image_from_client', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("خطا در ارسال عکس");
                    }
                    return response.json(); // اینجا محتوا رو به JSON تبدیل می‌کنیم
                })
                .then(data => {
                    append_message_in_pv ( data.id_client , data.id_file , data.id_message , data.id_pv );

                    $(this).html(save_html_butten);

                    //  پنجره انتخاب عکس بسنه شود

                    $modal.fadeOut(200);
                    $fileInput.val('');
                    $selectButton.html('<svg class="icon_send_message" width="161" height="162" viewBox="0 0 161 162" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                        '<path d="M95.6001 24.7705H151.208C153.899 24.7705 156.314 25.873 158.059 27.6316C159.818 29.3903 160.92 31.8315 160.92 34.4826V151.762C160.92 154.453 159.818 156.868 158.059 158.613C156.3 160.372 153.859 161.474 151.208 161.474H33.1149C30.4243 161.474 28.0095 160.372 26.2639 158.613C24.5052 156.854 23.4028 154.413 23.4028 151.762V93.9886C26.6445 95.301 30.0306 96.3247 33.5348 96.9941V123.61H33.5742C50.4916 107.428 61.6998 99.4352 78.5253 85.7727C78.5909 85.8383 78.6565 85.904 78.7221 85.9696C78.7615 86.009 78.7615 86.0483 78.8009 86.0483L114.001 127.692L119.382 94.5661C119.749 92.4399 121.744 90.9831 123.87 91.3506C124.684 91.4687 125.419 91.8756 125.996 92.4137L150.696 118.361V36.8319C150.696 36.3069 150.486 35.8475 150.119 35.5325C149.791 35.2044 149.305 34.9551 148.82 34.9551H98.1725C97.6344 31.4377 96.7682 28.0385 95.6001 24.7705ZM44.0212 0.20166C67.7895 0.20166 87.0561 19.4683 87.0561 43.2366C87.0561 67.0048 67.7895 86.2715 44.0212 86.2715C20.2529 86.2715 0.986328 67.0048 0.986328 43.2366C0.986328 19.4683 20.2529 0.20166 44.0212 0.20166ZM21.1585 43.9978H35.6479V64.6818H51.9877V43.9978H66.8971L44.0343 21.7782L21.1585 43.9978ZM124.71 47.0033C128.582 47.0033 132.138 48.5913 134.658 51.1243C137.231 53.6967 138.779 57.2009 138.779 61.0857C138.779 64.9574 137.191 68.5141 134.658 71.034C132.086 73.6064 128.582 75.1551 124.71 75.1551C120.838 75.1551 117.282 73.567 114.749 71.034C112.176 68.4616 110.628 64.9574 110.628 61.0857C110.628 57.214 112.216 53.6705 114.749 51.1243C117.334 48.5519 120.838 47.0033 124.71 47.0033Z" fill="white"/>\n' +
                        '</svg>');


                    dont_send_image = true;

                })
                .catch(() => {
                    $(this).html(save_html_butten);
                    alert('خطا در ارسال عکس  مجدد تلاش کنید');
                    dont_send_image = true;
                });

        }

    });

    // -------------------------------------------------------
    // ثبت پیام در pv
    
    function append_message_in_pv ( id_client , id_file , id_message , id_pv ) {

        let array_user_pv = JSON.parse(sessionStorage.getItem('array_user_pv'));


        array_user_pv.forEach(function ( item , key ) {
            if ( id_pv == item.id ) {

                item.messages.push({
                    message_id: id_message,
                    text: id_file+"__space_between__",
                    timestamp: Math.floor(Date.now() / 1000),
                    new_or_old: false,
                    role: "Fixer",
                    type_message: "image"
                });
            }
        })


        sessionStorage.setItem('array_user_pv', JSON.stringify(array_user_pv))


        // عکس را append کن

        let message_box = `<div class="container_image_message_sent"> <div class="container_image_message fixer">
        <img src="https://n8n.nirweb.ir/webhook/6e703d1e-72a8-4c12-a3ad-85db9eef8e61/?id_image_=${id_file}" >
        <p>  </p>
        </div></div>`;
        $(".messages-container").append(message_box);

        // اسکرول شود پایین ترین قسمت

        $(".messages-container").animate({
            scrollTop: $(".messages-container")[0].scrollHeight
        }, 600); // 600 = مدت زمان اسکرول به میلی‌ثانیه

    }


})

