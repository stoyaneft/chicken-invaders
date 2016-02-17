Crafty.c('Player', {
	init: function() {
		this.requires('2D, Canvas, Collision')
        this.lives = Settings.MAX_LIVES;
        this.immortal = false;
	},

    die: function(data) {
        if (!this.immortal) {
            this.lives--;
            if (this.lives === 0) {
                socket.emit('game over');
            } else {
                console.log('lives left: ', this.lives);
                Crafty.trigger('DeadPlayer', {lives: this.lives, id: this.getId()});
            }
        }
    },

    onDeadPlayer: function(data) {
        if (this.getId() === data.id) {
            var self = this;
            if (this.lives)
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

            this.scoreboard.trigger('change lives')
        }
    },

    shoot: function(player) {
		Crafty.e('Bullet').attr({x: this.x + Settings.TILE_WIDTH / 2 - 5,
			y: this.y, w:5, h:5, player: player});
	}
});

Crafty.c('LocalPlayer', {
	init: function() {
		this.requires('Player, Fourway, Mouse, Keyboard, spr_local_player')
		.fourway(4)
    	.collision([1, 46], [10, 10], [32, 0], [51, 10], [59, 46])
        .onHit('Solid', this.die)
        .bind('Moved', this.keepInField)
        .bind('DeadPlayer', this.onDeadPlayer)
		.bind('KeyDown', function() {
			if (this.isDown('SPACE')) {
				this.shoot('local');
                socket.emit('player shot');
            }
		});
        this.scoreboard = Crafty.e('LocalScoreboard');
	},

    keepInField: function(oldPos) {
        if (this.x + this.w >= Settings.WINDOW_WIDTH || this.x <= 0 || this.y <= 0 || this.y + this.h >= Settings.WINDOW_HEIGHT) {
            this.x = oldPos.x;
            this.y = oldPos.y;
        }
        socket.emit('move player', {x: this.x, y: this.y});
    }
});

Crafty.c('RemotePlayer', {
    init: function() {
        this.requires('Player, spr_remote_player')
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
		var player = this.player;
		this.destroy();
		var chicken = data[0].obj;
        chicken.health -= Settings.BULLET_DAMAGE;
        if (chicken.health <= 0) {
            chicken.destroy();
            socket.emit('dead chicken', {id: chicken.getId(), sid: chicken.sid, player: player});
        }

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
