$(document).ready(function () {
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.pagination',
        paginationClickable: false
    })

    $("#finish").click(function () {
        window.localStorage.setItem('intro', true);
        window.location.href = "register.html";
    });
});