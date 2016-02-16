Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Settings.TILE_WIDTH,
      h: Settings.TILE_HEIGHT
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Settings.TILE_WIDTH, y: this.y/Settings.TILE_HEIGHT }
    } else {
      this.attr({ x: x * Settings.TILE_WIDTH, y: y * Settings.TILE_HEIGHT});
      return this;
    }
  }
});

Crafty.c('Chicken', {
	init: function() {
		this.requires('2D, Canvas, Grid, Solid, spr_chicken')
		.bind('EnterFrame', this.fly)
        //.bind('EnterFrame', this.layEgg)
		.bind('ChangeDirection', this.changeDirection);
		this.speed = Settings.CHICKEN_SPEED;
        this.health = 100;
	},

    setSId: function(sid) {
        this.sid = sid;
    },

	changeDirection: function() {
        this.speed *= -1;
        this.x += this.speed;
	},

	fly: function() {
		if (this.x <= 0 || this.x + Settings.TILE_WIDTH >= Settings.WINDOW_WIDTH) {
			Crafty('Chicken').trigger('ChangeDirection');
        } else {
			this.x += this.speed;
		}
	},

    layEgg: function() {
        //if (Math.random() < Settings.EGG_POSSIBILITY) {
            var eggData = {
                x: this.x + Settings.TILE_WIDTH,
                y: this.y + Settings.TILE_HEIGHT,
                w: 9, h: 11, speed: this.egg_speed
            };
            Crafty.e('Egg').attr(eggData);
        //    socket.emit('lay egg', eggData);
        //}
    }
});

Crafty.c('Egg', {
    init: function() {
        this.requires('2D, Canvas, Solid, Collision, spr_egg')
        .attr({x:0, y:0, w:9, h: 11})
        .bind('GroundHit', this.onGroundHit)
        .bind('EnterFrame', this.mov);
    },

    mov: function() {
        if (this.y >= Settings.WINDOW_HEIGHT) {
            this.trigger('GroundHit');
        } else {
            this.y += this.speed;
        }
    },

    onGroundHit: function() {
        this.destroy();
    }
});
