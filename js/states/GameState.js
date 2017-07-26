// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 


var mouseOverObj; 
var mouseOffObj;
var mouseDownObj; 
var mouseUpObj;

var selectedTile1;
var selectedTile2;
var score = 0; 
var scoreMultiplier = 1;

MyGame.GameState = function(game) {
	"use strict"; 
};

MyGame.GameState.prototype = {

	init: function(previousStateProps, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Add events to check for swipe and resize
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);
		window.removeEventListener('resize', currentState.resize );
		currentState = this;
		window.addEventListener('resize', currentState.resize );
		// game.scale.setResizeCallback(this.resize, this);

		// State Specific Variables
		// this.gameTime = Phaser.Timer.SECOND * 30;
		this.gameTimerRunning = false;

		// Exit the previous scene/state...
		if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, configuration.transition_time, configuration.transition_easing)); }
	},

	preload: function() {
		
	},

	create: function() {
		"use strict"; 
		let obj = this;
		this.sceneProps = game.add.group();

		// Time Display
		let timeDisplayMessage = Math.ceil(configuration.game_duration / 1000) + game_details_data.user_interface_settings.remaining_time_text_extension;
		let timeDisplayStyle = game_details_data.user_interface_settings.remaining_time_style;
		this.timeDisplay = game.add.text(0, 0, timeDisplayMessage, timeDisplayStyle);
		this.timeDisplay.anchor.setTo(1, 1);
		this.timeDisplay.align = 'right';
		// this.timeDisplay.fontSize = this.timeDisplay.fontSize * devicePixelRatio;
		this.sceneProps.add(this.timeDisplay);

		// Score Text
		let scoreTextMessage = game_details_data.user_interface_settings.score_text_text;
		let scoreTextStyle = game_details_data.user_interface_settings.score_text_style;
		this.scoreText = game.add.text(0, 0, scoreTextMessage, scoreTextStyle);
		this.scoreText.anchor.setTo(0, 1);
		this.scoreText.align = 'left';
		// this.scoreText.fontSize = this.scoreText.fontSize * devicePixelRatio;
		this.sceneProps.add(this.scoreText);

		// Score Display
		let scoreDisplayMessage = score;
		let scoreDisplayStyle = { font: "30px font_2", fill: '#ffffff' };
		this.scoreDisplay = game.add.text(0, 0, scoreDisplayMessage, scoreDisplayStyle);
		this.scoreDisplay.anchor.setTo(0, 0.5);
		this.scoreDisplay.align = 'left';
		// this.scoreDisplay.fontSize = this.scoreDisplay.fontSize * devicePixelRatio;
		this.sceneProps.add(this.scoreDisplay);

		// Game Timer
		this.gameTimer = game.time.create();

		// Hint Timer
		this.hintTimer = game.time.create();
		this.hintCallOnComplete = function() {
			this.showHint();
			// this.hintTimer.add(5000, this.hintCallOnComplete, this);
		};
		this.hintTimer.loop(game_details_data.game_details.hint_delay * 1000, this.hintCallOnComplete, this);

		// Progress Bar
		this.progressBar = ProgressBar(300, 20);
		this.sceneProps.add(this.progressBar.getGroup());
		this.progressBar.updateProgress(1);

		// Set up the board
		this.initializeBoard();
		this.initializeTiles();
		this.initializeBoardSelections();

		// Create tiles to show selections
		this.selectedTileSprite1 = game.add.sprite(0, 0, 'selected_tile');
		this.selectedTileSprite1.anchor.setTo(0.5);
		this.selectedTileSprite1.visible = false;
		this.sceneProps.add(this.selectedTileSprite1);
		this.selectedTileSprite2 = game.add.sprite(0, 0, 'selected_tile');
		this.selectedTileSprite2.anchor.setTo(0.5);
		this.selectedTileSprite2.visible = false;
		this.sceneProps.add(this.selectedTileSprite2);

		// Set up dialog boxes (not shown right away)
		this.createStartGameDialogBox();
		this.createEndGameDialogBox();

		// Can't touch the board at the start!
		allowBoardInput = false;
		


		// Enter this new scene
		EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, configuration.transition_time, configuration.transition_easing));
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			obj.startGameDialogBox.show();
		});
		this.resize();
	},

	update: function() {
		"use strict"; 
		// console.log("Update: " + this.timer.duration);
		if(this.gameTimerRunning) {
			this.progressBar.updateProgress( (this.gameTimer.duration)/configuration.game_duration );
			this.updateTimeText( Math.ceil(this.gameTimer.duration / 1000));
		}
	},

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			var availableGridSpace = Math.min(width * 2/3, height);
			let chosenSideLength = Math.max(configuration.board_columns, configuration.board_rows);
			this.calculatedTileSize = (availableGridSpace * 0.8) / chosenSideLength;
			this.horizontalMargin = (width - (configuration.board_columns * this.calculatedTileSize)) / 2;
			this.verticalMargin = (height - (configuration.board_rows * this.calculatedTileSize)) / 2;


			// Progress Bar
			this.progressBar.setWidth((this.calculatedTileSize * configuration.board_columns) * (3/4));
			this.progressBar.setPosition(this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns) - this.progressBar.getWidth(), this.verticalMargin - this.progressBar.getGroup().height);

			// Dialog Boxes
			this.startGameDialogBox.setPosition(game.world.centerX, game.world.centerY);
			this.startGameDialogBox.setWidth(game.width, game.width/2, game.width, 50);
			this.endGameDialogBox.setPosition(game.world.centerX, game.world.centerY);

			// Time Display
			this.timeDisplay.x = this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns);
			this.timeDisplay.y = this.verticalMargin - this.progressBar.getGroup().height * 2;

			// Score Text
			this.scoreText.x = this.horizontalMargin;
			this.scoreText.y = this.verticalMargin - this.progressBar.getGroup().height * 2;

			// Score Display
			this.scoreDisplay.x = this.horizontalMargin;
			this.scoreDisplay.y = this.verticalMargin - this.progressBar.getGroup().height;

			// Board Selection Squares
			this.boardSelectionGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.boardSelectionGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.boardSpriteArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.boardSelectionArray[i][j].getSprite().x = tileX;
						this.boardSelectionArray[i][j].getSprite().y = tileY;
						if(this.boardSelectionArray[i][j] != null)
							ScaleSprite(this.boardSelectionArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, 0, 1);
					}
				}
			}

			// Board
			this.boardSpriteGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.boardSpriteGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.boardSpriteArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.boardSpriteArray[i][j].x = tileX;
						this.boardSpriteArray[i][j].y = tileY;
						if(this.boardSpriteArray[i][j] != null)
							ScaleSprite(this.boardSpriteArray[i][j], this.calculatedTileSize, this.calculatedTileSize, 0, 1);
					}
				}
			}

			// Tiles
			this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.tileArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.tileArray[i][j].setPosition(tileX, tileY);
						if(this.tileArray[i][j].getSprite() != null)
							ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);
					}
				}
			}

			// Background
			ScaleSprite(background, width, null, 0, 1);
			if(background.height < height) {
				ScaleSprite(background, null, height, 0, 1);
			}
			background.x = game.world.centerX;
			background.y = height;

		}
		else {
			var availableGridSpace = width;
			let chosenSideLength = Math.max(configuration.board_columns, configuration.board_rows);
			this.calculatedTileSize = (availableGridSpace * 0.8) / chosenSideLength;
			this.horizontalMargin = (width - (configuration.board_columns * this.calculatedTileSize)) / 2;
			this.verticalMargin = (height - (configuration.board_rows * this.calculatedTileSize)) / 2;


			// Progress Bar
			this.progressBar.setWidth((this.calculatedTileSize * configuration.board_columns) * (3/4));
			this.progressBar.setPosition(this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns) - this.progressBar.getWidth(), this.verticalMargin - this.progressBar.getGroup().height);

			// Dialog Boxes
			this.startGameDialogBox.setPosition(game.world.centerX, game.world.centerY);
			this.startGameDialogBox.setWidth(game.width, game.width/2, game.width, 50);
			this.endGameDialogBox.setPosition(game.world.centerX, game.world.centerY);

			// Time Display
			this.timeDisplay.x = this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns);
			this.timeDisplay.y = this.verticalMargin - this.progressBar.getGroup().height * 2;

			// Score Text
			this.scoreText.x = this.horizontalMargin;
			this.scoreText.y = this.verticalMargin - this.progressBar.getGroup().height * 2;

			// Score Display
			this.scoreDisplay.x = this.horizontalMargin;
			this.scoreDisplay.y = this.verticalMargin - this.progressBar.getGroup().height;

			// Board Selection Squares
			this.boardSelectionGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.boardSelectionGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.boardSpriteArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.boardSelectionArray[i][j].getSprite().x = tileX;
						this.boardSelectionArray[i][j].getSprite().y = tileY;
						if(this.boardSelectionArray[i][j] != null)
							ScaleSprite(this.boardSelectionArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, 0, 1);
					}
				}
			}


			// Board
			this.boardSpriteGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.boardSpriteGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.boardSpriteArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.boardSpriteArray[i][j].x = tileX;
						this.boardSpriteArray[i][j].y = tileY;
						if(this.boardSpriteArray[i][j] != null)
							ScaleSprite(this.boardSpriteArray[i][j], this.calculatedTileSize, this.calculatedTileSize, 0, 1);
					}
				}
			}

			// Tiles
			this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;
			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					if(this.tileArray[i][j] != null) {
						let tileX = i * this.calculatedTileSize;
						let tileY = j * this.calculatedTileSize;

						this.tileArray[i][j].setPosition(tileX, tileY);
						ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);
					}
				}
			}


			// Background
			ScaleSprite(background, width, null, 0, 1);
			if(background.height < height) {
				ScaleSprite(background, null, height, 0, 1);
			}
			background.x = game.world.centerX;
			background.y = height;

		}
	},

	resize: function() {
		"use strict";
		updateGameWindow(game);

		let scaleManager = game.scale;
		let width = scaleManager.width; 
		let height = scaleManager.height;

		currentState.positionComponents(width, height);

		currentState.updateTweens();
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    //this.exitTransition();
	    //this.game.state.start("GameState", false, false, this.game_details_data, this);
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);

	    // this.restartHintTimer();

	    // this.hintTimer.delay = 5000;

	    //Tweenimate_Breathe(this.thing1, 1.5, 1.5, 1200);
	    // tweenManager.stopAllTweens();
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
			    
			    let swipeVec = this.findDirectionOfSwipe(calculatedSwipeDirectionVector);

			    if(selectedTile1 != null & selectedTile2 == null && allowBoardInput) {
			    	let otherTileArrayPosition = new Phaser.Point(selectedTile1.getArrayPosition().x + swipeVec.x, selectedTile1.getArrayPosition().y + swipeVec.y);
			    	if(this.onBoard(otherTileArrayPosition.x, otherTileArrayPosition.y)) {
			    		
			    		selectedTile2 = this.tileArray[ otherTileArrayPosition.x ][ otherTileArrayPosition.y ];

			    		this.placeSelectedSprite(selectedTile2);
			    		this.swapTiles(selectedTile1, selectedTile2, true);
			    	}
			    }

			    // this.showHint();
			    // this.shuffleBoard();
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
		bestVector = currentVector;

		currentVector = new Phaser.Point(1, 0);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = currentVector;
		}

		currentVector = new Phaser.Point(0, -1);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = currentVector;
		}

		currentVector = new Phaser.Point(0, 1);
		dist = d.distance(currentVector);
		if(dist < bestDist) {
			bestDist = dist;
			bestVector = currentVector;
		}

		// console.log("Swipe: " + bestVector);
		return bestVector;
	}, 

	initializeBoard: function() { 
		/* tiles = [ [], [], [], [] ];
		  		     []  []  []  []
		  	 	     []  []  []  []		*/

		var availableGridSpace = game.width;
		this.calculatedTileSize = (availableGridSpace * 0.8) / 6;

		this.horizontalMargin = (game.width - (6 * this.calculatedTileSize)) / 2;
		this.verticalMargin = (game.height - (6 * this.calculatedTileSize)) / 2;
		
		this.boardSpriteArray = [];
		this.boardSpriteGroup = game.add.group();
		

		for(let i = 0; i < configuration.board_columns; i++) {
			this.boardSpriteArray[i] = [];
			for(let j = 0; j < configuration.board_rows; j++) { 
				let tileX = i * this.calculatedTileSize;
				let tileY = j * this.calculatedTileSize;
				
				let tile;
				if(i == 0 || i == configuration.board_columns-1 || j == 0 || j == configuration.board_rows-1) {
					if(i == 0 && j == 0)
						tile = game.add.sprite(tileX, tileY, 'corner_upperleft');
					else if(i == 0 && j == configuration.board_rows-1)
						tile = game.add.sprite(tileX, tileY, 'corner_lowerleft');
					else if(i == configuration.board_columns-1 && j == 0)
						tile = game.add.sprite(tileX, tileY, 'corner_upperright');
					else if(i == configuration.board_columns-1 && j == configuration.board_rows-1)
						tile = game.add.sprite(tileX, tileY, 'corner_lowerright');

					else // If it is not a corner piece but is on the edge...
						tile = game.add.sprite(tileX, tileY, 'board_tile');
				}
				else {
					tile = game.add.sprite(tileX, tileY, 'board_tile');
				}


				tile.anchor.setTo(0.5);
				
				this.boardSpriteArray[i][j] = tile;
				this.boardSpriteGroup.add(tile);

				ScaleSprite(tile, this.calculatedTileSize, this.calculatedTileSize, 0, 1);
			}
		}
		this.boardSpriteGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
		this.boardSpriteGroup.y = this.verticalMargin + this.calculatedTileSize/2;

		this.sceneProps.add(this.boardSpriteGroup);
	},

	initializeTiles: function() {
		/* tiles = [ [], [], [], [] ];
		  		     []  []  []  []
		  	 	     []  []  []  []		*/

		var availableGridSpace = game.width;
		this.calculatedTileSize = (availableGridSpace * 0.8) / 6;

		this.horizontalMargin = (game.width - (6 * this.calculatedTileSize)) / 2;
		this.verticalMargin = (game.height - (6 * this.calculatedTileSize)) / 2;
		
		this.tileArray = [];
		this.tileGroup = game.add.group();
		

		for(let i = 0; i < configuration.board_columns; i++) {
			this.tileArray[i] = [];
			for(let j = 0; j < configuration.board_rows; j++) { 
				let tileX = i * this.calculatedTileSize;
				let tileY = j * this.calculatedTileSize;
				
				let tile = this.placeTile(tileX, tileY);
				
				this.tileArray[i][j] = tile;
				this.tileGroup.add(tile.getSprite());
				tile.setArrayPosition(i, j);

				ScaleSprite(tile.getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);
			}
		}
		this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
		this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;

		this.sceneProps.add(this.tileGroup);
	},

	initializeBoardSelections: function() { // The things that you click on. They are invisible...
		/* tiles = [ [], [], [], [] ];
		  		     []  []  []  []
		  	 	     []  []  []  []		*/

		var availableGridSpace = game.width;
		this.calculatedTileSize = (availableGridSpace * 0.8) / 6;

		this.horizontalMargin = (game.width - (6 * this.calculatedTileSize)) / 2;
		this.verticalMargin = (game.height - (6 * this.calculatedTileSize)) / 2;
		
		this.boardSelectionArray = [];
		this.boardSelectionGroup = game.add.group();
		
		let graphics = game.add.graphics(0, 0);
		graphics.beginFill(0xffffff, 0.0);
		graphics.drawRect(0, 0, this.calculatedTileSize, this.calculatedTileSize); 
		graphics.endFill();
		let graphicsTexture = graphics.generateTexture();
		graphics.destroy();

		for(let i = 0; i < configuration.board_columns; i++) {
			this.boardSelectionArray[i] = [];
			for(let j = 0; j < configuration.board_rows; j++) { 
				let tileX = i * this.calculatedTileSize;
				let tileY = j * this.calculatedTileSize;

				let newTile = this.boardSprite(tileX, tileY, graphicsTexture);
				newTile.setArrayPosition(i, j);
				newTile.getSprite().anchor.setTo(0.5);
				newTile.getSprite().inputEnabled = true;

				let state = this;
				newTile.getSprite().events.onInputOver.add(function() { // On Input Over
					if(allowBoardInput) {
						game.canvas.style.cursor = "pointer";
					}
				}, this);
				newTile.getSprite().events.onInputOut.add(function() { // On Input Out
					if(allowBoardInput) {
						game.canvas.style.cursor = "default";
					}
				}, this);
				newTile.getSprite().events.onInputDown.add(function() { // On Input Down
					if(allowBoardInput) {
						// console.log("You clicked at array position " + newTile.getArrayPosition());

						if(tweenManager.getSize() == 0 && (selectedTile1 == null || selectedTile2 == null)) {
							// console.log("Down");
							playTileSelectSound();

							if(selectedTile1 == null) { // If there is no selected tile, save this in selectedTile1.
								selectedTile1 = newTile;
								state.placeSelectedSprite(selectedTile1);
							} 
							else {	// If selectedTile1 is full, save in selectedTile2 and...
								selectedTile2 = newTile;
								state.placeSelectedSprite(selectedTile2);
								if(selectedTile1 === selectedTile2) { // If the two selected tiles are the same, reset.
									selectedTile1 = null; 
									selectedTile2 = null;
									state.hideSelectedSprites();
									return;
								}

								let differenceInX = Math.abs(selectedTile1.getArrayPosition().x - selectedTile2.getArrayPosition().x);
								let differenceInY = Math.abs(selectedTile1.getArrayPosition().y - selectedTile2.getArrayPosition().y);
								let sum = differenceInX + differenceInY;
								if(sum == 1) { // If the two tiles are right next to eachother, swap and reset.
									state.swapTiles(selectedTile1, selectedTile2, true);
								}
								else { // If the two tiles are not right next to eachother, don't save the second selection.
									selectedTile2 = null;
									state.hideSelectedSprites();
									selectedTile1 = newTile;
									state.placeSelectedSprite(selectedTile1);
								}
							}
						}
					}

				}, this);
				newTile.getSprite().events.onInputUp.add(function() { // On Input Up
					if(allowBoardInput) {

					}
				}, this);

				
				this.boardSelectionArray[i][j] = newTile;
				this.boardSelectionGroup.add(newTile.getSprite());
			}
		}
		this.boardSelectionGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
		this.boardSelectionGroup.y = this.verticalMargin + this.calculatedTileSize/2;

		this.sceneProps.add(this.boardSelectionGroup);
	},

	placeTile: function(x, y) {
		let num = RandomBetween(0, gameTileDetails.length-1); // Random tile number.
		let tile = this.boardSprite(x, y, gameTileDetails[num].key); // The resulting tile.
		tile.getSprite().anchor.setTo(0.5);

		if(gameTileDetails[num].disappear_animation_frames.length != 0) {
			tile.animator = Animator(tile.getSprite());
			tile.animator.newAnimation('disappear', gameTileDetails[num].disappear_animation_frames);
		}
		return tile;
	},

	boardSprite: function(x, y, spriteKey) {
		let obj = {};

		obj.arrayPositionX = 0;
		obj.arrayPositionY = 0;
		obj.sprite = game.add.sprite(x, y, spriteKey);
		obj.key = spriteKey;

		obj.fallingTween = null;
		obj.animator = null;

		obj.getSprite = function() {
			return this.sprite;
		};
		obj.getArrayPosition = function() {
			return new Phaser.Point(this.arrayPositionX, this.arrayPositionY);
		};
		obj.getPosition = function() {
			return new Phaser.Point(this.sprite.x, this.sprite.y);
		};
		obj.setArrayPosition = function(x, y) {
			this.arrayPositionX = x; 
			this.arrayPositionY = y;
		};
		obj.setPosition = function(x, y) {
			this.sprite.x = x; 
			this.sprite.y = y;
		};
		obj.setFallingTween = function(val) {
			this.fallingTween = val;
		};
		obj.getFallingTween = function() {
			return this.fallingTween;
		};
		obj.getTag = function() {
			return this.key;
		};

		return obj;
	},

	placeSelectedSprite: function(t) {
		if(!this.selectedTileSprite1.visible) {
			this.selectedTileSprite1.visible = true;
			this.selectedTileSprite1.x = t.getArrayPosition().x * this.calculatedTileSize + this.horizontalMargin + this.calculatedTileSize/2;
			this.selectedTileSprite1.y = t.getArrayPosition().y * this.calculatedTileSize + this.verticalMargin + this.calculatedTileSize/2;

			ScaleSprite(this.selectedTileSprite1, this.calculatedTileSize, this.calculatedTileSize, 0, 1);
		}
		else if(!this.selectedTileSprite2.visible) {
			this.selectedTileSprite2.visible = true;
			this.selectedTileSprite2.x = t.getArrayPosition().x * this.calculatedTileSize + this.horizontalMargin + this.calculatedTileSize/2;
			this.selectedTileSprite2.y = t.getArrayPosition().y * this.calculatedTileSize + this.verticalMargin + this.calculatedTileSize/2;

			ScaleSprite(this.selectedTileSprite2, this.calculatedTileSize, this.calculatedTileSize, 0, 1);
		}
	},
	hideSelectedSprites: function() {
		this.selectedTileSprite1.visible = false;
		this.selectedTileSprite2.visible = false;
	},

	/*_______________________________________
		Swap Tiles 							|
	_________________________________________
			The function swaps two given tiles 
			by switching their array positions 
			and their physical positions.
	________________________________________*/
	swapTiles: function(t1, t2, scanOnComplete) {
		let swapDuration = 200;
		let x1 = t1.getArrayPosition().x;
		let y1 = t1.getArrayPosition().y;
		let x2 = t2.getArrayPosition().x;
		let y2 = t2.getArrayPosition().y;

		let temp = this.tileArray[x1][y1];
		this.tileArray[x1][y1] = this.tileArray[ x2 ][ y2 ];
		this.tileArray[x1][y1].setArrayPosition(x1, y1);
		this.tileArray[x2][y2] = temp;
		this.tileArray[x2][y2].setArrayPosition(x2, y2);

		selectedTile1 = this.tileArray[x1][y1];
		selectedTile2 = this.tileArray[x2][y2];
	
		let tween1 = game.add.tween(this.tileArray[ x1 ][ y1 ].getSprite()).to({ x: this.tileArray[ x2 ][ y2 ].getPosition().x, y: this.tileArray[x2][y2].getPosition().y }, swapDuration, Phaser.Easing.Circular.InOut, true);
		let tween2 = game.add.tween(this.tileArray[ x2 ][ y2 ].getSprite()).to({ x: this.tileArray[ x1 ][ y1 ].getPosition().x, y: this.tileArray[x1][y1].getPosition().y }, swapDuration, Phaser.Easing.Circular.InOut, true);
		tweenManager.addTween(tween1);
		tweenManager.addTween(tween2);		
		
		let obj = this;
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			// console.log("All tweens completed.");
			obj.hideSelectedSprites();
			if(scanOnComplete)
				obj.scanBoard();
		});

	},

	updateTweens: function() {
		for(let x = 0; x < configuration.board_columns; x++) { // For each column...
			for(let y = 0; y < configuration.board_rows; y++) { // Go down the column...
				if(this.tileArray[ x ][ y ] != null) {

					let theTween = this.tileArray[ x ][ y ].fallingTween; 
					if(theTween && theTween != null) {

						var tweenDatum = this.tileArray[ x ][ y ].getFallingTween().timeline[this.tileArray[ x ][ y ].getFallingTween().current];
						var remaining = tweenDatum.duration - tweenDatum.dt;

						let tileX = x * this.calculatedTileSize;
						let tileY = y * this.calculatedTileSize;

						// this.tileArray[i][j].setPosition(tileX, tileY);

						this.tileArray[ x ][ y ].getFallingTween().isPaused = false; 
						this.tileArray[ x ][ y ].getFallingTween().isRunning = false;
						this.tileArray[ x ][ y ].getFallingTween().timeline.length = 0;
						this.tileArray[ x ][ y ].getFallingTween().to({ y: tileY });
						this.tileArray[ x ][ y ].getFallingTween().start();
					}

					

				}
			}
		}


	},

	/*_______________________________________
		Check Moves							|
	_________________________________________
			This is similar-ish to scan 
			board. It will go through the 
			board and look for potential 
			moves. It will return an array of 
			objects containing the potential 
			moves.
	________________________________________*/
	checkMoves: function() {
		let possibleMoves = [];

		for(let x = 0; x < configuration.board_columns; x++) { // For each column...
			for(let y = 0; y < configuration.board_rows - 2; y++) { // Go down the column... 	(Might not need to check going up the column?)
				let firstTile = this.tileArray[ x ][ y ];
				let secondTile = this.tileArray[ x ][ y+1 ];
				let thirdTile = this.tileArray[ x ][ y+2 ];

				if(firstTile.getTag() === secondTile.getTag()) { 		// [ X X _ ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(secondTile, null, thirdTile));
				}
				else if(secondTile.getTag() === thirdTile.getTag()) { 	// [ _ X X ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(secondTile, null, firstTile));
				}
				else if(firstTile.getTag() === thirdTile.getTag()) { 	// [ X _ X ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(firstTile, thirdTile, secondTile));
				}
			}
		}

		for(let y = 0; y < configuration.board_rows; y++) { // For each row...
			for(let x = 0; x < configuration.board_columns - 2; x++) { // Go across the row...
				let firstTile = this.tileArray[ x ][ y ];
				let secondTile = this.tileArray[ x+1 ][ y ];
				let thirdTile = this.tileArray[ x+2 ][ y ];

				if(firstTile.getTag() === secondTile.getTag()) { 		// [ X X _ ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(secondTile, null, thirdTile));
				}
				else if(secondTile.getTag() === thirdTile.getTag()) { 	// [ _ X X ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(secondTile, null, firstTile));
				}
				else if(firstTile.getTag() === thirdTile.getTag()) { 	// [ X _ X ] VERTICAL 
					possibleMoves.push.apply(possibleMoves, this.checkForSimilarNearbyTile(firstTile, thirdTile, secondTile));
				}
			}
		}

		return possibleMoves;
	}, 

	/*_______________________________________
		Check For Similar Nearby Tile		|		
	_________________________________________
			After being given a possible
			tile to replace and some tiles to 
			potentially ignore, this function 					   [ ]
			will search the nearby tiles of 					[I][P][ ]
			the possible tile to replace to 					   [ ]
			see if there are any similar tiles. 
	________________________________________*/
	checkForSimilarNearbyTile: function(ignoreTile1, ignoreTile2, possibleTileToReplace) {
		let possibleMoves = [];

		let tileType = ignoreTile1.getTag();

		let x = possibleTileToReplace.getArrayPosition().x-1;
		let y = possibleTileToReplace.getArrayPosition().y;
		possibleMoves.push.apply(possibleMoves, this.checkTile(tileType, x, y, ignoreTile1, ignoreTile2, possibleTileToReplace));

		x = possibleTileToReplace.getArrayPosition().x+1;
		y = possibleTileToReplace.getArrayPosition().y;
		possibleMoves.push.apply(possibleMoves, this.checkTile(tileType, x, y, ignoreTile1, ignoreTile2, possibleTileToReplace));

		x = possibleTileToReplace.getArrayPosition().x;
		y = possibleTileToReplace.getArrayPosition().y-1;
		possibleMoves.push.apply(possibleMoves, this.checkTile(tileType, x, y, ignoreTile1, ignoreTile2, possibleTileToReplace));

		x = possibleTileToReplace.getArrayPosition().x;
		y = possibleTileToReplace.getArrayPosition().y+1;
		possibleMoves.push.apply(possibleMoves, this.checkTile(tileType, x, y, ignoreTile1, ignoreTile2, possibleTileToReplace));

		return possibleMoves;
	},

	checkTile: function(tileType, x, y, ignoreTile1, ignoreTile2, possibleTileToReplace) {
		let tileMoves = [];

		if(this.onBoard(x, y) && this.tileArray[ x ][ y ] != null) { // If on the board...
			if( (x != possibleTileToReplace.getArrayPosition().x || y != possibleTileToReplace.getArrayPosition().y) &&
				(x != ignoreTile1.getArrayPosition().x || y != ignoreTile1.getArrayPosition().y) ) {
				if(ignoreTile2) {
					if(x != ignoreTile2.getArrayPosition().x || y != ignoreTile2.getArrayPosition().y) {
						if(this.tileArray[ x ][ y ].getTag() === tileType) {
							// console.log("Tile [" + x + ", " + y + "] could be put at tile [" + possibleTileToReplace.getArrayPosition().x + ", " + possibleTileToReplace.getArrayPosition().y + "]. ");
							let moveObj = {};
							moveObj.tileToMove = this.tileArray[ x ][ y ];
							moveObj.placementLocation = possibleTileToReplace;
							tileMoves.push(moveObj);
						}
					}
				}
				else {
					if(this.tileArray[ x ][ y ].getTag() === tileType) {
						// console.log("Tile [" + x + ", " + y + "] could be put at tile [" + possibleTileToReplace.getArrayPosition().x + ", " + possibleTileToReplace.getArrayPosition().y + "]. ");
						let moveObj = {};
						moveObj.tileToMove = this.tileArray[ x ][ y ];
						moveObj.placementLocation = possibleTileToReplace;
						tileMoves.push(moveObj);
					}
				}
			}
		}

		return tileMoves;
	},

	onBoard: function(x, y) {
		return (x >= 0 && x < configuration.board_columns && y >= 0 && y < configuration.board_rows);
	},

	/*_______________________________________
		Scan Board 							|
	_________________________________________
			The function looks through the 
			board looking for repeated tiles 
			to award points. Keeps track of 
			score multiplier too.
	________________________________________*/
	scanBoard: function() {
		let lastTileType = "";
		let currentTileType = "";
		let foundAnything = false;
		let repeatedTiles = [];

		// console.log("Scanning...");
		for(let i = 0; i < configuration.board_columns; i++) { // For each column...
			for(let j = 0; j < configuration.board_rows; j++) { // Go down the column...
				if(this.tileArray[i][j] != null) {
					lastTileType = currentTileType;
					currentTileType = this.tileArray[i][j].getTag();

					if(lastTileType === currentTileType) {
						repeatedTiles.push(new Phaser.Point(i, j));
					}
					else {
						if(repeatedTiles.length >= configuration.min_tiles_required_for_match) {
							this.removeTiles(repeatedTiles);
							foundAnything = true;							
						}
						repeatedTiles = [new Phaser.Point(i, j)];
					}
				}
				else { // If null...
					repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
				}
			}
			if(repeatedTiles.length >= configuration.min_tiles_required_for_match) { // Check to see if the remaining tiles in the column are worth anything...
				this.removeTiles(repeatedTiles);	
				foundAnything = true;							
			}
			repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
		}

		repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset

		for(let i = 0; i < configuration.board_rows; i++) { // For each row...
			for(let j = 0; j < configuration.board_columns; j++) { // Go across the row...
				if(this.tileArray[j][i] != null) {
					lastTileType = currentTileType;
					currentTileType = this.tileArray[j][i].getTag();

					if(lastTileType === currentTileType) {
						repeatedTiles.push(new Phaser.Point(j, i));
					}
					else {
						if(repeatedTiles.length >= configuration.min_tiles_required_for_match) { 
							this.removeTiles(repeatedTiles);
							foundAnything = true;	
						}
						repeatedTiles = [new Phaser.Point(j, i)];
					}
				}
				else { // If null...
					repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
				}
			}
			if(repeatedTiles.length >= configuration.min_tiles_required_for_match) { // Check to see if the remaining tiles in the row are worth anything...
				this.removeTiles(repeatedTiles);	
				foundAnything = true;							
			}
			repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
		}

		if(!foundAnything) {
			
			if(scoreMultiplier == 1 && selectedTile1 != null && selectedTile2 != null) {
				this.swapTiles(selectedTile1, selectedTile2, false);
				playMatchFailedSound();
			}
			selectedTile1 = null; 
			selectedTile2 = null;
			scoreMultiplier = 1;
			// console.log("--- Multiplier Reset ---");

			if(this.gameTimer.duration <= 0) {
				this.endGame();
			}
			else {
				this.checkRemainingMovesAndClear();
			}
		}
		else {
			scoreMultiplier += 1;
			playMatchSucessSound();
		}
		this.restartHintTimer();
		return foundAnything;
	}, 

	removeTiles: function(arr) {
		let str = ("SCORE: " + score + " + (" + arr.length + " * " + scoreMultiplier + ") = ");
		// score += (arr.length * scoreMultiplier);
		this.addToScore(arr.length * scoreMultiplier);
		str += score;
		// console.log(str);


		let sumOfX = 0;
		let sumOfY = 0;
		for(let i = 0; i < arr.length; i++) {
			let theTile = this.tileArray[arr[i].x][arr[i].y];
			sumOfX += theTile.getPosition().x;
			sumOfY += theTile.getPosition().y;
		}
		let centerX = sumOfX / arr.length;
		let centerY = sumOfY / arr.length;


		let lastTileArrayPosition = arr[arr.length-1];
		let lastTilePosition = this.tileArray[lastTileArrayPosition.x][lastTileArrayPosition.y].getPosition();
		this.showPoints(centerX + this.tileGroup.x, centerY + this.tileGroup.y, "+" + (arr.length * scoreMultiplier));

		for(let i = 0; i < arr.length; i++) {
			this.removeTile(arr[i].x, arr[i].y);
		}

		playTileDisappearSound();

		let obj = this;
		tweenManager.callOnComplete(function() {
			// console.log("All tweens completed.");
			obj.updateBoard();
		});
	},

	removeTile: function(col, row) {
		let removeDuration = 500;
		let target = this.tileArray[col][row].getSprite();
		let obj = this;

		if(this.tileArray[col][row].animator == null) {
			let tween = game.add.tween(target.scale).to({ x: 0, y: 0 }, removeDuration, Phaser.Easing.Linear.None, true);
			tweenManager.addTween(tween);

			tween.onComplete.addOnce(function() { // Removes the tile after it has finished its tween.
				target.destroy();
				this.tileGroup.remove(this.tileArray[col][row]);
				this.tileArray[col][row] = null; 
			}, this);
		}
		else {
			this.tileArray[col][row].animator.setTimeToTimeDividedByFrameCount('disappear', removeDuration);
			this.tileArray[col][row].animator.playAnimation('disappear', false);
			tweenManager.addAnimation(this.tileArray[col][row].animator);

			this.tileArray[col][row].animator.addCallOnComplete(function() { // Removes the tile after it has finished its tween.
				target.destroy();
				obj.tileGroup.remove(obj.tileArray[col][row]);
				obj.tileArray[col][row] = null; 
			});
		}
	}, 

	updateColumn: function(col) {
		// Go through the column and find the null space.
		for(let i = configuration.board_rows - 1; i > 0 ; i--) { // Starting at the bottom...
			if(this.tileArray[col][i] == null) {
				let tileX = col * this.calculatedTileSize;
				let tileY = i * this.calculatedTileSize;
				
				let tempI = i-1;
				while(this.tileArray[col][tempI] == null && tempI >= 0) {
					tempI--;
					if(tempI < 0)
						return;
				}
				let tween = game.add.tween(this.tileArray[col][tempI].getSprite()).to({ y: tileY }, configuration.tile_fall_time * 0.9, configuration.falling_tile_easing, true);
				this.tileArray[col][tempI].setArrayPosition(col, i);
				this.tileArray[col][tempI].setFallingTween(tween);
				tweenManager.addTween(tween);

				this.tileArray[col][i] = this.tileArray[col][tempI];
				this.tileArray[col][tempI] = null;
			}
		}
	}, 

	updateBoard: function() {
		for(let j = 0; j < configuration.board_columns; j++) {
			this.updateColumn(j);
		}
		this.refillBoard();

		let obj = this;
		tweenManager.callOnComplete(function() {
			// console.log("All tweens completed.");
			// obj.printBoard();

			for(let i = 0; i < configuration.board_rows; i++) {
				for(let j = 0; j < configuration.board_columns; j++) { 
					currentState.tileArray[ i ][ j ].setFallingTween(null);
				}
			}

			obj.scanBoard();
		});
	}, 

	refillBoard: function() {
		// console.log("Refilling...");
		for(let col = 0; col < configuration.board_columns; col++) { // For each column...
			let row = 0;
			while(this.tileArray[col][row] == null && row < configuration.board_rows) { // Counts null tiles.
				row++;
			} let nullTileCount = row; // Stores the resulting number.
			if(nullTileCount != 0) { // If it found missing tiles, create a new tile and drop it in. 
				for(let i = 0; i < nullTileCount; i++) {
					let tileX = col * this.calculatedTileSize;
					let tileY = i * this.calculatedTileSize;
					let tile = this.placeTile(tileX, tileY - game.height);

					this.tileArray[col][i] = tile;
					this.tileGroup.add(tile.getSprite());

					ScaleSprite(tile.getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);

					let tween = game.add.tween(tile.getSprite()).to({ y: tileY }, configuration.new_tile_fall_time, configuration.falling_tile_easing, true);
					tile.setFallingTween(tween);
					tile.setArrayPosition(col, i);
					tweenManager.addTween(tween);
				}
			}
		}
	}, 

	/*_______________________________________
		Print Board							|
	_________________________________________
			The function prints what the array
			looks like in the console window. 
	________________________________________*/
	printBoard: function() {
		let str = "";
		for(let i = 0; i < configuration.board_rows; i++) {
			for(let j = 0; j < configuration.board_columns; j++) { 
				if(this.tileArray[j][i] == null) {
					str += "[_]";
				}
				else {
					switch (this.tileArray[j][i].getTag()) {
						case "TYPE_0": 
							str += "[0]";
							break;
						case "TYPE_1": 
							str += "[1]";
							break;
						case "TYPE_2": 
							str += "[2]";
							break;
						case "TYPE_3": 
							str += "[3]";
							break;
						case "TYPE_4": 
							str += "[4]";
							break;
						default: 
							str += "[?]";
							break;
					}
				}
			}
			str += "\n";
		}
		console.log(str);
	}, 

	checkRemainingMovesAndClear: function() {
		if(this.checkMoves().length == 0) {
			for(let j = 0; j < configuration.board_columns; j++) {
				for(let i = 0; i < configuration.board_rows ; i++) {
					this.removeTile(j, i);
				}
			}
			this.addToScore(configuration.board_columns * configuration.board_rows);
			this.showPoints(this.horizontalMargin + ((configuration.board_columns * this.calculatedTileSize) / 2), this.verticalMargin + ((configuration.board_rows * this.calculatedTileSize) / 2), "NO REMAINING \nMOVES! \n+" + (configuration.board_columns * configuration.board_rows));

			let obj = this;
			tweenManager.callOnComplete(function() {
				// console.log("All tweens completed.");
				obj.updateBoard();
			});
		}

	},


	showHint: function() { // HINT DISPLAY
		let moves = this.checkMoves();

		if(moves.length == 0) {
			console.log("No moves available!");
			return;
		}

		let chosenRandomMove = moves[Math.floor(Math.random()*moves.length)];

		// Tweenimate_Breathe(chosenRandomMove.tileToMove.getSprite(), chosenRandomMove.tileToMove.getSprite().scale.x * 1.3, chosenRandomMove.tileToMove.getSprite().scale.x * 1.3, 1000);
		// Tweenimate_Breathe(chosenRandomMove.placementLocation.getSprite(), 1.4, 1.4, 1000);

		// Fall out of screen
		// let fallTween1 = game.add.tween(chosenRandomMove.tileToMove.getSprite().scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Cubic.Out, true);
		// let fallTween2 = game.add.tween(chosenRandomMove.tileToMove.getSprite()).to({ y: 2 * game.height }, 1000, Phaser.Easing.Cubic.In, true);
		
		let startingPoint = new Phaser.Point(chosenRandomMove.tileToMove.getPosition().x + this.tileGroup.x, chosenRandomMove.tileToMove.getPosition().y + this.tileGroup.y);
		let endingPoint = new Phaser.Point(chosenRandomMove.placementLocation.getPosition().x + this.tileGroup.x, chosenRandomMove.placementLocation.getPosition().y + this.tileGroup.y);

		Tweenimate_SpinWobble(chosenRandomMove.tileToMove.getSprite(), 360, 1500);
		Tweenimate_SpinWobble(chosenRandomMove.placementLocation.getSprite(), 360, 1500);


		// let graphics = game.add.graphics(0, 0);
		// graphics.beginFill(0xFFFFFF, 0.4);
		// graphics.lineStyle(3, 0xFFFFFF, 1);
		// graphics.drawCircle(0, 0, 25); // x, y, diameter
		// graphics.endFill();

		// this.hintSpriteTexture = graphics.generateTexture();
  //   	graphics.destroy();

  //   	graphics = game.add.graphics(0, 0);
		// graphics.beginFill(0xFFFFFF, 0.4);
		// graphics.lineStyle(3, 0xFFFFFF, 1);
		// graphics.drawCircle(0, 0, 25); // x, y, diameter
		// graphics.endFill();
		// graphics.beginFill(0xFFFFFF, 1);
		// graphics.drawCircle(0, 0, 12); // x, y, diameter
		// graphics.endFill();

		// this.hintSpritePressedTexture = graphics.generateTexture();
  //   	graphics.destroy();


		// let hintSprite = game.add.sprite(startingPoint.x, startingPoint.y, this.hintSpriteTexture);
		// hintSprite.anchor.setTo(0.5);
		// hintSprite.x = startingPoint.x;
		// hintSprite.y = startingPoint.y;
		// hintSprite.scale.setTo(0, 0);
		// let hintTweens = [];

		// let tweenAppear = game.add.tween(hintSprite.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Elastic.Out);
		// let tween0 = game.add.tween(hintSprite).to({ x: startingPoint.x, y: startingPoint.y }, 500, Phaser.Easing.Linear.None);
		// let tween1 = game.add.tween(hintSprite).to({ x: startingPoint.x, y: startingPoint.y }, 500, Phaser.Easing.Linear.None);
		// let tween2 = game.add.tween(hintSprite).to({ x: endingPoint.x, y: endingPoint.y }, 800, Phaser.Easing.Linear.None);
		// let tween3 = game.add.tween(hintSprite).to({ x: endingPoint.x, y: endingPoint.y }, 500, Phaser.Easing.Linear.None);
		// let tween4 = game.add.tween(hintSprite).to({ x: endingPoint.x, y: endingPoint.y }, 500, Phaser.Easing.Linear.None);
		// let tweenDisappear = game.add.tween(hintSprite.scale).to({ x: 0, y: 0 }, 400, Phaser.Easing.Quartic.In);

		// hintTweens.push(tweenAppear);
		// hintTweens.push(tween0);
		// hintTweens.push(tween1);
		// hintTweens.push(tween2);
		// hintTweens.push(tween3);
		// hintTweens.push(tweenDisappear);

		// tweenAppear.start();
		// tweenAppear.chain(tween0);
		// tween0.chain(tween1);
		// ChangeSpriteOnTweenComplete(tween0, hintSprite, this.hintSpritePressedTexture);
		// tween1.chain(tween2);
		// tween2.chain(tween3);
		// tween3.chain(tween4);
		// ChangeSpriteOnTweenComplete(tween3, hintSprite, this.hintSpriteTexture);
		// tween4.chain(tweenDisappear);

		// let obj = this;
		// tweenDisappear.onComplete.addOnce(function() {
		// 	obj.removeHint(hintSprite, hintTweens);
		// }, this);
	}, 

	restartHintTimer: function() {
		this.hintTimer.removeAll();
	    this.hintTimer.loop(game_details_data.game_details.hint_delay * 1000, this.hintCallOnComplete, this);
	},

	removeHint: function(hintSprite, hintTweens) {
		this.clearHintTweens(hintTweens);
		hintSprite.destroy();
	}, 

	clearHintTweens: function(hintTweens) {
		while(hintTweens.length != 0) {
			hintTweens[0].stop();
			hintTweens.pop(hintTweens[0]);
		}
	}, 

	goText: function() {
		let duration = 750;
		let message = game_details_data.user_interface_settings.begin_text_text;
		let myStyle = game_details_data.user_interface_settings.begin_text_style;
		let myText = game.add.text(game.world.centerX, game.world.centerY, message, myStyle);
		// myText.fontSize *= devicePixelRatio;

		// myText.stroke = '#000000';
  //   	myText.strokeThickness = 20;
		myText.anchor.setTo(0.5, 0.5);
		myText.align = 'center';

		let tween = game.add.tween(myText.scale).to({ x: 1.5, y: 1.5 }, duration, Phaser.Easing.Cubic.Out, true);
		let tween1 = game.add.tween(myText).to({ alpha: 0 }, duration, Phaser.Easing.Linear.None, true);
		tween.onComplete.add(function() {
			currentState.beginGame();
		}, this);
	},

	showPoints: function(x, y, val) {
		let strVal = val.toString();

    	let message = val;
		let myStyle = { font: "" + (50) + "px font_2", fill: '#ffffff' };
		let myText = game.add.text(x, y, message, myStyle);
		// myText.stroke = '#000000';
  //   	myText.strokeThickness = 20;
		myText.anchor.setTo(0.5, 0.5);
		myText.align = 'center';
		// this.sceneProps.add(text_test);

		// graphicsSprite.addChild(text_test);

		let pointLifetime = 2000;

		let tween = game.add.tween(myText.scale).to({ x: 0.75, y: 0.75 }, pointLifetime, Phaser.Easing.Cubic.Out, true);
		let tween1 = game.add.tween(myText).to({ alpha: 0 }, pointLifetime, Phaser.Easing.Linear.None, true);
		let tween2 = game.add.tween(myText).to({ y: this.scoreDisplay.y, x: this.scoreDisplay.x + this.scoreDisplay.width/2 }, pointLifetime, Phaser.Easing.Cubic.In, true);
		tween.onComplete.add(function() {
			myText.destroy();
		}, this);
	},

	addToScore: function(val) {
		score += val;
		this.scoreDisplay.setText(score);

		// Tweenimate_SpinWobble(this.scoreDisplay, 360, 1500);
	},

	updateTimeText: function(num) {
		this.timeDisplay.setText(num + game_details_data.user_interface_settings.remaining_time_text_extension);
	},

	beginGame: function() {
		allowBoardInput = true;
		this.gameTimerRunning = true;
		this.gameTimer.add(configuration.game_duration, function() {
			if(tweenManager.getSize() == 0) {
				this.endGame();
			}
		}, this);
		this.gameTimer.start();
		this.hintTimer.start();
		this.scanBoard();
	},

	endGame: function() {
		// console.log("GAME OVER");
		allowBoardInput = false;
		this.hintTimer.destroy();
		this.updateTimeText(0);
		this.gameTimerRunning = false;
		this.hideSelectedSprites();
		this.endGameDialogBox.show();
	}, 

	createStartGameDialogBox: function() {
		let startGameDialogBoxData = game_details_data.dialog_box_settings.game_start_dialog_box;
		this.startGameDialogBox = DialogBox(game.world.centerX, game.world.centerY, startGameDialogBoxData.width, game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding);	
		if(game_details_data.game_sprites.dialog_box_background_sprite != null && game_details_data.game_sprites.dialog_box_background_sprite) {
			this.startGameDialogBox.setBackgroundSprite('dialog_box_background_sprite');
		}
		for(let i = 0; i < startGameDialogBoxData.text_components.length; i++) { // Add text
			let component = startGameDialogBoxData.text_components[i];
			if(component.type === "SCORE") {
				this.startGameDialogBox.addTextSegment(score + component.text, component.style, component.align);
			}
			else if(component.type === "REWARD") {
				this.startGameDialogBox.addTextSegment(game_details_data.game_details.reward + component.text, component.style, component.align);
			}
			else {
				this.startGameDialogBox.addTextSegment(component.text, component.style, component.align);
			}
		}
		this.startGameDialogBox.addButton(startGameDialogBoxData.start_button_text, null,
		 	function() { //On click...
		 		currentState.startGameDialogBox.hide();
				currentState.goText();
			}
		);
		this.startGameDialogBox.addButton(startGameDialogBoxData.back_button_text, null,
		 	function() { //On click...
		 		currentState.game.state.start("MenuState", false, false, currentState.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.startGameDialogBox.getGroup());
	}, 

	createEndGameDialogBox: function() {
		let endGameDialogBoxData = game_details_data.dialog_box_settings.game_end_dialog_box;
		this.endGameDialogBox = DialogBox(game.world.centerX, game.world.centerY, endGameDialogBoxData.width, game_details_data.dialog_box_settings.contents_padding, game_details_data.dialog_box_settings.button_text_padding);	
		if(game_details_data.game_sprites.dialog_box_background_sprite != null && game_details_data.game_sprites.dialog_box_background_sprite) {
			this.endGameDialogBox.setBackgroundSprite('dialog_box_background_sprite');
		}
		for(let i = 0; i < endGameDialogBoxData.text_components.length; i++) { // Add text
			let component = endGameDialogBoxData.text_components[i];
			if(component.type === "SCORE") {
				this.endGameDialogBox.addTextSegment(score + component.text, component.style, component.align);
			}
			else if(component.type === "REWARD") {
				this.endGameDialogBox.addTextSegment(game_details_data.game_details.reward + component.text, component.style, component.align);
			}
			else {
				this.endGameDialogBox.addTextSegment(component.text, component.style, component.align);
			}
		}
		this.endGameDialogBox.addButton(endGameDialogBoxData.finish_button_text, null,
		 	function() { //On click...
		 		currentState.game.state.start("GameOverState", false, false, currentState.sceneProps, "CENTER_TO_LEFT", "RIGHT_TO_CENTER");
			}
		);
		this.sceneProps.add(this.endGameDialogBox.getGroup());
	}



};


























