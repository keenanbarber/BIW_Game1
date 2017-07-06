// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 


var physics;

MyGame.OptionsState = function(game) {
	"use strict"; 
};


MyGame.OptionsState.prototype = {

	init: function(game_details_data, previousState, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.game_details_data = game_details_data;
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// physics = Physics();

		// Exit the previous scene/state...
		if(previousState) { ExitPreviousScene(previousState.sceneProps, TranslateTween(this.oldSceneTransition, 1000, Phaser.Easing.Bounce.Out)); }
	},

	preload: function() {

	},

	create: function() {
		"use strict"; 

		let obj = this;
		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		this.sceneProps = game.add.group();

		// Background
		this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
		this.background.anchor.setTo(0.5);
		this.sceneProps.add(this.background);

		// Exit Button
		this.button = SpriteButton(100, 100, 'button_exit');
		this.button.setBehaviors(
			function() { //On mouse over...
				// console.log("Over");
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x * 1.1, this.getIntendedScale().y * 1.1, 1000);
			}, 
			function() { //On mouse off...
				// console.log("Off");
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x, this.getIntendedScale().y, 1000);
			},
			function() { //On mouse down...
				// console.log("Down");
				this.storedScale = new Phaser.Point(this.getSprite().scale.x, this.getSprite().scale.y);
				// this.getSprite().loadTexture('button_exit_dark');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x * 0.8, this.getIntendedScale().y * 0.8, 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('button_exit');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x, this.getIntendedScale().y, 1000);
			}
		); 
		this.button.setClickBehavior(function() {
			// console.log("CLICK");
			score = 0;
			obj.game.state.start("MenuState", false, false, this.game_details_data, obj, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
		});
		this.sceneProps.add(this.button.getSprite());





		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, Phaser.Easing.Bounce.Out));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			console.log("Transition completed.");
		});

		this.positionComponents(game.width, game.height);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	},

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) { // If the game is in landscape, position the elements in this way...
			// Background
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			ScaleSprite(this.button.getSprite(), width/3, height/3, 20, 1);
			this.button.getSprite().x = width/2;
			this.button.getSprite().y = height/2;
			this.button.updateIntendedScale();
		}
		else { // If the game is in portrait, position the elements in this way...
			// Background
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			ScaleSprite(this.button.getSprite(), width/3, height/3, 20, 1);
			this.button.getSprite().x = width/2;
			this.button.getSprite().y = height/2;
			this.button.updateIntendedScale();
		}
	},

	resize: function(width, height) {
		"use strict";
		UpdateScreenInfo();
		//console.log("Resized");

		this.positionComponents(width, height);
		game.scale.refresh();
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	},

	end_swipe: function(pointer) {
		"use strict";	
	    //console.log("Press up.");
	    if(this.start_swipe_point != null && this.end_swipe_point == null) {

		    var swipe_length
		    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
		    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);

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
	}, 
};


























