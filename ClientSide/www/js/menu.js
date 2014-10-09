var socket = io.connect('http://leadthewayofficial.com:5000');

var pictureSource, destinationType;
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    navigator.splashscreen.hide();
}

function onPhotoDataSuccess(imageData) {
    setTimeout(function () {
        window.localStorage.setItem('imageData1', imageData);
        window.localStorage.setItem('numberOfImages', 1);
        window.location.href = '../html/imagesnap.html';
    }, 100);
}

function onFail(message) {
    //    alert('Failed because: ' + message);
}

$(function () {
    var u = window.localStorage.getItem('userID');
    var $takeApic = $('#takeApic');
    var $vote = $('#vote');
    var $friends = $('#friends');
    var numCoins = 0;
    var flag = false;
    socket.emit('getCoins', u);

    socket.on('coinsData', function (data) {
        numCoins = data;
        window.localStorage.setItem('numCoins', data);
        $("#noCoins").text(numCoins);
        if (flag) {
            if (numCoins > 2) {
                navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                    quality: 40,
                    destinationType: destinationType.FILE_URI,
                    correctOrientation: true
                });
                event.preventDefault();
            } else {
                alert("Not enough coins!\nVote your friends' photos to get coins.");
            }
        }
    });

    $takeApic.on('touchstart', function (event, ui) {
        flag = true;
        socket.emit('getCoins', u);
    });
    $vote.on('touchstart', function (event, ui) {
        event.preventDefault();
        return window.location.href = '../html/vote.html?' + u;
    });
    $friends.on('touchstart', function (event, ui) {
        event.preventDefault();
        return window.location.href = '../html/friends.html?' + u;
    });
});