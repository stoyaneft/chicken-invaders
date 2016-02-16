Crafty.scene('Game', function(game) {
	var self = this;
	var current_lvl = 1;
	setEventHandlers();
	console.log(game.mode);
	console.log(game);
	Crafty.background("url('assets/background.png')");
	this.localPlayer = Crafty.e('LocalPlayer').attr({x:200, y:400, w:64, h:64});

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

	function resetPlayersPositions() {
		Crafty('LocalPlayer').attr({x:200, y:400});
		if (game.mode === Settings.MULTIPLAYER) {
			Crafty('RemotePlayer').attr({x:200, y:400});
		}
	}

	function intitalizeChickens() {
		console.log(current_lvl);
		level = game.levels[current_lvl];
		console.log(level);
		var tile_rows = Settings.WINDOW_HEIGHT / Settings.TILE_HEIGHT;
		var tile_cols = Settings.WINDOW_WIDTH / Settings.TILE_WIDTH;
		var chicken_cols = Settings.CHICKENS_COUNT / Settings.CHICKEN_ROWS;
		var padding = (tile_cols - chicken_cols) / 2;
		for (var i = 1; i <=level.rows; i++)
			for(var j = 1; j <= level.cols; j++) {
				Crafty.e('Chicken').attr({egg_speed: level.egg_speed})
				.at(j, i + padding-1).setSId(i*j - 1)
			}
	};

	function setEventHandlers() {
		self.bind('dead chicken', onDeadChicken);
		self.bind('level completed', onLevelCompleted);
		socket.on('disconnect', onSocketDisconnect);
		socket.on('new player', onNewPlayer);
		socket.on('move player', onMovePlayer);
		socket.on('dead chicken', onDeadChickenServer);
		socket.on('player shot', onPlayerShot);
		socket.on('lay egg', onLayEgg);
		socket.on('game over', onGameOver);
	}

	function onSocketDisconnect() {
		console.log('Disconnected from server');
	};

	function onNewPlayer(data) {
		console.log('New player connected: '+ data.sid);
		self.remotePlayer = Crafty.e('RemotePlayer').attr({x: data.x, y: data.y});
		//self.remotePlayer.setPoints(game.stats.points.remote);
		Crafty.pause();
		self.waitingText.destroy();
		socket.emit('all connected');
	};

	function onMovePlayer(data) {
		self.remotePlayer.x = data.x;
		self.remotePlayer.y = data.y;
	};

	function onDeadChickenServer(data) {
		Crafty(data.id).destroy();
	};

	function onDeadChicken(data) {
		console.log(Crafty('Chicken').length);
		if (!Crafty('Chicken').length) {
			socket.emit('level completed');
			Crafty.trigger('level completed');
		}
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
		stats.win = false;
		game.stats = stats;
	   Crafty.scene('GameOver', game);
	}

	function onLevelCompleted() {
		var congratzMsg = Crafty.e('2D, DOM, Text')
		.attr({x: Settings.WINDOW_WIDTH/2 - 200, y: Settings.WINDOW_HEIGHT / 2 - 50, w: 600})
		.text('Level ' + current_lvl + ' Completed!')
		.textColor('lightgreen')
		.textFont({size: '50px'});
		setTimeout(function() {
			congratzMsg.destroy();
			game.stats = getStats();
			if (game.levels[current_lvl].last) {
				game.stats.win = true;
				Crafty.scene('GameOver', game);
			} else {
				current_lvl++;
				resetPlayersPositions();
				intitalizeChickens();
			}
		}, 2000);
	}

});
