// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 


MyGame.OptionsState = function( game ) {
	"use strict"; 
};


MyGame.OptionsState.prototype = {

	init: function( previousStateProps, oldSceneTransition, newSceneTransition ) {
		"use strict";

		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Add events to check for swipe and resize
		this.game.input.onDown.add( this.start_swipe, this );
		this.game.input.onUp.add( this.end_swipe, this );
		window.removeEventListener( 'resize', currentState.resize );
		currentState = this;
		window.addEventListener( 'resize', currentState.resize );

		// State Specific Variables
		// ...
		
		// Exit the previous scene/state...
		if( previousStateProps ) { ExitPreviousScene( previousStateProps, TranslateTween( this.oldSceneTransition, configuration.transition_time, configuration.transition_easing ) ); }
	},

	preload: function() {

	},

	create: function() {
		"use strict"; 

		// Add events to check for swipe
		currentState.game.input.onDown.add( currentState.start_swipe, currentState );
		currentState.game.input.onUp.add( currentState.end_swipe, currentState );

		currentState.sceneProps = game.add.group();


		// Scene Elements ( make sure to add them to the scene props )
		// ...
		

		// Enter this new scene
		EnterNewScene( currentState.sceneProps, TranslateTween( currentState.newSceneTransition, configuration.transition_time, configuration.transition_easing ) );
		tweenManager.callOnComplete( function() { // When the scene transition is finished...
			
		} );
		currentState.resize();
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	},

	positionComponents: function( width, height ) {
		let isLandscape = ( game.height / game.width < 1.3 ) ? true : false;
		if( isLandscape ) { // If the game is in landscape, position the elements in this way...

		}
		else { // If the game is in portrait, position the elements in this way...

		}
	},

	resize: function( sm, parentBounds ) {
		"use strict";
		// console.log( 'Resizing.' );
		UpdateGameWindow(game);

		let scaleManager = sm;
		let width = sm.width; 
		let height = sm.height;

		currentState.positionComponents( width, height );
	},

	start_swipe: function( pointer ) {
		"use strict";
	    //console.log( 'Press down.' );	    
	    currentState.start_swipe_point = new Phaser.Point( pointer.x, pointer.y );
	},

	end_swipe: function( pointer ) {
		"use strict";	
	    //console.log( 'Press up.' );
	    if( currentState.start_swipe_point != null && currentState.end_swipe_point == null ) {
		    var swipe_length; 
		    currentState.end_swipe_point = new Phaser.Point( pointer.x, pointer.y );
		    swipe_length = Phaser.Point.distance( currentState.end_swipe_point, currentState.start_swipe_point );

		    // if the swipe length is greater than the minimum, a swipe is detected
		    if ( swipe_length >= configuration.min_swipe_length ) {
		        let calculatedSwipeDirectionVector = new Phaser.Point( currentState.end_swipe_point.x - currentState.start_swipe_point.x, currentState.end_swipe_point.y - currentState.start_swipe_point.y ).normalize();
			    currentState.findDirectionOfSwipe( calculatedSwipeDirectionVector);
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
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = 'RIGHT';
		}

		currentVector = new Phaser.Point( 0, -1 );
		dist = d.distance( currentVector );
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = 'UP';
		}

		currentVector = new Phaser.Point( 0, 1 );
		dist = d.distance( currentVector );
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = 'DOWN';
		}

		console.log( 'Swipe: ' + bestVector );
		return bestVector;
	} 
};












