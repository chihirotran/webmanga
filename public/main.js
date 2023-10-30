var currentSlidePos = 0;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        setSlide();
        window.onscroll = setFixedNav;
    }
}



const goToPreviousSlide = () => {
    if (currentSlidePos < 208) return;
    console.log("clicked prev")
    currentSlidePos -= 208
    setSlidePos(currentSlidePos)
}


const goToNextSlide = () => {
    if (currentSlidePos > 1040) return;
    console.log("clicked prev")
    currentSlidePos += 208
    setSlidePos(currentSlidePos)
}


const setSlide = () => {
    setInterval(() => {
        if (currentSlidePos > 1040) {
            currentSlidePos = 0
        }
        currentSlidePos += 208
        setSlidePos(currentSlidePos)
    }, 2000)
}

const setSlidePos = (pos) => {
    var wrapper = document.getElementsByClassName("owl-wrapper")[0];
    wrapper.setAttribute("style", "width: 4872px;left: 0px;display: block;transition: all 800ms ease 0s;transform: translate3d(-" + pos + "px, 0px, 0px);")
}

const setFixedNav = () => {
    var navdom = document.getElementsByClassName("main-nav")[0]
    if (window.scrollY > 56) {
        navdom.setAttribute("style", "position: fixed; z-index: 1000; top: 0px; margin-left: 0px; width: 100%; left: 0px;");
    } else {
        navdom.setAttribute("style", "")
    }
}