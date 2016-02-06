Crafty.scene('Game', function(mode) {
	Crafty.background("url('assets/background.png')");
	this.localPlayer = Crafty.e('LocalPlayer').attr({x:200, y:400, w:64, h:64});;
	if(mode === Settings.MULTIPLAYER) {
		socket.emit('new player', {x: this.localPlayer.x, y: this.localPlayer.y});
		Crafty.pause();
		this.waitingText = Crafty.e('2D, DOM, Text')
		.text('Waiting for other player...')
		.textFont({size: '20px'})
		.textColor('white')
		.attr({x: Settings.WINDOW_WIDTH/2 - 100, y:20, w:640});
	} else {
		socket.emit('all connected');
	}

	var self = this;
	intitalizeChickens();
	setEventHandlers();
	console.log(mode);

	function intitalizeChickens() {
		var tile_rows = Settings.WINDOW_HEIGHT / Settings.TILE_HEIGHT;
		var tile_cols = Settings.WINDOW_WIDTH / Settings.TILE_WIDTH;
		var chicken_cols = Settings.CHICKENS_COUNT / Settings.CHICKEN_ROWS;
		var padding = (tile_cols - chicken_cols) / 2;
		for (var i = 1; i <= Settings.CHICKEN_ROWS; i++)
			for(var j = 1; j <= chicken_cols; j++) {
				Crafty.e('Chicken').at(j, i + padding-1).setSId(i*j - 1);
			}
	};

	function setEventHandlers() {
		self.bind('DeadChicken', function(coords) {
			console.log(Crafty('Chicken').length);
			if (!Crafty('Chicken').length) {
				// Crafty.scene('LevelCompleted');
				console.log('LevelCompleted')
			}
		});
		self.bind('game_over', function() {
		   console.log('game over :(');
		});
		socket.on('disconnect', onSocketDisconnect);
		socket.on('new player', onNewPlayer);
		socket.on('move player', onMovePlayer);
		socket.on('dead chicken', onDeadChicken);
		socket.on('player shot', onPlayerShot);
		socket.on('lay egg', onLayEgg);
	}

	function onSocketDisconnect() {
		console.log('Disconnected from server');
	};

	function onNewPlayer(data) {
		console.log('New player connected: '+data.sid);
		console.log(data);
		self.remotePlayer = Crafty.e('RemotePlayer').attr({x:data.x, y: data.y});
		Crafty.pause();
		self.waitingText.destroy();
		socket.emit('all connected');
	};

	function onMovePlayer(data) {
		self.remotePlayer.x = data.x;
		self.remotePlayer.y = data.y;
	};

	function onDeadChicken(data) {
		console.log('DeadChicken');
		Crafty(data.id).destroy();
	};

	function onPlayerShot(data) {
		console.log('Player shot: ' + data.id)
		self.remotePlayer.shoot(self.remotePlayer.getId())
	};

	function onLayEgg(data) {
		console.log('Layed Egg: ', data);
		Crafty('Chicken').each(function(i){
			if (i == data) {
				this.layEgg();
			}
		})

	}

}, function() {
	this.unbind('DeadChicken', this.level_completed);
});

Crafty.scene('LevelCompleted', function() {
	Crafty.e('2D, DOM, Text')
		.text('Level Completed!')
})

Crafty.scene('Menu', function() {
	Crafty.background('black');
	Crafty.e('Button').attr({x:200, y:200, w:200, h:40}).text(Settings.SINGLE_PLAYER);
	Crafty.e('Button').attr({x:200, y:240, w:200, h:40}).text(Settings.MULTIPLAYER);
})

Crafty.scene('Loading', function(){
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
	.css($text_css);
  // Load our sprite map image
	var sprite_map = Crafty.sprite('assets/sprite_map.png', {
		spr_chicken: [0, 0, 64, 64],
		spr_egg: [64, 0, 9, 11],
		spr_player: [76, 0, 55, 64],
		spr_lscoreboard: [0, 64, 160, 40],
		spr_rscoreboard: [0, 104, 160, 40],
		spr_smoke: [133, 0, 27, 27]
	});

	var assetsObj = {
	  'sprites': {
		  'assets/sprite_map.png': sprite_map
	  }
	}
	setTimeout(function() {Crafty.load(assetsObj, function(){
		console.log('assets loaded');
	// Now that our sprites are ready to draw, start the game
		Crafty.scene('Menu');
	})
	}, 0);
});
