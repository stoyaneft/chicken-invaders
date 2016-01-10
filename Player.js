/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, sid) {
	var x = startX,
		y = startY,
		sid;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		sid: sid
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
