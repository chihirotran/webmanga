document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        window.onscroll = setFixedNav1;
    }
}
const setFixedNav1 = () => {
    var navdom = document.getElementsByClassName("chapter-nav")[0]
    if (window.scrollY > 300) {
        navdom.setAttribute("class", "chapter-nav scroll-to-fixed-fixed")
        navdom.setAttribute("style", "z-index: 1000; position: fixed; top: 0px; margin-left: 0px; width: 700px; left: 134px;");
    } else {
        navdom.setAttribute("class", "chapter-nav")
        navdom.setAttribute("style","z-index: auto; position: static; top: auto;background-color: #e4e4e4;padding: 3px 0;width: 100%!important;left: 0!important;")
    }
}

var selectElement = document.getElementById("ctl00_mainContent_ddlSelectChapter");

    // Gắn kết hàm xử lý sự kiện onchange
    selectElement.onchange = function() {
        var selectedValue = selectElement.value;
        window.location.href = selectedValue;
    };


document.addEventListener("DOMContentLoaded", function() {
        var threshold = window.innerHeight / 3;
        var scrollTimeout;

        window.addEventListener("scroll", function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                var url = window.location.href;
                var message = url.substring(url.lastIndexOf(":") + 1);
                var newUrl = "/history:" + message;

                fetch(newUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        isLoggedIn: true,
                        user: 'your_username',
                        id: message
                    })
                }).then(response => {
                    // Xử lý phản hồi từ máy chủ nếu cần
                    alert(response);
                }).catch(error => {
                    // Xử lý lỗi nếu có
                    console.error(error);
                });
            }, 10000);
        });
    }); 