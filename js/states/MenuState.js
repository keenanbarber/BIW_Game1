// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var background = null;
var allowBoardInput = false;
var button_press_sound;

MyGame.MenuState = function() {
	"use strict"; 
};

MyGame.MenuState.prototype = {
	init: function(previousStateProps, oldSceneTransition, newSceneTransition) {
		"use strict";

		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Add events to check for swipe and resize
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);
		game.scale.setResizeCallback(this.resize, this);

		// Exit the previous scene/state...
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, configuration.transition_time, configuration.transition_easing)); }
	},
	
	preload: function() {
		button_press_sound = game.add.audio('button_press');
	},

	create: function() {
		"use strict"; 
		let obj = this;
		this.sceneProps = game.add.group();
		

		// Add background if it doesn't already exist
		if(background == null) {
			background = game.add.sprite(game.world.centerX, game.world.centerY, 'background_image');
			background.anchor.setTo(0.5, 1);
			// this.sceneProps.add(this.background);
			game.world.sendToBack(background);
		}

		// Title
		this.title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'title');
		this.title.anchor.setTo(0.5);
		this.sceneProps.add(this.title);


		// Menu Dialog Box
		this.myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, 300);	 
		this.myDialogBox1.addTextSegment("INSTRUCTIONS",
			{ font: "16px font_2", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addTextSegment("CREATE A SEQUENCE OF 3 OR MORE MARTIANS, VERTICALLY OR HORIZONTALLY. MATCH AS MANY AS YOU CAN IN 30 SECONDS. \nREADY, SET, GO!",
			{ font: "12px font_1", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addButton('PLAY', null,
		 	function() { //On click...
				// obj.myDialogBox1.hide();
				button_press_sound.play();
				score = 0;
				obj.game.state.start("GameState", false, false, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.myDialogBox1.addButton('OPTIONS', null,
		 	function() { //On click...
				// obj.game.state.start("OptionsState", true, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.myDialogBox1.addButton('BACK TO ARCADE', null,
		 	function() { //On click...
				obj.game.state.start("GameOverState", false, false, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.myDialogBox1.getGraphicsSprite());

		

		// Enter this new scene
		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, configuration.transition_time, configuration.transition_easing));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			obj.myDialogBox1.show();
		});
		this.positionComponents(game.width, game.height);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	}, 

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			// Background
			ScaleSprite(background, width, null, 0, 1);
			if(background.height < height) {
				ScaleSprite(background, null, height, 0, 1);
			}
			background.x = game.world.centerX;
			background.y = height;

			// Title
			ScaleSprite(this.title, width * (2 / 3), height, 10, 1);
			this.title.x = (width / 2) + (game_details_data.position_adjustment.title_image_X_offset * window.devicePixelRatio);
			this.title.y = (height/2 - this.title.height/2) + (game_details_data.position_adjustment.title_image_Y_offset * window.devicePixelRatio);

			// Dialog Box
			this.myDialogBox1.setPosition(
				game.world.centerX + (game_details_data.position_adjustment.menu_dialog_box_X_offset * window.devicePixelRatio), 
				game.world.centerY + this.myDialogBox1.getHeight() * (1/2)  + (game_details_data.position_adjustment.menu_dialog_box_Y_offset * window.devicePixelRatio));
		}
		else {
			// Background
			ScaleSprite(background, width, null, 0, 1);
			if(background.height < height) {
				ScaleSprite(background, null, height, 0, 1);
			}
			background.x = game.world.centerX;
			background.y = height;

			// Title
			ScaleSprite(this.title, width * (2 / 3), height, 10, 1);
			this.title.x = (width / 2) + (game_details_data.position_adjustment.title_image_X_offset * window.devicePixelRatio);
			this.title.y = (height/2 - this.title.height/2) + (game_details_data.position_adjustment.title_image_Y_offset * window.devicePixelRatio);

			// Dialog Box
			this.myDialogBox1.setPosition(
				game.world.centerX + (game_details_data.position_adjustment.menu_dialog_box_X_offset * window.devicePixelRatio), 
				game.world.centerY + this.myDialogBox1.getHeight() * (1/2)  + (game_details_data.position_adjustment.menu_dialog_box_Y_offset * window.devicePixelRatio));
		}
	},

	resize: function(sm, parentBounds) {
		"use strict";
		UpdateGameWindow(game);

		let scaleManager = sm;
		let width = sm.width; 
		let height = sm.height;

		this.positionComponents(width, height);
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    //this.exitTransition();
	    
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    // this.game.state.start("GameState", false, false, this.game_details_data, this);
	},

	end_swipe: function(pointer) {
		"use strict";	
	    //console.log("Press up.");
	    if(this.start_swipe_point != null && this.end_swipe_point == null) {

		    var swipe_length
		    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
		    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);

		    //console.log(swipe_length);
		    // if the swipe length is greater than the minimum, a swipe is detected
		    if (swipe_length >= configuration.min_swipe_length) {
		        let calculatedSwipeDirectionVector = new Phaser.Point(this.end_swipe_point.x - this.start_swipe_point.x, this.end_swipe_point.y - this.start_swipe_point.y).normalize();
			    
			    this.findDirectionOfSwipe(calculatedSwipeDirectionVector);
		    }
		}

	    this.end_swipe_point = null;
	    this.start_swipe_point = null;
	},

	findDirectionOfSwipe: function(d) {
		/* Could be made more efficient, but it works for now. */

		let bestVector = null;
		let bestDist = 0;
		let currentVector = null;
		let dist = 0;

		currentVector = new Phaser.Point(-1, 0);
		bestDist = d.distance(currentVector);
		bestVector = "LEFT";

		currentVector = new Phaser.Point(1, 0);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = "RIGHT";
		}

		currentVector = new Phaser.Point(0, -1);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = "UP";
		}

		currentVector = new Phaser.Point(0, 1);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = "DOWN";
		}

		console.log("Swipe: " + bestVector);
		return bestVector;
	}

};

