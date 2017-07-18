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
		window.addEventListener('resize', this.onResize, false);
		// Exit the previous scene/state...
		// if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, configuration.transition_time, configuration.transition_easing)); }
	
		
	},
	
	preload: function() {
		
	},

	create: function() {
		"use strict"; 

		this.sceneProps = game.add.group();

		this.addComponents();


		// this.test1 = game.add.sprite(50, 50, gameTileKeys[4]);
		// this.test1.anchor.setTo(0.5);
		// this.newAnimator = Animator(this.test1);
		// this.newAnimator.newAnimation('Poof', [gameTileKeys[4], 'anim_0', 'anim_1', 'anim_2', 'anim_3','anim_4', 'anim_5', 'anim_6', 'anim_7']);
		// this.newAnimator.playAnimation('Poof', true);
		// this.newAnimator.addCallOnComplete(function() {
		// 	console.log(":D");
		// });

		

		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		// EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, configuration.transition_time, configuration.transition_easing));
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

			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY + this.myDialogBox1.getHeight() * (1/2));

		}
		else {

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
			this.myDialogBox1.setPosition(game.world.centerX, game.world.centerY + this.myDialogBox1.getHeight() * (1/2));

		}
	},

	resize: function(width, height) {
		"use strict";
		UpdateScreenInfo();
		//console.log("Resized");

		this.positionComponents(width, height);
		game.scale.refresh();
		game.scale.setGameSize(Math.min(500, window.innerWidth), Math.min(500, window.innerHeight));
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



		this.myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, 300);	 
		this.myDialogBox1.addTextSegment("INSTRUCTIONS",
			{ font: "16px font_2", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addTextSegment("CREATE A SEQUENCE OF 3 OR MORE MARTIANS, VERTICALLY OR HORIZONTALLY. MATCH AS MANY AS YOU CAN IN 30 SECONDS. \nREADY, SET, GO!",
			{ font: "12px font_1", fill: '#ffffff' }, 'center');
		this.myDialogBox1.addButton('PLAY', null,
		 	function() { //On click...
				obj.myDialogBox1.hide();
				obj.game.state.start("GameState", true, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.myDialogBox1.addButton('OPTIONS', null,
		 	function() { //On click...
				// obj.myDialogBox1.hide();
				// obj.game.state.start("OptionsState", true, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.myDialogBox1.addButton('BACK TO ARCADE', null,
		 	function() { //On click...
				// obj.myDialogBox1.hide();
				obj.myDialogBox1.startTimer();
			}
		);

		this.myDialogBox1.show();


	}, 



};

