Crafty.scene('Game', function() {
	var tile_rows = Settings.WINDOW_HEIGHT / Settings.TILE_HEIGHT;
	var tile_cols = Settings.WINDOW_WIDTH / Settings.TILE_WIDTH;
	var chicken_cols = Settings.CHICKENS_COUNT / Settings.CHICKEN_ROWS;
	var padding = (tile_cols - chicken_cols) / 2;
	for (var i = 0; i < 4; i++)
		for(var j = 1; j <= chicken_cols; j++) {
			Crafty.e('Chicken').at(j, i + padding);
		}


	this.player = Crafty.e('Player').at(6, 6);
	this.scoreboard = Crafty.e('Scoreboard');
	this.lives_field = Crafty.e('Lives');
	this.points_field = Crafty.e('Points');
	this.level_completed = this.bind('DeadChicken', function(coords) {
		console.log(Crafty('Chicken').length);
		var smoke = Crafty.e('Smoke').attr(coords);
		setTimeout(function() {
			smoke.destroy();
		}, 200);

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
	spr_scoreboard: [0, 64, 160, 40],
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
