// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var background = null;


MyGame.MenuState = function() {
	'use strict'; 
};

MyGame.MenuState.prototype = {
	init: function( previousStateProps, oldSceneTransition, newSceneTransition ) {
		'use strict';

		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Add events to check for swipe and resize
		this.game.input.onDown.add( this.start_swipe, this );
		this.game.input.onUp.add( this.end_swipe, this );
		window.removeEventListener( 'resize', currentState.resize );
		currentState = this;
		window.addEventListener( 'resize', currentState.resize );
		
		// Exit the previous scene/state...
		if( previousStateProps ) { ExitPreviousScene( previousStateProps, TranslateTween( this.oldSceneTransition, configuration.transition_time, configuration.transition_easing ) ); }
	},
	
	preload: function() {
		// button_press_sound = game.add.audio('button_press');
	},

	create: function() {
		'use strict'; 
		currentState.sceneProps = game.add.group();

		// Add background if it doesn't already exist
		if( background == null ) {
			background = game.add.sprite( game.world.centerX, game.world.centerY, 'background_image' );
			background.anchor.setTo( 0.5, 1 );
			game.world.sendToBack( background );
		}

		playBackgroundMusic();

		// Audio Toggle Button
		currentState.audioToggle = ToggleButton( 50, 50, 80, 80, 'audio_on_sprite', 'audio_off_sprite' );
		currentState.audioToggle.setBehaviors(
			function() { // Toggle On
				game.sound.mute = false;
			}, 
			function() { // Toggle Off
				game.sound.mute = true;
			}
		);
		currentState.sceneProps.add( currentState.audioToggle.getGroup() );


		// Creates DialogBox based on JSON file data. 
		let menuDialogBoxData = game_details_data.dialog_box_settings.menu_dialog_box;
		currentState.myDialogBox1 = DialogBox( game.world.centerX, game.world.centerY, menuDialogBoxData.width );
		// currentState.myDialogBox1.setBackgroundSprite( 'dialog_box_background_sprite' );	
		currentState.myDialogBox1.setSpacing( game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding, game_details_data.dialog_box_settings.body_button_padding, 10 ); // contentsPadding, buttonTextWidthPadding, textButtonSpacing, buttonSpacing
		for( let i = 0; i < menuDialogBoxData.text_components.length; i++ ) { // Add text
			let component = menuDialogBoxData.text_components[i];
			if( component.type === 'SCORE' ) {
				currentState.myDialogBox1.addTextSegment( score + component.text, component.style, component.align, component.y_pos_offset );
			}
			else if( component.type === 'REWARD' ) {
				currentState.myDialogBox1.addTextSegment( game_details_data.game_details.reward + component.text, component.style, component.align, component.y_pos_offset );
			}
			else {
				currentState.myDialogBox1.addTextSegment( component.text, component.style, component.align, component.y_pos_offset );
			}
		}
		currentState.myDialogBox1.addButton( menuDialogBoxData.play_button_text, null,
		 	function() { //On click...
				score = 0;
				playButtonPressSound();
				currentState.game.state.start( 'GameState', false, false, currentState.sceneProps, 'CENTER_TO_LEFT', 'RIGHT_TO_CENTER' );
			}
		);
		currentState.sceneProps.add( currentState.myDialogBox1.getGroup() );

		// Title
		currentState.title = game.add.sprite( game.world.centerX, game.world.centerY/2, 'title' );
		currentState.title.anchor.setTo( 0.5 );
		currentState.sceneProps.add( currentState.title );


		// Enter this new scene
		EnterNewScene( currentState.sceneProps, TranslateTween( currentState.newSceneTransition, configuration.transition_time, configuration.transition_easing ) );
		tweenManager.callOnComplete( function() { 
			currentState.myDialogBox1.show();
		} );
		currentState.resize();
	},

	update: function() {
		'use strict'; 
		//console.log( 'Update' );
	}, 

	positionComponents: function( width, height ) {
		

		let isLandscape = ( game.height / game.width < 1.2 ) ? true : false;
		if( isLandscape ) {
			// Background
			ScaleSprite( background, width, null, 0, 1 );
			if( background.height < height ) {
				ScaleSprite( background, null, height, 0, 1 );
			}
			background.x = game.world.centerX;
			background.y = height;

			// Audio Toggle Button
			currentState.audioToggle.setPosition( 50, 50 );

			// Dialog Box
			currentState.myDialogBox1.setPosition( 
			game.world.centerX + ( game_details_data.sprite_adjustment.menu_popup_x_offset ), 
			game.world.centerY + currentState.myDialogBox1.getHeight() * ( 1 / 2 )  + ( game_details_data.sprite_adjustment.menu_popup_y_offset ) );

			// Title
			ScaleSprite( currentState.title, width, ( height/2 ) + ( game_details_data.sprite_adjustment.menu_title_y_offset ), 10, 1 );
			currentState.title.x = ( width / 2 ) + ( game_details_data.sprite_adjustment.menu_title_x_offset );
			currentState.title.y = ( height/2 - currentState.title.height/2 ) + ( game_details_data.sprite_adjustment.menu_title_y_offset );
		}
		else {
			// Background
			ScaleSprite( background, width, null, 0, 1 );
			if(background.height < height) {
				ScaleSprite( background, null, height, 0, 1 );
			}
			background.x = game.world.centerX;
			background.y = height;

			// Audio Toggle Button
			currentState.audioToggle.setPosition( 50, 50 );

			// Dialog Box
			currentState.myDialogBox1.setPosition( 
			game.world.centerX + ( game_details_data.sprite_adjustment.menu_popup_x_offset ), 
			game.world.centerY + currentState.myDialogBox1.getHeight() * ( 1 / 2 )  + ( game_details_data.sprite_adjustment.menu_popup_y_offset ) );

			// Title
			ScaleSprite( currentState.title, width, ( height/2 ) + ( game_details_data.sprite_adjustment.menu_title_y_offset ), 10, 1 );
			currentState.title.x = ( width / 2 ) + ( game_details_data.sprite_adjustment.menu_title_x_offset );
			currentState.title.y = ( height/2 - currentState.title.height/2 ) + ( game_details_data.sprite_adjustment.menu_title_y_offset );
		}
	},

	resize: function() {
		'use strict';
		updateGameWindow( game );

		let scaleManager = game.scale;
		let width = scaleManager.width; 
		let height = scaleManager.height;

		currentState.positionComponents( width, height );
	},

	start_swipe: function( pointer ) {
		'use strict';
	    //console.log( 'Press down.' );	    
	    currentState.start_swipe_point = new Phaser.Point( pointer.x, pointer.y );
	},

	end_swipe: function( pointer ) {
		'use strict';	
	    //console.log( 'Press up.' );
	    if( currentState.start_swipe_point != null && currentState.end_swipe_point == null ) {
		    var swipe_length; 
		    currentState.end_swipe_point = new Phaser.Point( pointer.x, pointer.y );
		    swipe_length = Phaser.Point.distance( currentState.end_swipe_point, currentState.start_swipe_point );

		    // console.log( swipe_length );
		    // if the swipe length is greater than the minimum, a swipe is detected
		    if ( swipe_length >= configuration.min_swipe_length ) {
		        let calculatedSwipeDirectionVector = new Phaser.Point( currentState.end_swipe_point.x - currentState.start_swipe_point.x, currentState.end_swipe_point.y - currentState.start_swipe_point.y ).normalize();
			    currentState.findDirectionOfSwipe( calculatedSwipeDirectionVector );
		    }
		}

	    currentState.end_swipe_point = null;
	    currentState.start_swipe_point = null;
	},

	findDirectionOfSwipe: function( d ) {
		/* Could be made more efficient, but it works for now. */
		let bestVector = null;
		let bestDist = 0;
		let currentVector = null;
		let dist = 0;

		currentVector = new Phaser.Point( -1, 0 );
		bestDist = d.distance( currentVector );
		bestVector = 'LEFT';

		currentVector = new Phaser.Point( 1, 0 );
		dist = d.distance( currentVector );
		if( dist < bestDist ) {
			bestDist = dist;
			bestVector = 'RIGHT';
		}

		currentVector = new Phaser.Point( 0, -1 );
		dist = d.distance( currentVector );
		if( dist < bestDist ) {
			bestDist = dist;
			bestVector = 'UP';
		}

		currentVector = new Phaser.Point( 0, 1 );
		dist = d.distance( currentVector );
		if( dist < bestDist ) {
			bestDist = dist;
			bestVector = 'DOWN';
		}

		console.log( 'Swipe: ' + bestVector );
		return bestVector;
	}

};











