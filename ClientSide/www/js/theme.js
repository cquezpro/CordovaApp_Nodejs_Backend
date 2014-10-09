$(function () {
    
    $("#finish").on( 'touchstart', function ( event ) {
        var t = document.getElementById('themeInput').value;
        event.preventDefault();

        if( t !== '' ) {
            window.localStorage.setItem("userTheme", t);
            return window.location.href = "../html/share.html";
        }
    });

    $("#logout").on( 'touchstart', function ( event ) {
        event.preventDefault();
        return window.location.href = "../html/menu.html";
    });
});