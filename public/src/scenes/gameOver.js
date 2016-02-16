Crafty.scene('GameOver', function(game) {
	console.log(game);
	var msg = 'Game Over';
	if (game.stats.win)
	 	msg = 'You win!!!'

	Crafty.background('black');
	Crafty.e('2D, DOM, Text')
	.attr({x: Settings.WINDOW_WIDTH/2 - 120,
		 y: Settings.WINDOW_HEIGHT / 2 - 150, w: 300})
	.text(msg)
	.textColor('lightgreen')
	.textFont({size: '50px'});
	Crafty.e('2D, Canvas, spr_player')
	.attr({x: Settings.WINDOW_WIDTH/2 - 150,
		y: Settings.WINDOW_HEIGHT / 2 - 50, w: 60, h: 60})
	Crafty.e('2D, DOM, Text')
	.attr({x: Settings.WINDOW_WIDTH/2 - 80,
		y: Settings.WINDOW_HEIGHT / 2 - 50, w: 300})
	.text('- ' + game.stats.points.local + ' points')
	.textColor('white')
	.textFont({size: '40px'});
	if (game.stats.mode === Settings.MULTIPLAYER) {
		Crafty.e('2D, Canvas, spr_player')
		.attr({x: Settings.WINDOW_WIDTH/2 - 150,
			y: Settings.WINDOW_HEIGHT / 2 + 30, w: 60, w: 60})
		Crafty.e('2D, DOM, Text')
		.attr({x: Settings.WINDOW_WIDTH/2 - 80,
			y: Settings.WINDOW_HEIGHT / 2 + 30, w: 300})
		.text('- ' + game.stats.points.remote + ' points')
		.textColor('white')
		.textFont({size: '40px'});

	}
	Crafty.e('2D, DOM, Text, Keyboard')
	.attr({x: Settings.WINDOW_WIDTH/2 - 250,
		y: Settings.WINDOW_HEIGHT / 2 + 150, w: 600})
	.text('Press any key to return to main menu...')
	.textColor('white')
	.textFont({size: '30px', type: 'italic'})
	.bind('KeyDown', function() {
		game.win = false;
		Crafty.scene('Menu', game.levels);
	});
});
