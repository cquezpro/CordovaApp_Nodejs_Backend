var fs = require('fs'),
    mysql = require('mysql'),
    MongoClient = require('mongodb').MongoClient,
    db;

// CREATE MYSQL CONNECTION
var dbMysql = mysql.createConnection({
    host : "127.0.0.1",
    user : "root",
    password : "vm2304989@!",
    database : "Shoutfit",
    multipleStatements : true
});

// CONNECTS TO MYSQL DATABASE
dbMysql.connect( function( err ) {
    if( err ) console.log("Error in connection: " + err);
    else console.log("MySQL Connected!");
});

// Create the "uploads" folder if it doesn't exist
fs.exists(__dirname + '/uploads', function (exists) {
    if (!exists) {
        console.log('Creating directory ' + __dirname + '/uploads');
        fs.mkdir(__dirname + '/uploads', function (err) {
            if (err) {
                console.log('Error creating ' + __dirname + '/uploads');
                process.exit(1);
            }
        })
    }
});

// Connect to database
var url = "mongodb://127.0.0.1:27017/PictureFeed";
MongoClient.connect(url, {native_parser: true}, function (err, connection) {
    if (err) {
        console.log("Cannot connect to database " + url);
        process.exit(1);
    }
    db = connection;
});

exports.getImages = function(req, res, next) {
    var images = db.collection('images');

    images.find().sort({ _id: -1 }).limit(20).toArray(function (err, data) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(data);
    });
};

exports.addImage = function(req, res, next) {

    console.log("upload");

    var file = req.files.file,
        filePath = file.path,
        lastIndex = filePath.lastIndexOf("/"),
        tmpFileName = filePath.substr(lastIndex + 1),
        image = req.body,
        images = db.collection('images');

    image.fileName = tmpFileName;
    console.log(tmpFileName);

    images.insert(image, function (err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        do_queriesPhoto( image, function( err, resp ) {
            if( err ) return console.log( err );
            return res.end( "" + resp );
        });
    });

};

function do_queriesPhoto( data, callback ) {
    var sql = 'INSERT IGNORE INTO photos ( photo_url ) VALUES( ' + dbMysql.escape( 'http://leadthewayofficial.com/PictureUpload/uploads/' + data.fileName ) + ')';

    dbMysql.query(sql, function( err, res ) {
        if( err ) return callback(err);
        if( res.affectedRows > 0 ) return callback( null, res.insertId );
    });

}