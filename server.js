var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');
var Player = require('./Player').Player

var socket,
    players;

function init() {
    players = [];
	setEventHandlers();
};

function setEventHandlers() {
	io.on("connection", onSocketConnection);
}

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
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
    console.log(data);
    if (players.length < 2) {
        var newPlayer = new Player(data.x, data.y, this.id);
        console.log(newPlayer);

    	// Broadcast new player to connected socket clients
    	this.broadcast.emit("new player", {sid: newPlayer.sid, x: newPlayer.getX(), y: newPlayer.getY()});

    	// Send existing players to the new player
    	var i, existingPlayer;
    	for (i = 0; i < players.length; i++) {
    		existingPlayer = players[i];
            console.log(existingPlayer)
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
    var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {sid: movePlayer.sid, x: movePlayer.getX(), y: movePlayer.getY()});
};

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

server.listen(3000, function(){
  console.log('listening on *:3000');
});
init();
