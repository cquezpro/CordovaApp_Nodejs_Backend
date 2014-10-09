var socket = io.connect('http://leadthewayofficial.com:5000');

$(function () {
    window.localStorage.setItem('bestWaiting', 'moze');
    var imgIDs = window.localStorage.getItem('imgIDs');
    var t = window.localStorage.getItem('userTheme');
    var uId = window.localStorage.getItem('userID');

    socket.on('outfitSaved', function (data) {
        var endValue = parseInt(new Date().getTime() / 1000) + 120;
        window.localStorage.setItem('bestWaiting', 'moze');
        window.localStorage.setItem('endValue', endValue);
        window.localStorage.setItem('progressValue', 120);
        window.localStorage.setItem('collectionID', data);
        spinnerplugin.hide();
        return window.location.href = 'best.html';
    });

    $("#sharepublic").on('touchstart', function (event) {
        event.preventDefault();
        spinnerplugin.show();
        return socket.emit('newOutfit', {
            user_id: uId,
            photos: imgIDs,
            theme: t,
            share: 0
        });
    });

    $("#sharefriends").on('touchstart', function (event) {
        event.preventDefault();
        spinnerplugin.show();
        return socket.emit('newOutfit', {
            user_id: uId,
            photos: imgIDs,
            theme: t,
            share: 1
        });
    });

    $("#logout").on('touchstart', function (event) {
        event.preventDefault();
        return window.location.href = 'menu.html';
    });
});