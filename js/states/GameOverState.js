// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var text_test_style;

MyGame.GameOverState = function() {
	"use strict"; 
};

MyGame.GameOverState.prototype = {
	init: function(previousStateProps, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Add events to check for swipe and resize
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);
		currentState = this;
		window.addEventListener('resize', currentState.resize );

		// State Specific Variables
		this.MINIMUM_SWIPE_LENGTH = 40;

		// Exit the previous scene/state...
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, 1000, configuration.transition_easing)); }
	},
	
	preload: function() {
		
	},

	create: function() {
		"use strict"; 
		let obj = this;
		this.sceneProps = game.add.group();

		// Title
		this.title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'end_game_image');
		this.title.anchor.setTo(0.5);
		this.sceneProps.add(this.title);

		// End screen dialog
		this.myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, 300);
		this.myDialogBox1.addTextSegment("CONGRATULATIONS!", { font: "22px font_2", fill: '#ffffff' }, 'center', 'top');
		this.myDialogBox1.addTextSegment("YOU'VE WON", { font: "14px font_1", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addTextSegment(score, { font: "40px font_2", fill: '#7ffff4' }, 'center');
		this.myDialogBox1.addTextSegment("POINTS!", { font: "14px font_1", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addButton('CLAIM NOW', null,
		 	function() { //On click...
				// obj.myDialogBox1.hide();
				obj.game.state.start("MenuState", false, false, obj.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.myDialogBox1.getGroup());



		// Enter this new scene
		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, configuration.transition_easing));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			obj.myDialogBox1.show();
		});
		this.resize();
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
			this.title.x = width/2;
			this.title.y = height/2 - this.title.height/2;

			// Dialog Box
			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY + this.myDialogBox1.getHeight() * (1/2));
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
			this.title.x = width/2;
			this.title.y = height/2 - this.title.height/2;

			// Dialog Box
			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY + this.myDialogBox1.getHeight() * (1/2));
		}
	},

	resize: function(state) {
		"use strict";
		UpdateGameWindow(game);

		let scaleManager = game.scale;
		let width = scaleManager.width; 
		let height = scaleManager.height;

		currentState.positionComponents(width, height);
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

