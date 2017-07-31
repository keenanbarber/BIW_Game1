// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var background = null;
var allowBoardInput = false;
// var button_press_sound;

var	progBar;



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
		window.removeEventListener('resize', currentState.resize);
		currentState = this;
		window.addEventListener('resize', currentState.resize);
		
		// game.scale.setResizeCallback(this.resize, this);

		// Exit the previous scene/state...
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, configuration.transition_time, configuration.transition_easing)); }
	},
	
	preload: function() {
		// button_press_sound = game.add.audio('button_press');
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

		playBackgroundMusic();

		// this.alphaMaskTest();

		// this.progBar.addBarOverlayImage();


		// this.testGroup = game.add.group();
		// this.testGroup.x = game.world.centerX;
		// this.testGroup.y = game.world.centerY;

		// this.groupObj1 = game.add.sprite(0, 0, 'title');
		// this.groupObj1.anchor.setTo(0.5);
		// this.testGroup.add(this.groupObj1);

		// Attempts Text
		// let attemptsTextMessage = "ATTEMPTS REMAINING: " + game_details_data.game_details.attempts_remaining;
		// let attemptsTextStyle = game_details_data.user_interface_settings.score_text_style;
		// this.attemptsText = game.add.text(0, 0, attemptsTextMessage, attemptsTextStyle);
		// this.attemptsText.anchor.setTo(0.5);
		// this.attemptsText.align = 'center';
		// this.attemptsText.fontSize = this.attemptsText.fontSize * devicePixelRatio;
		// this.sceneProps.add(this.attemptsText);


		// Menu Dialog Box
		// this.myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, 400);	 
		// this.myDialogBox1.setBackgroundSprite('popup_background');
		// this.myDialogBox1.addTextSegment("INSTRUCTIONS",
		// 	{ font: "16px font_2", fill: '#ffffff' }, 'center');
		// this.myDialogBox1.addTextSegment("CREATE A SEQUENCE OF 3 OR MORE MARTIANS, VERTICALLY OR HORIZONTALLY. MATCH AS MANY AS YOU CAN IN 30 SECONDS. \nREADY, SET, GO!",
		// 	{ font: "12px font_1", fill: '#ffffff' }, 'center');
		// this.myDialogBox1.addButton('PLAY', null,
		//  	function() { //On click...
		// 		// obj.myDialogBox1.hide();
		// 		// button_press_sound.play();
		// 		score = 0;
		// 		obj.game.state.start("GameState", false, false, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
		// 	}
		// );
		// this.myDialogBox1.addButton('BACK TO ARCADE', null,
		//  	function() { //On click...
		// 		obj.game.state.start("GameOverState", false, false, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
		// 	}
		// );
		// this.sceneProps.add(this.myDialogBox1.getGroup());


		// let graphics = game.add.graphics(0, 0);
		// graphics.beginFill(0x68588C, 0.6);
		// graphics.lineStyle(1, 0x7ffff4, 1);
		// graphics.drawRoundedRect(0, 0, 50, 50, 5); 
		// graphics.endFill();

		// let graphicsTexture = graphics.generateTexture();
		// graphics.destroy();

		// let graphicsSprite = game.add.sprite(50, 50, graphicsTexture);
		// // obj.graphicsSprite.anchor.setTo(0.5);	




		let menuDialogBoxData = game_details_data.dialog_box_settings.menu_dialog_box;
		this.myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, menuDialogBoxData.width, game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding);	
		if(game_details_data.game_sprites.dialog_box_background_sprite != null && game_details_data.game_sprites.dialog_box_background_sprite) {
			this.myDialogBox1.setBackgroundSprite('dialog_box_background_sprite');
		}
		for(let i = 0; i < menuDialogBoxData.text_components.length; i++) { // Add text
			let component = menuDialogBoxData.text_components[i];
			if(component.type === "SCORE") {
				this.myDialogBox1.addTextSegment(score + component.text, component.style, component.align);
			}
			else if(component.type === "REWARD") {
				this.myDialogBox1.addTextSegment(game_details_data.game_details.reward + component.text, component.style, component.align);
			}
			else {
				this.myDialogBox1.addTextSegment(component.text, component.style, component.align);
			}
		}
		this.myDialogBox1.addButton(menuDialogBoxData.play_button_text, null,
		 	function() { //On click...
				score = 0;
				playButtonPressSound();
				obj.game.state.start("GameState", false, false, obj.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.myDialogBox1.getGroup());








		// Enter this new scene
		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, configuration.transition_time, configuration.transition_easing));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			obj.myDialogBox1.show();
		});
		// this.positionComponents(game.width, game.height);
		this.resize();
	},

	update: function() {
		"use strict"; 
		//console.log("Update");

	}, 

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.2) ? true : false;
		if(isLandscape) {
			// Background
			ScaleSprite(background, width, null, 0, 1);
			if(background.height < height) {
				ScaleSprite(background, null, height, 0, 1);
			}
			background.x = game.world.centerX;
			background.y = height;

			// Title
			ScaleSprite(this.title, width, (height/2) + (game_details_data.sprite_adjustment.menu_title_y_offset), 10, 1);
			this.title.x = (width / 2) + (game_details_data.sprite_adjustment.menu_title_x_offset);
			this.title.y = (height/2 - this.title.height/2) + (game_details_data.sprite_adjustment.menu_title_y_offset);

			// Attempts Text
			// this.attemptsText.y = height - 50;
			// this.attemptsText.x = width/2;

			// Dialog Box
			minWidth = game_details_data.dialog_box_settings.menu_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.menu_dialog_box.max_width, 0, game.width); 
			currentState.myDialogBox1.setWidth(game.width, minWidth, maxWidth, 20);
			this.myDialogBox1.setPosition(
				game.world.centerX + (game_details_data.sprite_adjustment.menu_popup_x_offset), 
				game.world.centerY + this.myDialogBox1.getHeight() * (1/2)  + (game_details_data.sprite_adjustment.menu_popup_y_offset));
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
			ScaleSprite(this.title, width, (height/2) + (game_details_data.sprite_adjustment.menu_title_y_offset), 10, 1);
			this.title.x = (width / 2) + (game_details_data.sprite_adjustment.menu_title_x_offset);
			this.title.y = (height/2 - this.title.height/2) + (game_details_data.sprite_adjustment.menu_title_y_offset);

			// Attempts Text
			// this.attemptsText.y = height - 50;
			// this.attemptsText.x = width/2;

			// Dialog Box
			minWidth = game_details_data.dialog_box_settings.menu_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.menu_dialog_box.max_width, 0, game.width); 
			currentState.myDialogBox1.setWidth(game.width, minWidth, maxWidth, 20);
			this.myDialogBox1.setPosition(
				game.world.centerX + (game_details_data.sprite_adjustment.menu_popup_x_offset), 
				game.world.centerY + this.myDialogBox1.getHeight() * (1/2)  + (game_details_data.sprite_adjustment.menu_popup_y_offset));
		}
		// console.log("[ " + this.progBar.getGroup().width + ", " + this.progBar.getGroup().height + " ]");
	},

	resize: function() {
		"use strict";
		updateGameWindow(game);



		let scaleManager = game.scale;
		let width = scaleManager.width; 
		let height = scaleManager.height;

		currentState.positionComponents(width, height);

		// console.log("GAME [" + width + ", " + height + "]");
		// console.log("WINDOW [" + window.innerWidth + ", " + window.innerHeight + "]");
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

	alphaMaskTest: function() {
		// graphics = game.add.graphics(0,0);
		// graphics.beginFill('#ffffff', 1);
		// graphics.drawRoundedRect(0, 0, 100, 30, 10);
		// graphics.endFill();
		// graphicsTexture = graphics.generateTexture();
		// graphics.destroy();

		// let mask = game.add.sprite(0, 0, 'test');

		// let toBeMasked = game.add.sprite(300, 300, 'background_image');


		// //	Create a new bitmap data the same size as our picture
		// var bmd = game.make.bitmapData(toBeMasked.width, toBeMasked.height);

		// //	And create an alpha mask image by combining pic and mask from the cache
		// bmd.alphaMask('background_image', 'test');

		// game.add.image(100, 100, bmd);
		// mask.destroy();
		// toBeMasked.destroy();

		// let pixels = [];

		// ***********************

		// let mask_bmd = game.make.bitmapData();
	 //    mask_bmd.load(gameTileDetails[0].key);
	 //    mask_bmd.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5);
	 //    mask_bmd.processPixelRGB(this.forEachPixel, this);
	 //    game.cache.addBitmapData('new_mask', mask_bmd);

	 //    let toBeMasked = game.add.sprite(0, 0, 'title');

	 //    let bmd = game.make.bitmapData(toBeMasked.width, toBeMasked.height);
	 //    bmd.alphaMask('title', game.cache.getBitmapData('new_mask'));
	 //    game.add.image(0, 0, bmd);
	 //    toBeMasked.destroy();

	 	// ***********************

	 	// this.tileSprite = game.add.tileSprite(0, 0, 300, 300, 'background_image');
	 	// this.tileSprite.tilePosition.x = 0;
	 	// this.tileSprite.tilePosition.y = 0;

	 	// ***********************

		// let mask_bmd = game.make.bitmapData();
		// mask_bmd.load('test');
		// mask_bmd.addToWorld(0, 0, 0, 0);
		// mask_bmd.processPixelRGB(this.forEachPixel, this);
		// game.cache.addBitmapData('new_mask', mask_bmd);

		// let bmd = game.make.bitmapData(toBeMasked.width, toBeMasked.height);


	 	// let toBeMasked = game.add.sprite(200, 200, 'test');
	 	// let mask = game.add.graphics(200, 200);
	 	// mask.beginFill(0xffffff);
	 	// mask.drawCircle(0, 0, 100);
	 	// // let mask = game.add.sprite(0, 0, game.cache.getBitmapData('new_mask'));
	 	// toBeMasked.mask = mask;

	 	// mask.x = 0;
	 	// mask.y = 0;
	 	// toBeMasked.x = 0;
	 	// toBeMasked.y = -100;

	 	// ***********************

	 	// create our sillhouette from the original player image
		// progBar = NewProgressBar2();
		// progBar.setFillPercent(100);
	}

};

// https://phaser.io/examples/v2/bitmapdata/alpha-mask

// https://phaser.io/docs/2.6.2/Phaser.Graphics.html












