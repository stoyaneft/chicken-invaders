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
		.onHit('Solid', this.die)
        .bind('Moved', this.keepInField)
		.bind('KeyDown', function() {
			if (this.isDown('SPACE'))
				this.shoot();
		});

        this.lives = Game.MAX_LIVES;
	},

    keepInField: function(oldPos) {
        if (this.x + this.w >= Game.width() || this.x <= 0 || this.y <= 0 || this.y + this.h >= Game.height()) {
            this.x = oldPos.x;
            this.y = oldPos.y;
        }
    },

    die: function() {
        if (this.lives == 0) {
            Crafty.trigger('GameOver', this);
        } else {
            this.lives--;
            console.log('lives left: ', this.lives);
        }
    },

	shoot: function() {
		Crafty.e('Bullet').attr({x: this.x + Game.map_grid.tile.width / 2, y: this.y, w:5, h:5});
	}


});

Crafty.c('Bullet', {
	init: function() {
		this.requires('2D, Canvas, Collision, Color')
		.color('white')
		.bind('EnterFrame', this.mov)
		.onHit('Chicken', this.damageChicken);
		this.speed = Game.BULLET_STARTING_SPEED;
	},

	damageChicken: function(data) {
		var chicken = data[0].obj;
		this.destroy();
		chicken.destroy();
        Crafty.trigger('DeadChicken', this);
	},

	mov: function(eventData) {
		if (this.y > 0) {
			this.y = this.y - this.speed * (eventData.dt / 1000);
			this.speed += Game.BULLET_SPEED;
		} else {
			this.destroy();
		}
	}
});

Crafty.c('Chicken', {
	init: function() {
		this.requires('2D, Canvas, Grid, Solid, Color')
		.color('red')
		.bind('EnterFrame', this.fly)
        .bind('EnterFrame', this.layEgg)
		.bind('ChangeDirection', this.changeDirection);
		this.speed = Game.CHICKEN_SPEED;
	},

	changeDirection: function() {
        this.speed *= -1;
        this.x += this.speed;
	},

	fly: function() {
		if (this.x <= 0 || this.x + Game.map_grid.tile.width >= Game.width()) {
			Crafty('Chicken').trigger('ChangeDirection');
        } else {
			this.x += this.speed;
		}
	},

    layEgg: function() {
        if (Math.random() < Game.EGG_POSSIBILITY) {
            Crafty.e('Egg').attr({x: this.x + Game.map_grid.tile.width / 2, y: this.y, w:15, h:15})
        }
    }
});

Crafty.c('Egg', {
    init: function() {
        this.requires('2D, Canvas, Grid, Circle, Solid, Color')
        .color('white')
        .bind('GroundHit', this.onGroundHit)
        .bind('EnterFrame', this.mov);
        this.speed = Game.EGG_SPEED;
    },

    mov: function() {
        if (this.y >= Game.height()) {
            this.trigger('GroundHit');
        } else {
            this.y += this.speed;
        }
    },

    onGroundHit: function() {
        console.log('hitted ground');
        this.destroy();
    }
});
