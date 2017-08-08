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
		window.removeEventListener('resize', currentState.resize);
		currentState = this;
		window.addEventListener('resize', currentState.resize);

		// State Specific Variables
		this.MINIMUM_SWIPE_LENGTH = 40;

		// Exit the previous scene/state...
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, 1000, configuration.transition_easing)); }
	},
	
	preload: function() {
		
	},

	create: function() {
		"use strict"; 
		this.sceneProps = game.add.group();

		// Title
		this.title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'end_game_image');
		this.title.anchor.setTo(0.5);
		this.sceneProps.add(this.title);


		// READ FROM JSON FILE
		this.createScoreDialogBox(); // SCORE DIALOG BOX
		this.createRewardDialogBox(); // REWARD DIALOG BOX

		// Enter this new scene
		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, configuration.transition_easing));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			currentState.scoreDialogBox.show();
		});
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

			// Dialog Box
			minWidth = game_details_data.dialog_box_settings.default_score_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.default_score_dialog_box.max_width, 0, game.width); 
			currentState.scoreDialogBox.setWidth(game.width, minWidth, maxWidth, 20);
			this.scoreDialogBox.setPosition(game.world.centerX, game.world.centerY + this.scoreDialogBox.getHeight() * (1/3));


			minWidth = game_details_data.dialog_box_settings.reward_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.reward_dialog_box.max_width, 0, game.width); 
			currentState.rewardDialogBox.setWidth(game.width, minWidth, maxWidth, 20);
			this.rewardDialogBox.setPosition(game.world.centerX, game.world.centerY + this.rewardDialogBox.getHeight() * (1/3));

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

			// Dialog Box
			minWidth = game_details_data.dialog_box_settings.default_score_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.default_score_dialog_box.max_width, 0, game.width); 
			currentState.scoreDialogBox.setWidth(game.width, minWidth, maxWidth, 20);
			this.scoreDialogBox.setPosition(game.world.centerX, game.world.centerY + this.scoreDialogBox.getHeight() * (1/3));


			minWidth = game_details_data.dialog_box_settings.reward_dialog_box.min_width; 
			maxWidth = BoundNumber(game_details_data.dialog_box_settings.reward_dialog_box.max_width, 0, game.width); 
			currentState.rewardDialogBox.setWidth(game.width, minWidth, maxWidth, 20);
			this.rewardDialogBox.setPosition(game.world.centerX, game.world.centerY + this.rewardDialogBox.getHeight() * (1/3));

		}
	},

	resize: function(state) {
		"use strict";
		updateGameWindow(game);

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
	}, 

	createScoreDialogBox: function() {
		let scoreDialogBoxData;
		if(score > game_details_data.game_details.high_score && game_details_data.game_details.high_score != null && game_details_data.game_details.high_score)
			scoreDialogBoxData = game_details_data.dialog_box_settings.beat_high_score_dialog_box;
		else
			scoreDialogBoxData = game_details_data.dialog_box_settings.default_score_dialog_box;


		this.scoreDialogBox = DialogBox(game.world.centerX, game.world.centerY, scoreDialogBoxData.width, game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding);	
		if(game_details_data.game_sprites.dialog_box_background_sprite != null && game_details_data.game_sprites.dialog_box_background_sprite) {
			this.scoreDialogBox.setBackgroundSprite('dialog_box_background_sprite');
		}
		for(let i = 0; i < scoreDialogBoxData.text_components.length; i++) { // Add text
			let component = scoreDialogBoxData.text_components[i];
			if(component.type === "SCORE") 
				this.scoreDialogBox.addTextSegment(score + component.text, component.style, component.align, component.line_spacing_offset);
			else if(component.type === "REWARD") 
				this.scoreDialogBox.addTextSegment(game_details_data.game_details.reward + component.text, component.style, component.align, component.line_spacing_offset);
			else 
				this.scoreDialogBox.addTextSegment(component.text, component.style, component.align, component.line_spacing_offset);
		}
		this.scoreDialogBox.addButton(scoreDialogBoxData.continue_button_text, null,
		 	function() { //On click...
		 		playButtonPressSound();
		 		currentState.scoreDialogBox.hide();
				currentState.rewardDialogBox.show();
			}
		);
		this.sceneProps.add(this.scoreDialogBox.getGroup());

		minWidth = game_details_data.dialog_box_settings.default_score_dialog_box.min_width; 
		maxWidth = BoundNumber(game_details_data.dialog_box_settings.default_score_dialog_box.max_width, 0, game.width); 
		this.scoreDialogBox.setWidth(game.width, minWidth, maxWidth, 50);
	}, 

	createRewardDialogBox: function() {
		let rewardDialogBoxData;
		if(game_details_data.game_details.reward != 0 && game_details_data.game_details.reward != null && game_details_data.game_details.reward)
			rewardDialogBoxData = game_details_data.dialog_box_settings.reward_dialog_box;
		else 
			rewardDialogBoxData = game_details_data.dialog_box_settings.no_reward_dialog_box;


		this.rewardDialogBox = DialogBox(game.world.centerX, game.world.centerY, rewardDialogBoxData.width, game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding);	
		if(game_details_data.game_sprites.dialog_box_background_sprite != null && game_details_data.game_sprites.dialog_box_background_sprite) {
			this.rewardDialogBox.setBackgroundSprite('dialog_box_background_sprite');
		}
		for(let i = 0; i < rewardDialogBoxData.text_components.length; i++) { // Add text
			let component = rewardDialogBoxData.text_components[i];
			if(component.type === "SCORE") 
				this.rewardDialogBox.addTextSegment(score + component.text, component.style, component.align, component.line_spacing_offset);
			else if(component.type === "REWARD") 
				this.rewardDialogBox.addTextSegment(game_details_data.game_details.reward + component.text, component.style, component.align, component.line_spacing_offset);
			else 
				this.rewardDialogBox.addTextSegment(component.text, component.style, component.align, component.line_spacing_offset);
		}
		this.rewardDialogBox.addButton(rewardDialogBoxData.continue_button_text, null,
		 	function() { //On click...
		 		playButtonPressSound();
		 		currentState.game.state.start("MenuState", false, false, currentState.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.rewardDialogBox.getGroup());

		minWidth = game_details_data.dialog_box_settings.reward_dialog_box.min_width; 
		maxWidth = BoundNumber(game_details_data.dialog_box_settings.reward_dialog_box.max_width, 0, game.width); 
		this.rewardDialogBox.setWidth(game.width, minWidth, maxWidth, 50);
	}




};























