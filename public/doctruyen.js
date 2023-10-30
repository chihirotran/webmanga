document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        window.onscroll = setFixedNav;
    }
}
const setFixedNav = () => {
    var navdom = document.getElementsByClassName("chapter-nav")[0]
    if (window.scrollY > 300) {
        navdom.setAttribute("class", "chapter-nav scroll-to-fixed-fixed")
        navdom.setAttribute("style", "z-index: 1000; position: fixed; top: 0px; margin-left: 0px; width: 700px; left: 134px;");
    } else {
        navdom.setAttribute("class", "chapter-nav")
        navdom.setAttribute("style","z-index: auto; position: static; top: auto;background-color: #e4e4e4;padding: 3px 0;width: 100%!important;left: 0!important;")
    }
}