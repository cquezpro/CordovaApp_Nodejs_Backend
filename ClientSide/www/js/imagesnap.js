var pictureSource;
var destinationType;
var numImgs;
var numUploads;
var imgIds;
var imagesArray = [];
var serverURL = 'http://172.245.142.221:5001';
var maxImages;
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function capturePhoto() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        destinationType: destinationType.FILE_URI,
        correctOrientation: true
    });
    setTimeout(function () {
        spinnerplugin.show({
            'overlay': true
        });
        spinnerplugin.hide();
    }, 500);
}

function onSuccess(imageData) {
    setTimeout(function () {
        numImgs++;
        if (numImgs === 6 || numImgs === maxImages) {
            $("#addNew").css('visibility', 'hidden');
        }
        if (numImgs === 2) {
            $("#imageContainer").addClass("multiImgPadding");
            $("#buttonsContainer").append(" <button type='button' name='doneButton' id='doneButton' onclick='doneButtonClick()'>Done</button> ");
            $("#firstImg").removeClass("singleImage");
            $("#firstImg").addClass("multipleImages");
        }
        imagesArray[numImgs - 1] = imageData;
        $("#imageContainer").append(" <img class='multipleImages' src='" + imageData + "'/> ");
    }, 100);
}

function onFail(message) {
    // Photo didn't happen
}

function doneButtonClick() {
    // Upload the pictures
    numUploads = 0;
    imgIds = "";
    spinnerplugin.show({
        'overlay': true
    });

    for (var i = 0; i < imagesArray.length; ++i) {
        uploadFile(imagesArray[i]);
    }
}

function uploadFile(imageURI) {
    var ft = new FileTransfer(),
        options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = 'filename.jpg';
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.params = {
        'user_id': window.localStorage.getItem('userID')
    };

    ft.upload(imageURI, serverURL + "/images",
        function (e) {
            numUploads++;
            imgIds += e.response + ',';

            if (numUploads === imagesArray.length) {
                window.localStorage.setItem('imgIDs', imgIds.substr(0, imgIds.length - 1));
                spinnerplugin.hide();
                return window.location.href = 'theme.html';
            }
        },
        function (e) {
            console.log('Upload failed!');
        }, options);
}

$(document).ready(function () {
    maxImages = parseInt(window.localStorage.getItem('numCoins')) - 1;

    var clickedOnceNew = false;
    numImgs = parseInt(window.localStorage.getItem('numberOfImages'));
    $('#logout').on('touchstart', function (event, ui) {
        // Back to menu
        event.preventDefault();
        return window.location.href = '../html/menu.html';
    });
    $("#addNew").click(function () {
        event.preventDefault();
        capturePhoto();
    });

    if (numImgs === 1) {
        // Big-ass photo and only Add New button on screen
        var imageData1 = window.localStorage.getItem('imageData1');
        imagesArray[0] = imageData1;
        $("#imageContainer").append(" <img class='singleImage' id='firstImg' src='" + imageData1 + "'/> ");
    } else {
        // Multiple photos in a grid and Done button visible
        // but that's done in onPhotoDataSuccess, so we don't need this here xD
    }
});