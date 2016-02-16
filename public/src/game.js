Settings = {
	WINDOW_WIDTH: 640,
	WINDOW_HEIGHT: 480,
	TILE_WIDTH: 64,
	TILE_HEIGHT: 64,
	MAX_LIVES: 3,
	BULLET_STARTING_SPEED: 200,
	BULLET_DAMAGE: 50,
	BULLET_SPEED: 5,
	PLAYER_SPEED: 4,
	CHICKEN_SPEED: 1,
	CHICKENS_COUNT: 32,
	CHICKEN_ROWS: 4,
	SINGLE_PLAYER: 'Single player',
	MULTIPLAYER: 'Multiplayer'
}

Game = {
  // Initialize and start our game
	start: function(levels) {
		Crafty.init(Settings.WINDOW_WIDTH, Settings.WINDOW_HEIGHT);
		Crafty.scene('Loading', levels);
	}
}

$text_css = { 'font-size': '54px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }
