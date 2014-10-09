var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var async = require('async');
var mail = require('nodemailer').mail;

// CREATE MYSQL CONNECTION
var db = mysql.createConnection({
	host : "127.0.0.1",
	user : "root",
	password : "vm2304989@!",
	database : "Shoutfit",
	multipleStatements : true
});

// CONNECTS TO MYSQL DATABASE
db.connect( function( err ) {
	if( err ) console.log( 'Error in connection: ' + err );
	else console.log( 'MySQL Connected!' );
});

// RETURNS index.html
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

// REGISTER USER QUERIES
function do_queriesRegisterUser( data, callback ) {
	var sql_reg = 'INSERT IGNORE INTO users SET ?';

	db.query( sql_reg, [ data ], function( err, res ) {
		if( err ) return callback( err );
		if( res.affectedRows > 0 ) return callback( null, res.insertId );
	});
}

// ADD FRIEND QUERIES
function do_queriesAddFriend( data, callback ) {
	var sql_addFr = 'INSERT IGNORE INTO friends SET ?';

	db.query( sql_addFr, [ data ], function( err, res ) {
		if( err ) return callback( err );
		if( res.affectedRows > 0 ) return callback( null );  
	});
}

// GET USER FRIENDS QUERIES
function do_queriesGetFriends( data, callback ) {
	var sql_fr = 'SELECT user_friend_id FROM friends WHERE user_id = ?';
	var sql_frInf = 'SELECT * FROM users WHERE user_id = ?';
	var friends = [];

	db.query( sql_fr, [ data ], function( err, friendRows ) {
		if( err ) return callback( err );

		async.forEachSeries( friendRows, function( row, callback_1 ) {
			var friend_id = row.user_friend_id;

			db.query( sql_frInf, [ friend_id ], function( err_2, res ) {
				if( err_2 ) return callback( err_2 );

				if( res.length > 0 ) friends.push( { user_id : res[0].user_id, name : res[0].name } );

				return callback_1();
			});

		}, function( err_1 ) {
			if( err_1 ) return callback( err_1 );
			return callback( null, friends );
		});
	});
}

// GET USERS QUERIES
function do_queriesGetUsers( data, callback ) {
	var sql_usrs = 'SELECT * FROM users WHERE user_id NOT IN ( SELECT user_friend_id FROM friends WHERE user_id = ? );'

	db.query( sql_usrs, [ data ], function( err, rows ) {
		if( err ) return callback( err );
		return callback( null, rows );
	});
}

// NEW OUTFIT QUERIES
function do_queriesNewOutfit( data, callback ) {
	var sql_outf = 'INSERT IGNORE INTO collections SET ?';
	var cps = data.photos.split( ',' ).length + 1;

	if( data.share === 0 ) {
		do_queriesRemoveCoins( { user_id: data.user_id, coins: cps }, function( err, res ) {
			if( err ) return callback( err );
			db.query( sql_outf, [ data ], function( err, res ) {
				if( err ) return callback( err );
				if( res.affectedRows > 0 ) return callback( null, res.insertId );
			});
		});
	} else {
		db.query( sql_outf, [ data ], function( err, res ) {
			if( err ) return callback( err );
			if( res.affectedRows > 0 ) return callback( null, res.insertId );
		});
	}
}

// GET PHOTO URL
function getPhotoUrl( data, callback ) {
	var sql_ph = 'SELECT * FROM photos WHERE photo_id = ?';

	db.query( sql_ph, [ data ], function( errP, resP ) {
		if( errP ) return callback( errP );
		if( resP.length > 0 ) return callback( null, resP[0].photo_url );
	});
}

// GET COLLECTION QUERIES
function do_queriesGetCollection( data, callback ) {
	var sql_coll = 'SELECT * FROM collections WHERE ( user_id != ? AND share = 0 ) OR ( share = 1 AND user_id = ( SELECT user_friend_id FROM friends WHERE user_id = ? LIMIT 1) )';

	db.query( sql_coll, [ data, data ], function( err, rows ) {
		if( err ) return callback( err );
		if( rows.length === 0 ) return callback( 'No collections' );

		var index = getRandomInt( 0, rows.length );

		var p = rows[index].photos.split(',');
		var t = rows[index].theme;
		var s = rows[index].share;
		var u = rows[index].user_id;
		var c = rows[index].collection_id;
		var ps = [];

		async.forEachSeries( p, function( photo, callback_1 ) {

			getPhotoUrl( parseInt( photo ), function( errPU, resPU ) {
				if( errPU ) return callback( errPU );

				ps.push( resPU );

				callback_1();
			});
		}, function( err_1 ) {
			if( err_1 ) return callback( err_1 );
			return callback( null, { collection_id: c, user_id: u, theme: t, share: s, photos: ps } );
		});
	});
}

// GET COINS QUERIES
function do_queriesGetCoins( data, callback ) {
	var sqlcs = 'SELECT coins FROM users WHERE user_id = ?';

	db.query( sqlcs, [ data ], function( err, r ) {
		if( err ) return callback( err );
		if( r.length > 0 ) return callback( null, r[0].coins );
	});
}

