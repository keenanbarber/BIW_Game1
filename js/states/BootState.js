// Boot State loads a json file with the level information and starts the Loading State.

var MyGame = MyGame || {}; /* <---- This is used to create a namespace, or a named object
												under which functions and variables can be created
												without polluting the global object. More info: (https://stackoverflow.com/questions/6439579/what-does-var-foo-foo-assign-a-variable-or-an-empty-object-to-that-va) */

var game_details_data;

MyGame.BootState = function(game) {
	"use strict"; /* <-------- Defines that JavaScript code should be executed in "strict mode".
								It turns previously accepted "bad syntax" into real errors. */
	
}; 

MyGame.BootState.prototype = {
	init: function() {
		"use strict";
		// ScaleManager Options: .EXACT_FIT, .NO_SCALE, .RESIZE, .SHOW_ALL, .USER_SCALE

		// Determines if mobile or desktop.
		if (game.device.desktop) {  
			console.log("This is not running on a mobile device.");
			device = "DESKTOP";
			game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		}
		else { 
			console.log("This is running on a mobile device.");
			device = "MOBILE";
			game.scale.scaleMode = Phaser.ScaleManager.RESIZE; // Fills the screen
		}

		game.renderer.renderSession.roundPixels = true;
		game.scale.parentIsWindow = true;
		game.stage.disableVisibilityChange = true;

		game.scale.pageAlignVertically = true; 
		game.scale.pageAlignHorizontally = true; 
		
		updateGameWindow(game);
		game.scale.refresh();
	},

	preload: function() {
		"use strict"; 
		this.load.text("game_details", "assets/json/game_details.json"); // Load config file text
	}, 

	create: function() {
		"use strict"; 
		var game_details_text; 
		game_details_text = this.game.cache.getText("game_details");
		game_details_data = JSON.parse(game_details_text);


		this.game.state.start("LoadingState", true, false);
	}
};

