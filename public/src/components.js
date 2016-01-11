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

Crafty.c('Player', {
	init: function() {
		this.requires('2D, Canvas, Grid, Collision');
        this.lives = Settings.MAX_LIVES;
        this.immortal = false;
	},

    die: function(data) {
        if (!this.immortal) {
            if (this.lives == 0) {
                Crafty.trigger('GameOver');
            } else {
                this.lives--;
                console.log('lives left: ', this.lives);
                Crafty.trigger('DeadPlayer', {lives: this.lives, id: this.getId()});
            }
        }
    },

    onDeadPlayer: function(data) {
        if (this.getId() === data.id) {
            var self = this;
            this.immortal = true;
            console.log('immortal');
            this._setInt = setInterval(function() {
                console.log('blink');
                self.toggleComponent('Canvas');
            }, 500)
            setTimeout(function () {
                self.immortal = false;
                console.log('not immortal');
                clearInterval(self._setInt);
                if (!self.has('Canvas')) {
                    self.toggleComponent('Canvas');
                }
            }, 3000);

            this.scoreboard.trigger('ChangeLives')
        }
    },

    shoot: function(data) {
        console.log('who shot: ' + data.id)
		Crafty.e('Bullet').attr({x: this.x + Settings.TILE_WIDTH / 2 - 5, y: this.y, w:5, h:5, playerId: data.id});
	}
});

Crafty.c('LocalPlayer', {
	init: function() {
		this.requires('Player, Fourway, Mouse, Keyboard, spr_player')
		.fourway(4)
        .onHit('Solid', this.die)
        .bind('Moved', this.keepInField)
        .bind('DeadPlayer', this.onDeadPlayer)
		.bind('KeyDown', function() {
			if (this.isDown('SPACE')) {
				this.shoot({id: this.getId()});
                socket.emit('player shot', {id: this.getId()});
            }
		});
        this.scoreboard = Crafty.e('LocalScoreboard');
	},

    keepInField: function(oldPos) {
        if (this.x + this.w >= Settings.WINDOW_WIDTH || this.x <= 0 || this.y <= 0 || this.y + this.h >= Settings.WINDOW_HEIGHT) {
            this.x = oldPos.x;
            this.y = oldPos.y;
        }
        socket.emit('move player', {x: this.x, y: this.y})
    }
});

Crafty.c('RemotePlayer', {
    init: function() {
        this.requires('Player, spr_player')
        .onHit('Solid', this.die)
        .bind('DeadPlayer', this.onDeadPlayer);
        this.scoreboard = Crafty.e('RemoteScoreboard');
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
        Crafty.trigger('DeadChicken');
        socket.emit('dead chicken', {id: chicken.getId()});
        console.log(Crafty(this.playerID));
        Crafty(this.playerId).scoreboard.trigger('ChangeScore');
	},

	mov: function(eventData) {
		if (this.y > 0) {
			this.y -= this.speed * (eventData.dt / 1000);
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
            Crafty.e('Egg').attr({x: this.x + Settings.TILE_WIDTH, y: this.y + Settings.TILE_HEIGHT})
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

Crafty.c('Scoreboard', {
    init: function() {
        this.requires('2D, DOM')
        .bind('ChangeScore', this.changeScore)
        .bind('ChangeLives', this.changeLives);

        this.score = Crafty.e('Points');
        this.lives = Crafty.e('Lives');
    },

    changeScore: function(data) {
        this.score.changeScore();
    },

    changeLives: function(data) {
        this.lives.changeLives();
    }
});

Crafty.c('LocalScoreboard', {
    init: function() {
        this.requires('Scoreboard, spr_lscoreboard')
        .attr({x: 0, y:0});

        this.score.attr({x: 5, y: 6.5, points: 0});
        this.lives.attr({x: 125, y: 6.5, lives: Settings.MAX_LIVES});
    }
});

Crafty.c('RemoteScoreboard', {
    init: function() {
        this.requires('Scoreboard, spr_rscoreboard')
        .attr({x:Settings.WINDOW_WIDTH - 160, y:0});

        this.score.attr({x: this.x + 15, y: this.y + 6.5, points: 0});
        this.lives.attr({x: this.x + 125, y: this.y + 6.5, lives: Settings.MAX_LIVES})
    }
})

Crafty.c('Points', {
    init: function() {
        this.requires('2D, DOM, Text')
        .text(0)
        .textColor('white')
        .textFont({size: '20px'})
        //.css({'font-size': '50px', 'color': 'white'});
    },

    changeScore: function() {
        this.points += 100;
        this.text(this.points)
    }
});

Crafty.c('Lives', {
    init: function() {
        this.requires('2D, DOM, Text')
        .text(Settings.MAX_LIVES)
        .textColor('white')
        .textFont({size: '20px'})
    },

    changeLives: function() {
        this.lives -= 1;
        this.text(this.lives);
    }
});

Crafty.c('Smoke', {
    init: function() {
        this.requires('2D, Canvas, spr_smoke')
    }
})