// REMOVE COINS QUERIES
function do_queriesRemoveCoins( data, callback ) {
	var sqlics = 'UPDATE users SET coins = ? WHERE user_id = ?';

	do_queriesGetCoins( data.user_id, function( err, res ) {
		if( err ) return callback( err );
		if( res >= data.coins ) var c = parseInt( res - data.coins );
		else return callback( 'Not enough coins' )

		db.query( sqlics, [ c, data.user_id ], function( e, r ) {
			if( e ) return callback( e );
			return callback( null, r );
		});
	});
}

// INSERT COINS QUERIES
function do_queriesInsertCoins( data, callback ) {
	var sqlics = 'UPDATE users SET coins = ? WHERE user_id = ?';

	do_queriesGetCoins( data.user_id, function( err, res ) {
		if( err ) return callback( err );
		var c = data.coins + res;
		db.query( sqlics, [ c, data.user_id ], function( e, r ) {
			if( e ) return callback( e );
			return callback( null, r );
		});
	});
}

// SUBMIT VOTE QUERIES
function do_queriesSubmitVote( u, data, callback ) {
	var sqlvins = 'INSERT IGNORE INTO votes SET ?';

	do_queriesInsertCoins( { user_id: u, coins: 1 }, function( err, re ) {
		if( err ) return callback( err );
	});
	db.query( sqlvins, [ data ], function( err, res ) {
		if( err ) return callback( err );
		if( res.affectedRows > 0 ) return callback( null );
	});
}

// GET NUMBER OF VOTES QUERIES
function do_queriesGetVotes( data, callback ) {
	var sqlvts = 'SELECT url, COUNT(url) AS v FROM votes WHERE user_id = ? AND collection_id = ? GROUP BY url ORDER BY COUNT(url) DESC LIMIT 1;';

	db.query( sqlvts, [ data.user_id, data.collection_id ], function( err, res ) {
		if( err ) return callback( err );
		if( res.length > 0 ) return callback( null, { numVotes: res[0].v, url: res[0].url } );
	});
}

// GET RANDOM PHOTO
function do_queriesGetRandomPhoto( data, callback ) {
	var sqlrp = 'SELECT photos FROM collections WHERE collection_id = ?';

	db.query( sqlrp, [ data ], function( err, res ) {
		if( err ) return callback( err );
		if( res.length > 0 ) {
			var ars = res[0].photos.split( ',' );
			var i = getRandomInt( 0, ars.length );

			getPhotoUrl( parseInt( ars[ i ] ), function( errPU, resPU ) {
				if( errPU ) return callback( errPU );
				return callback( null, resPU );
			});
		}
	});
}

// DELETE PHOTOS FROM COLLECTION
function do_queriesDeletePhoto( data, callback ) {
	var sqldp = 'DELETE FROM collections WHERE collection_id = ?';
	var sqldv = 'DELETE FROM votes WHERE collection_id = ?';

	db.query( sqldp, [ data ], function( e, r ) {});
	db.query( sqldv, [ data ], function( e, r ) {});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// SOCKETS CONNECTED
io.sockets.on( 'connection', function( socket ) {

	// REGISTER USER
	socket.on( 'registerUser', function( data ) {
		do_queriesRegisterUser( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'userRegistered', res );
		});
	});

	// ADD FRIEND
	socket.on( 'addFriend', function( data ) {
		do_queriesAddFriend( data, function( err ) {
			if( err ) return console.log( err );
			return socket.emit( 'friendAdded' );
		});
	});

	// GET USER FRIENDS
	socket.on( 'getFriends', function( data ) {
		do_queriesGetFriends( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'friendsData', res );
		})
	});

	// GET USERS
	socket.on( 'getUsers', function( data ) {
		do_queriesGetUsers( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'usersData', res );
		});
	});

	// NEW OUTFIT
	socket.on( 'newOutfit', function( data ) {
		do_queriesNewOutfit( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'outfitSaved', res );
		});
	});

	// GET RANDOM COLLECTION
	socket.on( 'getCollection', function( data ) {
		do_queriesGetCollection( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'collectionData', res );
		});
	});

	// GET COINS FOR USER
	socket.on( 'getCoins', function( data ) {	
		do_queriesGetCoins( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'coinsData', res );
		});
	});

	// INSERT COINS
	socket.on( 'insertCoins', function( data ) {
		do_queriesInsertCoins( data, function( err ) {
			if( err ) return console.log( err );
		});
	});

	// SUBMIT VOTE
	socket.on( 'submitVote', function( u, data ) {
		do_queriesSubmitVote( u, data, function( err ) {
			if( err ) return console.log( err );
		});
	});

	// GET NUMBER OF VOTES
	socket.on( 'getNumOfVotes', function( data ) {
		do_queriesGetVotes( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'numberOfVotes', res );
		});
	});

	// GET RANDOM PHOTO
	socket.on( 'getRandomPhoto', function( data ) {
		do_queriesGetRandomPhoto( data, function( err, res ) {
			if( err ) return console.log( err );
			return socket.emit( 'randomPhoto', res );
		});
	});

	// DELETE PHOTO
	socket.on( 'deletePhoto', function( data ) {
		do_queriesDeletePhoto( data, function( err ) {
			if( err ) return console.log( err );
		});
	});
});

// LISTEN ON PORT 5000
http.listen( 5000, function() {
	console.log('Listening on *:5000');
});