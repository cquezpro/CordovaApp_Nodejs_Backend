var cL = [], cLD = [], $contactsPlace, socket = io.connect( 'http://leadthewayofficial.com:5000' );
document.addEventListener( 'deviceready', onDeviceReady, false );

function onDeviceReady() {
    var options = new ContactFindOptions();
    var filter = ["displayName", "phoneNumbers"];

    options.multiple = true;
    options.filter = "";
    
    navigator.contacts.find( filter, onSuccess, onError, options );
}

function onSuccess(contacts) {

    for (var i = 0; i < contacts.length; i++)
        if (contacts[i].phoneNumbers)
            cL.push( { name: contacts[i].displayName, number: contacts[i].phoneNumbers[0].value } );

    socket.emit( 'getUsers', window.localStorage.getItem( 'userID' ) );
};

function onError(contactError) {
    console.log('onError!');
};

function nameKeyUp( elem ) {
    $contactsPlace.empty();

    for( var i = 0; i < cLD.length; ++i ) {
        if( cLD[i].name.indexOf( elem.value ) > -1 ) {
            var u = cLD[i].user_id;
            $contactsPlace.append("<div class='contactCard' onclick='addFriend(this, " + u + ")'><div class='contactName'>" + cLD[i].name + "</div><div class='contactNumber'>" + cLD[i].number + "</div></div>");
        }
    }
};

function addFriend( elem, fID ) {
    var uID = window.localStorage.getItem( 'userID' );
    $( elem ).hide();
    socket.emit( 'addFriend', { user_id: uID, user_friend_id: fID } );
}

$(function () {
    var u = parseInt( window.location.search.substring(1) );
    $contactsPlace = $('#contactsPlace');

    socket.on( 'usersData', function( data ) {

        $contactsPlace.empty();

        console.log( data.length );

        for( var i = 0; i < data.length; ++i ) {
            var n = data[i].name;
            var nu = data[i].number;
            var uId = data[i].user_id;

            console.log( nu );

            for( var j = 0; j < cL.length; ++j ) {
                if( cL[j].number.indexOf( nu ) > -1 || nu.indexOf( cL[j].number ) > -1 ) {
                    cLD.push( { name: cL[j].name, number: cL[j].number, user_id: uId } );
                    $contactsPlace.append("<div class='contactCard' onclick='addFriend(this, " + uId + ")'><div class='contactName'>" + cL[j].name + "</div><div class='contactNumber'>" + cL[j].number + "</div></div>");
                }
            }
        }
    });

    socket.on( 'friendAdded', function(  ) {
        // REMOVE FROM LIST
    });

    $("#logout").on( 'touchstart', function ( event, ui ) {
        event.preventDefault();
        return window.location.href = "../html/friends.html";
    });
});