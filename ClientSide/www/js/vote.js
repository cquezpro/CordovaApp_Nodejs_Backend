var socket = io.connect('http://leadthewayofficial.com:5000');

$(function () {
    var u = window.localStorage.getItem('userID');
    var picId = 3;
    var maxDist = 200;
    var numberCoins = 13; //Get the coins from the local storage
    var photoCollection = [];
    var alreadyVoted;
    if (window.localStorage.getItem('alreadyVoted'))
        alreadyVoted = window.localStorage.getItem('alreadyVoted').split(",");
    else
        alreadyVoted = [];

    var position;
    var choice, pos;
    var userID, pictureURL, collectionID;

    socket.emit('getCollection', u);

    socket.on('collectionData', function (data) {
        if (alreadyVoted.indexOf(data.collection_id) > -1) {
            socket.emit('getCollection', u);
            console.log(alreadyVoted.indexOf(data.collection_id));
        } else {
            userID = data.user_id;
            collectionID = data.collection_id;
            alreadyVoted.push(collectionID);
            window.localStorage.setItem('alreadyVoted', alreadyVoted);
            $("#nameTheme").text(data.theme);
            for (var i = 0; i < data.photos.length; ++i) {
                photoCollection[i] = data.photos[i];
            }
            $("#pic3").attr('src', photoCollection[0]);
            position = 0;
            $("#left").css('visibility', 'hidden');
            $("#right").css('visibility', 'visible');
        }
    });

    socket.on('coinsData', function (data) {
        $("#noCoins").text(data);
    });

    var numCoins = window.localStorage.getItem('numCoins');

    $("#noCoins").text(numCoins);


    // 1 - discard
    // 2 - left
    // 3 - right
    function newPhoto(choice, pos) {
        if (choice === 1) {
            // Discard the photo
            for (var i = pos; i < photoCollection.length - 1; i++) {
                photoCollection[i] = photoCollection[i + 1];
            }
            photoCollection.length--;
            if (pos > 0) {
                pos--;
                $("#pic3").attr('src', photoCollection[pos]);
                $("#pic3").css('top', '0');
                $("#pic3").css('opacity', '1');
            } else {
                $("#pic3").attr('src', photoCollection[pos]);
                if (pos === 1) {
                    $("#left").css('visibility', 'hidden');
                } else if (pos === (photoCollection.length + 1)) {
                    $("#right").css('visibility', 'hidden');
                }
                $("#pic3").css('top', '0');
                $("#pic3").css('opacity', '1');
            }
            position = pos;
            checkFinal();
        } else if (choice === 2) {
            // Go left
            pos--;
            $("#pic3").attr('src', photoCollection[pos]);
            if (pos < photoCollection.length - 1)
                $("#right").css('visibility', 'visible');
            else $("#right").css('visibility', 'hidden');
            if (pos === 0)
                $("#left").css('visibility', 'hidden');
            else $("#left").css('visibility', 'visible');
            position = pos;
            checkFinal();
        } else if (choice === 3) {
            // Go right
            pos++;
            $("#pic3").attr('src', photoCollection[pos]);
            if (pos < photoCollection.length - 1)
                $("#right").css('visibility', 'visible');
            else $("#right").css('visibility', 'hidden');
            if (pos === 0)
                $("#left").css('visibility', 'hidden');
            else $("#left").css('visibility', 'visible');
            position = pos;
            checkFinal();
        }
    }

    function checkFinal() {
        if (photoCollection.length === 1) {
            setTimeout(function () {
                //Upload the vote of the chosen selfie
                pictureURL = $("#pic3").attr('src');
                console.log(pictureURL);
                socket.emit('submitVote', u, {
                    user_id: userID,
                    url: pictureURL,
                    collection_id: collectionID
                });
                socket.emit('getCoins', u);
                //Load new collection
                socket.emit('getCollection', u);
            }, 500);
        }
    }

    $('#pic' + picId).swipe({
        swipeStatus: function (event, phase, direction, distance) {
            // DISCARD IMAGE
            if (direction === 'up' && phase === 'move' && photoCollection.length > 1) {
                $(this).css('top', '-' + distance + 'px');
                $(this).css('opacity', (maxDist - distance) / maxDist);
            }

            if (event.type === 'touchend' && photoCollection.length > 1) {
                if (distance >= 200 && direction === 'up') {
                    //Discard the current photo and get another photo here
                    newPhoto(1, position);
                } else {
                    $(this).css('top', '0');
                    $(this).css('opacity', '1');
                }
            }
        },
        triggerOnTouchLeave: true,
        triggerOnTouchEnd: true
    });


    $("#logout").click(function () {
        // Close the application
        window.location.href = "../html/menu.html?" + u;
    });
    $("#left").click(function () {
        if (position > 0) {
            // Get the theme and photo
            newPhoto(2, position);
        }
    });
    $("#right").click(function () {
        if (position < photoCollection.length - 1) {
            // Get the theme and photo
            newPhoto(3, position);
        }
    });
    $("#submitVote").click(function () {
        //Reward one coin for the user and reload the vote page
        window.location.href = "vote.html";
    });
});