Crafty.scene('Game', function() {
	for (var i = 1; i < 5; i++) {
		for (var j = 8; j < 16; j++) {
			Crafty.e('Chicken').at(j, i);
		}
	}

	this.player = Crafty.e('Player').at(12, 14);

	this.level_completed = this.bind('DeadChicken', function() {
		console.log(Crafty('Chicken').length);
		if(!Crafty('Chicken').length) {
			// Crafty.scene('LevelCompleted');
			console.log('LevelCompleted')
		}
	})

	this.game_over = this.bind('GameOver', function() {
		console.log('game over :(');
	})

}, function() {
	this.unbind('DeadChicken', this.level_completed);
});

Crafty.scene('LevelCompleted', function() {
	Crafty.e('2D, DOM, Text')
		.text('Level Completed!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });
})
