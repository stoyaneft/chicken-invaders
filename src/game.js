Game = {
	map_grid: {
		width:  20,
		height: 15,
		tile: {
			width:  32,
			height: 32
		}
	},

	MAX_LIVES: 3,
	EGG_POSSIBILITY: 0.0005,
	BULLET_STARTING_SPEED: 200,
	BULLET_SPEED: 5,
	PLAYER_SPEED: 4,
	EGG_SPEED: 3,
	CHICKEN_SPEED: 1,

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(640, 480);
	Crafty.background("url('assets/background.png')");
	Crafty.scene('Game');
  }
}
