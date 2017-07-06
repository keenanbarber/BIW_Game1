// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var text_test_style;
var player;
var transitionRect;
var t;

MyGame.MenuState = function() {
	"use strict"; 
};

MyGame.MenuState.prototype = {
	init: function(game_details_data, previousState, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.game_details_data = game_details_data;
		this.MINIMUM_SWIPE_LENGTH = 40;
		this.sceneProps
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		UpdateScreenInfo();
		// Exit the previous scene/state...
		if(previousState) { ExitPreviousScene(previousState.sceneProps, TranslateTween(this.oldSceneTransition, 1000, Phaser.Easing.Bounce.Out)); }
	},
	
	preload: function() {
		
	},

	create: function() {
		"use strict"; 

		this.sceneProps = game.add.group();


		this.addComponents();


		
	    // this.showHint(new Phaser.Point(game.world.centerX, 40), new Phaser.Point(game.world.centerX-30, 40));


		// text_test_style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		// text_test = game.add.bitmapText(game.world.centerX, 20, 'testFont', "Testing", 20);
		// text_test.anchor.setTo(0.5);
		// this.sceneProps.add(text_test);

		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, Phaser.Easing.Bounce.Out));
		this.positionComponents(game.width, game.height);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	}, 

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			// ScaleText(text_test, width/2, height, 10, 1);
			// text_test.x = game.world.centerX;
			// text_test.y = height/4;

			// Background
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			// Title
			ScaleSprite(this.title, width/2, height/3, 10, 1);
			this.title.x = width * 3/4;
			this.title.y = height/2;

			// Buttons
			ScaleSprite(this.button1.getSprite(), width/3, height/5, 10, 1);
			this.button1.getSprite().x = width / 4;
			this.button1.getSprite().y = height * 1/4;
			this.button1.updateIntendedScale();

			ScaleSprite(this.button2.getSprite(), width/3, height/5, 10, 1);
			this.button2.getSprite().x = width / 4;
			this.button2.getSprite().y = height * 2/4;
			this.button2.updateIntendedScale();

			ScaleSprite(this.button3.getSprite(), width/3, height/5, 10, 1);
			this.button3.getSprite().x = width / 4;
			this.button3.getSprite().y = height * 3/4;
			this.button3.updateIntendedScale();
		}
		else {
			// ScaleText(text_test, width, height, 20, 1);
			// text_test.x = game.world.centerX;
			// text_test.y = game.world.centerY/2;

			// Background
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			// Title
			ScaleSprite(this.title, width/2, height/3, 10, 1);
			this.title.x = width/2;
			this.title.y = height/4;

			// Buttons
			ScaleSprite(this.button1.getSprite(), width/2, height/5, 5, 1);
			this.button1.getSprite().x = width / 2;
			this.button1.getSprite().y = height * 3/6;
			this.button1.updateIntendedScale();

			ScaleSprite(this.button2.getSprite(), width/2, height/5, 5, 1);
			this.button2.getSprite().x = width / 2;
			this.button2.getSprite().y = height * 4/6;
			this.button2.updateIntendedScale();

			ScaleSprite(this.button3.getSprite(), width/2, height/5, 5, 1);
			this.button3.getSprite().x = width / 2;
			this.button3.getSprite().y = height * 5/6;
			this.button3.updateIntendedScale();
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
	}, 

	addComponents: function() {
		
		let obj = this; // Reference to the scene

		this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
		this.background.anchor.setTo(0.5);
		this.sceneProps.add(this.background);

		this.title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'title');
		this.title.anchor.setTo(0.5);
		this.sceneProps.add(this.title);
		// this.title.alpha = 0.1;
		// TweenProps(this.title, FadeTween("FADE_IN", 1000, Phaser.Easing.Linear.None));



		this.button1 = SpriteButton(100, 100, 'button_start');
		this.button1.setBehaviors(
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
				// this.getSprite().loadTexture('button_start_dark');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x * 0.8, this.getIntendedScale().y * 0.8, 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('button_start');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x, this.getIntendedScale().y, 1000);
			}
		);
		this.button1.setClickBehavior(function() {
			// console.log("CLICK");
			obj.game.state.start("GameState", false, false, this.game_details_data, obj, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
		});
		this.sceneProps.add(this.button1.getSprite());


		this.button2 = SpriteButton(100, 100, 'button_options');
		this.button2.setBehaviors(
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
				// this.getSprite().loadTexture('button_options_dark');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x * 0.8, this.getIntendedScale().y * 0.8, 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('button_options');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x, this.getIntendedScale().y, 1000);
			}
		);
		this.button2.setClickBehavior(function() {
			// console.log("CLICK");
			obj.game.state.start("OptionsState", false, false, this.game_details_data, obj, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
		});
		this.sceneProps.add(this.button2.getSprite());


		this.button3 = SpriteButton(100, 100, 'button_exit');
		this.button3.setBehaviors(
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
		this.button3.setClickBehavior(function() {
			// console.log("CLICK");
		});
		this.sceneProps.add(this.button3.getSprite());
	}, 



	showHint: function(startingPoint, endingPoint) { // HINT DISPLAY
		this.hint = game.add.sprite(startingPoint.x, startingPoint.y, 'green_square');
		this.hint.anchor.setTo(0.5);
		this.hint.scale.setTo(0, 0);
		this.hintTweens = [];

		let tweenAppear = game.add.tween(this.hint.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out);
		let tween0 = game.add.tween(this.hint).to({ x: startingPoint.x, y: startingPoint.y }, 500, Phaser.Easing.Linear.None);
		let tween1 = game.add.tween(this.hint).to({ x: startingPoint.x, y: startingPoint.y }, 500, Phaser.Easing.Linear.None);
		let tween2 = game.add.tween(this.hint).to({ x: endingPoint.x, y: endingPoint.y }, 1500, Phaser.Easing.Quadratic.Out);
		let tween3 = game.add.tween(this.hint).to({ x: endingPoint.x, y: endingPoint.y }, 500, Phaser.Easing.Linear.None);
		let tweenDisappear = game.add.tween(this.hint.scale).to({ x: 0, y: 0 }, 800, Phaser.Easing.Quadratic.Out);

		this.hintTweens.push(tweenAppear);
		this.hintTweens.push(tween0);
		this.hintTweens.push(tween1);
		this.hintTweens.push(tween2);
		this.hintTweens.push(tween3);
		this.hintTweens.push(tweenDisappear);

		tweenAppear.start();
		tweenAppear.chain(tween0);
		tween0.chain(tween1);
		ChangeSpriteOnTweenComplete(tween0, this.hint, 'red_square');
		tween1.chain(tween2);
		tween2.chain(tween3);
		ChangeSpriteOnTweenComplete(tween2, this.hint, 'green_square');
		tween3.chain(tweenDisappear);

		tweenDisappear.onComplete.addOnce(this.removeHint, this);
	}, 

	removeHint: function() {
		this.clearHintTweens();
		this.hint.destroy();
	}, 

	clearHintTweens: function() {
		while(this.hintTweens.length != 0) {
			this.hintTweens[0].stop();
			this.hintTweens.pop(this.hintTweens[0]);
		}
	}














};

