Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

Crafty.c('Player', {
	init: function() {
		this.requires('2D, Canvas, Grid, Collision, Fourway, Mouse, Keyboard, Color')
		.fourway(4)
		.color('rgb(20, 125, 40)')
		.onHit('Chicken', function() {
			console.log('collison with chicken');
		});
		this.bind('KeyDown', function() {
			if (this.isDown('SPACE'))
				this.shoot();
		});
		console.log("in player")
	},

	shoot: function() {
		console.log('going to shooot');
		Crafty.e('Bullet').attr({x: this.x + Game.map_grid.tile.width / 2, y: this.y, w:5, h:5});
		console.log('shot');
	}


});

Crafty.c('Bullet', {
	init: function() {
		this.requires('2D, Canvas, Collision, Color')
		.color('white')
		.bind('EnterFrame', this.movee)
		.onHit('Chicken', this.damageChicken);
	},

	damageChicken: function(data) {
		var chicken = data[0].obj;
		chicken.destroy();
	},

	movee: function(eventData) {
		console.log('bullet moving');
		console.log(this.x, " ", this.y)
		if (this.y > 0) {
			this.y = this.y - 750 * (eventData.dt / 1000);
		} else {
			this.destroy();
		}
		return this;
	}
});

Crafty.c('Chicken', {
	init: function() {
		this.requires('2D, Canvas, Grid, Color')
		.color('red');
		console.log('in chicken');
	}
});
