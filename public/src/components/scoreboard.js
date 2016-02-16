Crafty.c('Scoreboard', {
    init: function() {
        this.requires('2D, DOM')
        .bind('ChangeScore', this.changeScore)
        .bind('ChangeLives', this.changeLives);

        this.score = Crafty.e('Points');
        this.lives = Crafty.e('Lives');
    },

    set: function(newScore) {
        this.score.set(newScore);
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
    },

    set: function(newScore) {
        this.points = newScore;
        this.text(this.points);
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
