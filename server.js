var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');
var Player = require('./Player').Player;
var Chicken = require('./chicken').Chicken;

var players;

function init() {
    players = [];
    chickens = Array.apply(null, Array(32)).map(function (_) {return new Chicken();});
	setEventHandlers();
};

function setEventHandlers() {
	io.on("connection", onSocketConnection);

};

function layEggs() {
    setInterval(function() {
        chickens.forEach(function(chicken, idx) {
            if (chicken.isAlive() && chicken.layedEgg()) {
                io.sockets.emit('lay egg', idx);
            }
        });
    }, 200)
}

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
    client.on('dead chicken', onDeadChicken);
    client.on('player shot', onPlayerShot);
    // if (players.length === 1) {
    //     this.emit('all connected');
    //     this.broadcast.emit('all connected');
    // }

};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
    util.log('New player in server')
    if (players.length < 2) {
        var newPlayer = new Player(data.x, data.y, this.id);

    	// Broadcast new player to connected socket clients
    	this.broadcast.emit("new player", {sid: newPlayer.sid, x: newPlayer.getX(), y: newPlayer.getY()});

    	// Send existing players to the new player
    	var i, existingPlayer;
    	for (i = 0; i < players.length; i++) {
    		existingPlayer = players[i];
    		this.emit("new player", {sid: existingPlayer.sid, x: existingPlayer.getX(), y: existingPlayer.getY()});
    	};

    	// Add new player to the players array
    	players.push(newPlayer);
    }
	else {
	    console.log('Players full!');
	}
};

function onMovePlayer(data) {
    if (players.length === 2) {
        var movePlayer = playerById(this.id);

    	// Player not found
    	if (!movePlayer) {
    		util.log("Player not found: "+this.id);
            console.log(players);
    		return;
    	};

    	// Update player position
    	movePlayer.setX(data.x);
    	movePlayer.setY(data.y);

    	// Broadcast updated position to connected socket clients
    	this.broadcast.emit("move player", {sid: movePlayer.sid, x: movePlayer.getX(), y: movePlayer.getY()});
    }

};

function onDeadChicken(data) {
    console.log('Dead Chicken in server');
    chickens[data.sid].destroy();
    this.broadcast.emit("dead chicken", {id: data.id});
}

function onPlayerShot(data) {
    console.log('Player shot: ' + data.id)
    this.broadcast.emit('player shot', data);
}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].sid == id)
            return players[i];
    };

    return false;
};

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

// server.listen(3000, function(){
//   console.log('listening on *:3000');
// });
init();
layEggs();
