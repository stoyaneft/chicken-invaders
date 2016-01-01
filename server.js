var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');
var Game = require('./Game').Game

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
	Game.start;
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
};

function onNewPlayer(data) {

};

function onMovePlayer(data) {

};

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
init();
