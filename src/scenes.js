Crafty.scene('Game', function() {
	for (var i = 1; i < 5; i++) {
		for (var j = 8; j < 16; j++) {
			Crafty.e('Chicken').at(j, i);
		}
	}

	this.player = Crafty.e('Player').at(12, 14);
	console.log(Game.width());
});
