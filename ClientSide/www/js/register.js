var socket = io.connect('http://leadthewayofficial.com:5000');

$(document).ready(function () {
    var $textbox2 = $('#textbox2');
    var $select = $('#select');
    var $textname = $('#textname');
    var $phoneNum = $('#phoneNum');

    socket.on('userRegistered', function (userId) {
        window.localStorage.setItem('userID', userId);
        window.localStorage.setItem('registered', true);
        return window.location.href = '../html/menu.html';
    });

    $textbox2.on('touchstart', function (event, ui) {
        var c = $select.val(),
            u = $textname.val(),
            n = $phoneNum.val();
        if (c !== '' && u !== '' && n !== '') {
            return socket.emit('registerUser', {
                country: c,
                name: u,
                number: n
            });
        }
        event.preventDefault();
    });
});