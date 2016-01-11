Crafty.scene('Game', function() {
	var self = this;
	intitalizeChickens();
	setEventHandlers();
	this.localPlayer = Crafty.e('LocalPlayer').at(4, 6);
	// this.scoreboard = Crafty.e('Scoreboard');
	// this.lives_field = Crafty.e('Lives');
	// this.points_field = Crafty.e('Points');
	socket.emit("new player", {x: this.localPlayer.x, y: this.localPlayer.y});

	// var smoke = Crafty.e('Smoke').attr(coords);
	// setTimeout(function() {
	// 	smoke.destroy();
	// }, 200);

	function intitalizeChickens() {
		var tile_rows = Settings.WINDOW_HEIGHT / Settings.TILE_HEIGHT;
		var tile_cols = Settings.WINDOW_WIDTH / Settings.TILE_WIDTH;
		var chicken_cols = Settings.CHICKENS_COUNT / Settings.CHICKEN_ROWS;
		var padding = (tile_cols - chicken_cols) / 2;
		for (var i = 0; i < 4; i++)
			for(var j = 1; j <= chicken_cols; j++) {
				Crafty.e('Chicken').at(j, i + padding);
			}
	};

	function setEventHandlers() {
		self.bind('DeadChicken', function(coords) {
			console.log(Crafty('Chicken').length);
			if(!Crafty('Chicken').length) {
				// Crafty.scene('LevelCompleted');
				console.log('LevelCompleted')
			}
		});
		self.bind('GameOver', function() {
		   console.log('game over :(');
		});
		socket.on("disconnect", onSocketDisconnect);
		socket.on("new player", onNewPlayer);
		socket.on("move player", onMovePlayer);
		socket.on("dead chicken", onDeadChicken);
	}

	function onSocketConnected() {
		console.log("Connected to socket server");
		socket.emit("new player", {x: self.localPlayer.x, y: self.localPlayer.y});
	};

	function onSocketDisconnect() {
		console.log("Disconnected from server");
	};

	function onNewPlayer(data) {
		console.log(data);
		console.log("New player connected: "+data.sid);
		self.remotePlayer = Crafty.e('RemotePlayer').at(data.x, data.y);
	};

	function onMovePlayer(data) {
		self.remotePlayer.x = data.x;
		self.remotePlayer.y = data.y;
	};

	function onDeadChicken(data) {
		console.log('DeadChicken');
		Crafty(data.id).destroy();
	}


}, function() {
	this.unbind('DeadChicken', this.level_completed);
});

Crafty.scene('LevelCompleted', function() {
	Crafty.e('2D, DOM, Text')
		.text('Level Completed!')
})


Crafty.scene('Loading', function(){

  Crafty.e('2D, DOM, Text')
    .text('Loading...')
	.css($text_css);



  // Load our sprite map image
var sprite_map = Crafty.sprite("assets/sprite_map.png", {
	spr_chicken: [0, 0, 64, 64],
	spr_egg: [64, 0, 9, 11],
	spr_player: [76, 0, 55, 64],
	spr_lscoreboard: [0, 64, 160, 40],
	spr_smoke: [133, 0, 27, 27]
});

  var assetsObj = {
	  "sprites": {
		  "assets/sprite_map.png": sprite_map
	  }
  }
  setTimeout(function() {Crafty.load(assetsObj, function(){
	console.log('assets loaded');
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  })
  }, 0);
});
