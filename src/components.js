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
      this.attr({ x: x * Settings.TILE_WIDTH, y: y * Settings.TILE_HEIGHT });
      return this;
    }
  }
});

Crafty.c('Player', {
	init: function() {
		this.requires('2D, Canvas, Grid, Collision, Fourway, Mouse, Keyboard, spr_player')
		.fourway(4).onHit('Solid', this.die)
        .bind('Moved', this.keepInField)
        .bind('PlayerDead', this.makeImmortal)
		.bind('KeyDown', function() {
			if (this.isDown('SPACE'))
				this.shoot();
		});

        this.lives = Settings.MAX_LIVES;
        this.immortal = false;
	},

    keepInField: function(oldPos) {
        if (this.x + this.w >= Settings.WINDOW_WIDTH || this.x <= 0 || this.y <= 0 || this.y + this.h >= Settings.WINDOW_HEIGHT) {
            this.x = oldPos.x;
            this.y = oldPos.y;
        }
    },

    die: function() {
        if (!this.immortal) {
            if (this.lives == 0) {
                Crafty.trigger('GameOver', this);
            } else {
                this.lives--;
                console.log('lives left: ', this.lives);
                this.trigger('PlayerDead');
            }
        }
    },

    makeImmortal: function() {
        var self = this;
        this.immortal = true;
        console.log('immortal');
        this._setInt = setInterval(function() {
            console.log('blink');
            Crafty('Player').toggleComponent('Canvas');
        }, 500)
        setTimeout(function () {
            self.immortal = false;
            console.log('not immortal');
            clearInterval(self._setInt);
        }, 3000);
    },

	shoot: function() {
		Crafty.e('Bullet').attr({x: this.x + Settings.TILE_WIDTH / 2, y: this.y, w:5, h:5});
	}
});

Crafty.c('Bullet', {
	init: function() {
		this.requires('2D, Canvas, Collision, Color')
		.color('white')
		.bind('EnterFrame', this.mov)
		.onHit('Chicken', this.damageChicken);
		this.speed = Settings.BULLET_STARTING_SPEED;
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
			this.speed += Settings.BULLET_SPEED;
		} else {
			this.destroy();
		}
	}
});

Crafty.c('Chicken', {
	init: function() {
		this.requires('2D, Canvas, Grid, Solid, spr_chicken')
		.bind('EnterFrame', this.fly)
        .bind('EnterFrame', this.layEgg)
		.bind('ChangeDirection', this.changeDirection);
		this.speed = Settings.CHICKEN_SPEED;
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
        if (Math.random() < Settings.EGG_POSSIBILITY) {
            Crafty.e('Egg').attr({x: this.x + Settings.TILE_WIDTH, y: this.y, w:15, h:15})
        }
    }
});

Crafty.c('Egg', {
    init: function() {
        this.requires('2D, Canvas, Grid, Circle, Solid, spr_egg')
        .bind('GroundHit', this.onGroundHit)
        .bind('EnterFrame', this.mov);
        this.speed = Settings.EGG_SPEED;
    },

    mov: function() {
        if (this.y >= Settings.WINDOW_HEIGHT) {
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
