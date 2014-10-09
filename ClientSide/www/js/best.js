var socket = io.connect('http://leadthewayofficial.com:5000');

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {}

$(document).ready(function () {



    $("#progressCountdown").progressbar();

    var u = window.localStorage.getItem('userID');
    var collectionID = window.localStorage.getItem('collectionID');

    var currentTime = parseInt(new Date().getTime() / 1000);
    var incrementValue = value;
    var endValue = window.localStorage.getItem('endValue');
    var value = endValue - currentTime;
    var numVotes = 0;
    var imageURL;
    var numVotes;

    countdown();

    function countdown() {

        socket.emit('getNumOfVotes', {
            user_id: u,
            collection_id: collectionID
        });
        socket.on('numberOfVotes', function (data) {
            imageURL = data.url;
            numVotes = data.numVotes;
        });

        if (currentTime >= endValue || numVotes >= 20 || value <= 0) {
            // Time's up!
            window.localStorage.setItem('bestWaiting', 'ne');
            $("#statusCountdown").text("The voting time is over!");
            $("#progressCountdown").remove();
            $("#numVotes").text(numVotes);
            $("#socialButtons").css('visibility', 'visible');
            $("#totalVotes").css("visibility", "visible");
            $("#numVotes").css("visibility", "visible");
            $("#finishBest").css("visibility", "visible");
            if (numVotes === 0) {
                socket.emit('getRandomPhoto', collectionID);
                socket.on('randomPhoto', function (data) {
                    imageURL = data;
                    $("#bestPicture").attr('src', imageURL);
                });
            } else {
                $("#bestPicture").attr('src', imageURL);
            }
        } else {
            // Keep running!
            value--;
            incrementValue++;
            var minutes = parseInt(value / 60);
            var seconds = parseInt(value - minutes * 60);

            $("#progressCountdown").progressbar("option", "value", value);
            $("#statusCountdown").text(minutes + ":" + seconds + " remaining");
            setTimeout(countdown, 1000);
        }
    }

    $("#logout").click(function () {
        window.location.href = "menu.html";
    });
    $("#finishBest").click(function () {
        window.localStorage.setItem('bestWaiting', false);
        socket.emit( 'deletePhoto', collectionID );
        window.location.href = 'menu.html';
    });
    $("#fbButton").click(function () {
        window.plugins.socialsharing.shareViaFacebook('#Shoutfit', null, imageURL, function() {
          console.log('share ok');
        }, function(errormsg){
          console.log(errormsg);
        });
    });
    $("#twitterButton").click(function () {
        window.plugins.socialsharing.shareViaTwitter('#Shoutfit BestOutfit: ' + imageURL);
    });
});