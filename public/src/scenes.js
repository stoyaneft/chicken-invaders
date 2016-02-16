Crafty.scene('Game', function(game) {
	var self = this;
	var level = 1;
	setEventHandlers();
	console.log(game.mode);
	console.log(game);
	Crafty.background("url('assets/background.png')");
	this.localPlayer = Crafty.e('LocalPlayer').attr({x:200, y:400, w:64, h:64});
	this.localPlayer.setPoints(game.stats.points.local);

	var level = game.levels[game.current];
	if(game.mode === Settings.MULTIPLAYER) {
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

	intitalizeChickens();

	function intitalizeChickens() {
		var tile_rows = Settings.WINDOW_HEIGHT / Settings.TILE_HEIGHT;
		var tile_cols = Settings.WINDOW_WIDTH / Settings.TILE_WIDTH;
		var chicken_cols = Settings.CHICKENS_COUNT / Settings.CHICKEN_ROWS;
		var padding = (tile_cols - chicken_cols) / 2;
		for (var i = 1; i <=level.rows; i++)
			for(var j = 1; j <= level.cols; j++) {
				Crafty.e('Chicken').at(j, i + padding-1).setSId(i*j - 1);
			}
	};

	function setEventHandlers() {
		self.bind('DeadChicken', onDeadChicken);
		self.bind('level completed', onLevelCompleted);
		socket.on('disconnect', onSocketDisconnect);
		socket.on('new player', onNewPlayer);
		socket.on('move player', onMovePlayer);
		socket.on('dead chicken', onDeadChicken);
		socket.on('player shot', onPlayerShot);
		socket.on('lay egg', onLayEgg);
		socket.on('game over', onGameOver);
		//socket.on('level completed', onLevelCompleted);
	}

	function onSocketDisconnect() {
		console.log('Disconnected from server');
	};

	function onNewPlayer(data) {
		console.log('New player connected: '+data.sid);
		console.log(data);
		self.remotePlayer = Crafty.e('RemotePlayer').attr({x:data.x, y: data.y});
		self.remotePlayer.setPoints(game.stats.points.remote);
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
		self.remotePlayer.shoot(self.remotePlayer.getId())
	};

	function onLayEgg(data) {
		Crafty('Chicken').each(function(i){
			if (i == data) {
				this.layEgg();
			}
		})
	}

	function onDeadChicken() {
		console.log(Crafty('Chicken').length);
		if (!Crafty('Chicken').length) {
			socket.emit('level completed');
			Crafty.trigger('level completed');
		}
	}

	function getStats() {
		var pointsR;
		if (game.mode === Settings.MULTIPLAYER)
		 	pointsR = self.remotePlayer.scoreboard.score.points;
		var points = {local: self.localPlayer.scoreboard.score.points, remote: pointsR};
		var stats = {mode: game.mode, points: points}
		return stats;
	}

	function onGameOver(data) {
		var stats = getStats();
	   Crafty.scene('GameOver', stats);
	}

	function onLevelCompleted() {
		Crafty.e('2D, DOM, Text')
		.attr({x: Settings.WINDOW_WIDTH/2 - 200, y: Settings.WINDOW_HEIGHT / 2 - 50, w: 600})
		.text('Level Completed!')
		.textColor('lightgreen')
		.textFont({size: '50px'});
		setTimeout(function() {
			game.stats = getStats();
			if (game.levels[game.current].last) {
				game.stats.win = true;
				Crafty.scene('GameOver', game.stats);
			} else {
				game.current++;
				Crafty.scene('Game', game);
			}
		}, 2000);
	}

});

Crafty.scene('Menu', function(levels) {
	Crafty.background('black');
	Crafty.e('Button').attr({x:220, y:200, w:200, h:40, lvls: levels}).text(Settings.SINGLE_PLAYER);
	Crafty.e('Button').attr({x:220, y:240, w:200, h:40, lvls: levels}).text(Settings.MULTIPLAYER);
})

Crafty.scene('Loading', function(levels){
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
	Crafty.load(assetsObj, function(){
		console.log('assets loaded');
	// Now that our sprites are ready to draw, start the game
		Crafty.scene('Menu', levels);
	});
});

Crafty.scene('GameOver', function(stats) {
	var msg = 'Game Over';
	if (stats.win)
	 	msg = 'You win!!!'

	Crafty.background('black');
	Crafty.e('2D, DOM, Text')
	.attr({x: Settings.WINDOW_WIDTH/2 - 120, y: Settings.WINDOW_HEIGHT / 2 - 150, w: 300})
	.text(msg)
	.textColor('lightgreen')
	.textFont({size: '50px'});
	Crafty.e('2D, Canvas, spr_player')
	.attr({x: Settings.WINDOW_WIDTH/2 - 150, y: Settings.WINDOW_HEIGHT / 2 - 50, w: 60, h: 60})
	Crafty.e('2D, DOM, Text')
	.attr({x: Settings.WINDOW_WIDTH/2 - 80, y: Settings.WINDOW_HEIGHT / 2 - 50, w: 300})
	.text('- ' + stats.points.local + ' points')
	.textColor('white')
	.textFont({size: '40px'});
	if (stats.mode === Settings.MULTIPLAYER) {
		Crafty.e('2D, Canvas, spr_player')
		.attr({x: Settings.WINDOW_WIDTH/2 - 150, y: Settings.WINDOW_HEIGHT / 2 + 30, w: 60, w: 60})
		Crafty.e('2D, DOM, Text')
		.attr({x: Settings.WINDOW_WIDTH/2 - 80, y: Settings.WINDOW_HEIGHT / 2 + 30, w: 300})
		.text('- ' + stats.points.remote + ' points')
		.textColor('white')
		.textFont({size: '40px'});

	}
	Crafty.e('2D, DOM, Text, Keyboard')
	.attr({x: Settings.WINDOW_WIDTH/2 - 250, y: Settings.WINDOW_HEIGHT / 2 + 150, w: 600})
	.text('Press any key to return to main menu...')
	.textColor('white')
	.textFont({size: '30px', type: 'italic'})
	.bind('KeyDown', function() {
		Crafty.scene('Menu');
	});
});
