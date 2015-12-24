Crafty.scene('Game', function() {
	this.player = Crafty.e('Player').at(6, 6);
	this.chicken = Crafty.e('Chicken').at(10, 10);
	console.log('in game scene');
});
