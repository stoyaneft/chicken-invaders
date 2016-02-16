Crafty.c("Hoverable", {
    _baseColor: 'white',
    _hoverColor: 'lightgreen',
    init: function() {
        this.requires('Color, Mouse, Text');
        this.textColor(this._baseColor);
        this.bind("MouseOver", function(e){
            this._baseColor = this.color();
            this.textColor(this._hoverColor);
        });
        this.bind("MouseOut", function(e){
            this.textColor(this._baseColor);
        });
    },
    hoverColor: function(newColor){
        this._hoverColor = newColor;
        return this;
    }
});

Crafty.c("Button", {
    _baseColor: 'white',
    _hoverColor: 'lightgreen',

    init: function(){
        this.label = Crafty.e('2D, DOM, Text')
        .attr({z:1})
        .textColor(this._baseColor)
        .textFont({size: '30px'})
        .unselectable();

        this.requires('DOM, 2D, Mouse, Color')
        .color('black')
        .bind("MouseOver", this.onMouseOver)
        .bind("MouseOut", this.onMouseOut)
        .bind("Click", this.onMouseClick)
        .attach(this.label);

    },

    text: function(txt) {
        this.label.text(txt);
        this.mode = txt;
        return this;
    },

    onMouseOver: function(){
        this.label.textColor(this._hoverColor);
    },

    onMouseOut: function(){
        this.label.textColor(this._baseColor);
    },

    onMouseClick: function() {
        Crafty.scene('Game', {mode: this.mode, levels: this.lvls});
    }

});
