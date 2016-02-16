
function Chicken(egg_possibility) {
	var isAlive = true;

	function destroy(){
		isAlive = false;
	}

	function getIsAlive() {
		return isAlive;
	}

	function layedEgg() {
		return Math.random() < egg_possibility;
	}

	// Define which variables and methods can be accessed
	return {
		destroy: destroy,
		layedEgg: layedEgg,
		isAlive: getIsAlive
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Chicken = Chicken;
