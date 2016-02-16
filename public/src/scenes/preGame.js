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
