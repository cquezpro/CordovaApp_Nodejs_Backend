var socket = io.connect('http://leadthewayofficial.com:5000');

$(function () {
    var u = window.localStorage.getItem('userID');

    socket.emit('getFriends', u);

    socket.on('friendsData', function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#profiles").append("<div class='profileTemplate' id='user'" + data[i].user_id + "><img src='../images/friend.png' class='profileImage' /><span class='profileName'>" + data[i].name + "</span></div>");
        }
    });

    $('#logout').on('touchstart', function (event, ui) {
        // Back to menu
        event.preventDefault();
        return window.location.href = '../html/menu.html?' + u;
    });
    $('#addFriends').on('touchstart', function (event, ui) {
        // Add new friend
        event.preventDefault();
        return window.location.href = '../html/search.html';
    });
});