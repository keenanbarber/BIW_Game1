// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var text_test_style;

MyGame.MenuState = function() {
	"use strict"; 
};

MyGame.MenuState.prototype = {
	init: function(game_details_data, previousStateProps, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.game_details_data = game_details_data;
		this.MINIMUM_SWIPE_LENGTH = 40;
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		UpdateScreenInfo();
		// Exit the previous scene/state...
		// if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, 1000, configuration.transition_easing)); }
	},
	
	preload: function() {
		
	},

	create: function() {
		"use strict"; 

		this.sceneProps = game.add.group();

		this.addComponents();


		
		

		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		// EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, configuration.transition_easing));
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
			ScaleSprite(this.background, width, 9999, 0, 1);
			if(this.background.height < height) {
				ScaleSprite(this.background, 9999, height, 0, 1);
			}
			this.background.x = game.world.centerX;
			this.background.y = height;

			// Title
			ScaleSprite(this.title, width, height * 3/4, 10, 1);
			this.title.x = width/2;
			this.title.y = height * (3/4) * (2/3);

			// Dialog Box
			// this.myDialogBox1.resize(width/2, height/4);
			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY);

			// Buttons
			// ScaleSprite(this.button1.getSprite(), width/3, height/5, 10, 1);
			// this.button1.getSprite().x = width / 4;
			// this.button1.getSprite().y = height * 1/4;
			// this.button1.updateIntendedScale();

			// ScaleSprite(this.button2.getSprite(), width/3, height/5, 10, 1);
			// this.button2.getSprite().x = width / 4;
			// this.button2.getSprite().y = height * 2/4;
			// this.button2.updateIntendedScale();

			// ScaleSprite(this.button3.getSprite(), width/3, height/5, 10, 1);
			// this.button3.getSprite().x = width / 4;
			// this.button3.getSprite().y = height * 3/4;
			// this.button3.updateIntendedScale();
		}
		else {
			// ScaleText(text_test, width, height, 20, 1);
			// text_test.x = game.world.centerX;
			// text_test.y = game.world.centerY/2;

			// Background
			ScaleSprite(this.background, width, null, 0, 1);
			if(this.background.height < height) {
				ScaleSprite(this.background, null, height, 0, 1);
			}
			this.background.x = game.world.centerX;
			this.background.y = height;

			// Title
			ScaleSprite(this.title, width, height * 3/4, 10, 1);
			this.title.x = width/2;
			this.title.y = height * (3/4) * (2/3);

			// Dialog Box
			// this.myDialogBox1.resize(width/2, height/4);
			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY);

			// Buttons
			// ScaleSprite(this.button1.getSprite(), width/2, height/5, 5, 1);
			// this.button1.getSprite().x = width / 2;
			// this.button1.getSprite().y = height * 3/6;
			// this.button1.updateIntendedScale();

			// ScaleSprite(this.button2.getSprite(), width/2, height/5, 5, 1);
			// this.button2.getSprite().x = width / 2;
			// this.button2.getSprite().y = height * 4/6;
			// this.button2.updateIntendedScale();

			// ScaleSprite(this.button3.getSprite(), width/2, height/5, 5, 1);
			// this.button3.getSprite().x = width / 2;
			// this.button3.getSprite().y = height * 5/6;
			// this.button3.updateIntendedScale();
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

		this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'background_image');
		this.background.anchor.setTo(0.5, 1);
		this.sceneProps.add(this.background);

		this.title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'title');
		this.title.anchor.setTo(0.5);
		this.sceneProps.add(this.title);
		// this.title.alpha = 0.1;
		// TweenProps(this.title, FadeTween("FADE_IN", 1000, Phaser.Easing.Linear.None));


		// let myStyle = { font: "14px Avenir", fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width };
		// let message = game_details_data.user_details.name + ", you have " + game_details_data.user_details.points + " points. ";
		// let horizontalTextAlign = 'left';
		// let verticalTextAlign = 'center';
		// let textX = 20;
		// let textY = 20;
		// let anchorX = 0.0;
		// let anchorY = 0.0;

		// let myText = game.add.text(textX, textY, message, myStyle);
		// myText.anchor.setTo(anchorX, anchorY);
		// myText.align = obj.horizontalTextAlign;



		this.myDialogBox1 = DialogBox();	 
		this.myDialogBox1.addTextSegment("CREATE A SEQUENCE OF 3 OR MORE MARTIANS, VERTICALLY OR HORIZONTALLY, MATCH AS MANY AS YOU CAN IN 30 SECONDS. \nREADY, SET, GO!",
			{ font: "12px font_1", fill: '#ffffff' }, 'left', 'top');
		this.myDialogBox1.addTextSegment("PLEASE JUST WORK.",
			{ font: "30px font_2", fill: '#ffffff' }, 'center', 'top');
		this.myDialogBox1.addButton('PLAY', null,
		 	function() { //On click...
				// console.log("CLICKED");
				obj.myDialogBox1.hide();
				obj.game.state.start("GameOverState", true, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.myDialogBox1.addButton('OPTIONS', null,
		 	function() { //On click...
				// console.log("CLICKED");
				obj.myDialogBox1.hide();
			}
		);
		this.myDialogBox1.addButton('BACK TO ARCADE', null,
		 	function() { //On click...
				// console.log("CLICKED");
				obj.myDialogBox1.hide();
			}
		);
		this.myDialogBox1.addButton('UNICORNS & PONIES', null,
		 	function() { //On click...
				// console.log("CLICKED");
				obj.myDialogBox1.setWidth(game.width/2);
			}
		);
		this.myDialogBox1.show();


		// FOR END SCREEN!
		// =============================================
		// this.myDialogBox1 = DialogBox();
		// this.myDialogBox1.addTextSegment("CONGRATULATIONS!", { font: "22px font_2", fill: '#ffffff' }, 'center', 'top');
		// this.myDialogBox1.addTextSegment("YOU'VE WON", { font: "14px font_1", fill: '#ffffff' }, 'center', 'top');
		// this.myDialogBox1.addTextSegment("200", { font: "40px font_2", fill: '#ffffff' }, 'center', 'top');
		// this.myDialogBox1.addTextSegment("POINTS!", { font: "14px font_1", fill: '#ffffff' }, 'center', 'top');
		// this.myDialogBox1.addButton('CLAIM NOW', null,
		//  	function() { //On click...
		// 		obj.myDialogBox1.hide();
		// 	}
		// );
		// this.myDialogBox1.show();


	}, 

	

	newButton: function() {
		let obj = this;
		this.buttonStart = SpriteButton(game.world.centerX, game.world.centerY, gameTileKeys[0]);
		this.buttonStart.setBehaviors(
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
				// this.getSprite().loadTexture('button_start');
				Tweenimate_ElasticScale(this.getSprite(), this.getIntendedScale().x, this.getIntendedScale().y, 1000);
			}
		);
		this.buttonStart.setClickBehavior(function() {
			// console.log("CLICK");
			obj.game.state.start("GameState", false, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
		});
		this.sceneProps.add(this.buttonStart.getSprite());


		// let buttonText = game.add.bitmapText(0, 0, 'testFont', "START", 20);
		// buttonText.anchor.setTo(0.5);
		// buttonText.align = 'center';
		// // this.sceneProps.add(buttonText);

		// this.buttonStart.getSprite().addChild(buttonText);
	}

	

	














};

