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
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, 1000, configuration.transition_easing)); }
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

		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, configuration.transition_easing));
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

		this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'background_image');
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
			obj.game.state.start("GameState", false, false, this.game_details_data, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
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
			obj.game.state.start("OptionsState", false, false, this.game_details_data, obj.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
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
		
		// var myBitmap = game.add.bitmapData(0, 0);
		// var grd=myBitmap.context.createLinearGradient(0,0,0,100); // x0, y0, x1, y1
		// grd.addColorStop(0,"#ffffff");
		// grd.addColorStop(1,"#0a68b0");
		// myBitmap.context.fillStyle=grd;
		// myBitmap.context.fillRect(0,0,100,100);
		// grd=myBitmap.context.createLinearGradient(0,580,0,600);
		// grd.addColorStop(0,"#0a68b0");
		// grd.addColorStop(1,"black");
		// myBitmap.context.fillStyle=grd;
		// myBitmap.context.fillRect(0,580,800,20);


		// var myBitmap = game.add.bitmapData(200,200);
		// myBitmap.ctx.fillStyle = "#4b4bff";
		// myBitmap.ctx.beginPath();
		// myBitmap.ctx.fillRect(0, 0, 200, 200);
		// myBitmap.ctx.closePath(); 

		// var grd=myBitmap.context.createLinearGradient(0,0,0,200); // x0, y0, x1, y1
		// grd.addColorStop(0, "#090000");
		// grd.addColorStop(1, "#C50000");
		// myBitmap.context.fillStyle=grd;
		// myBitmap.context.fillRect(0,0,200,200);

		// var myMask = this.game.add.graphics(0, 0);
	 //    myMask.beginFill(0x000000);
	 //    myMask.drawRoundedRect(0, 0, 200, 200, 20); // draw a rounded rect mask
	 //    myMask.endFill();

		// let bitmapSprite = game.add.sprite(0, 0, myBitmap);
		// bitmapSprite.mask = myMask;
		// this.sceneProps.add(bitmapSprite);

		// var myBmp = this.game.add.bitmapData(140, 30);
	 //    var myGrd = myBmp.context.createLinearGradient(0, 0, 0, 30);
	 //    myGrd.addColorStop(0, '#000000');
	 //    myGrd.addColorStop(1, '#C50000');
	 //    myBmp.context.fillStyle = myGrd;
	 //    myBmp.context.fillRect(0, 0, 140, 30);
	 //    var grandientSpr = this.game.add.sprite(330, 50, myBmp);

	 //    var myMask = this.game.add.graphics(0, 0);
	 //    myMask.beginFill(0x000000);

	 //    myMask.drawRoundedRect(330, 50, 140, 30, 10); // draw a rounded rect mask
	 //    myMask.endFill();
		
	 //    grandientSpr.mask = myMask; // apply the mask
	 let myDialogBox1 = DialogBox("Press the button to proceed. ");
	 myDialogBox1.addButton('NEXT', 
	 	function() { //On click...
			// console.log("CLICKED");
			myDialogBox2.show();
		}
	 );
	 let myDialogBox2 = DialogBox("Press the button to proceed. ");
	 myDialogBox2.addButton('NEXT', 
	 	function() { //On click...
			// console.log("CLICKED");
		}
	 );
	 myDialogBox2.addButton('PREVIOUS', 
	 	function() { //On click...
			// console.log("CLICKED");
			myDialogBox1.show();
		}
	 );
	 
	 myDialogBox1.show();



	 // this.newButton();
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


		let buttonText = game.add.bitmapText(0, 0, 'testFont', "START", 20);
		buttonText.anchor.setTo(0.5);
		buttonText.align = 'center';
		// this.sceneProps.add(buttonText);

		this.buttonStart.getSprite().addChild(buttonText);
	}

	

	














};

