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

	init: function(game_details_data, previousStateProps, oldSceneTransition, newSceneTransition) {
		"use strict";
		this.game_details_data = game_details_data;
		
		this.oldSceneTransition = oldSceneTransition;
		this.newSceneTransition = newSceneTransition;

		// Exit the previous scene/state...
		// if(previousStateProps) { ExitPreviousScene(previousStateProps, TranslateTween(this.oldSceneTransition, 1000, configuration.transition_easing)); }
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
		// this.thing1 = game.add.sprite(150, 150, 'test_image');
		// this.thing1.anchor.setTo(0.5);
		// this.sceneProps.add(this.thing1);

		// this.exit_button = game.add.sprite(this.world.centerX, this.world.centerY, "blue_square");
		// this.exit_button.anchor.setTo(0.5);	

		// Background
		this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'background_image');
		this.background.anchor.setTo(0.5);
		this.sceneProps.add(this.background);

		// Progress Bar
		let graphics = game.add.graphics(0,0);
		graphics.lineStyle(2, '0xFFFFFF');
		graphics.beginFill('0x68588C',1);
		graphics.drawRoundedRect(0,0,300,27,10);
		graphics.endFill();
		let graphicsTexture = graphics.generateTexture();
		graphics.destroy();

		this.progressBar = game.add.sprite(0, 0, graphicsTexture);
		this.progressBar.anchor.setTo(0, 0.5);
		this.sceneProps.add(this.progressBar);


		
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
			scoreMultiplier = 1;
			obj.game.state.start("MenuState", true, false, this.game_details_data, obj.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
		});
		this.sceneProps.add(this.button.getSprite());


		this.initializeBoard();
		this.initializeTiles();

		this.selectedTileSprite1 = game.add.sprite(0, 0, 'selected_tile');
		this.selectedTileSprite1.anchor.setTo(0.5);
		this.selectedTileSprite1.visible = false;
		this.sceneProps.add(this.selectedTileSprite1);
		this.selectedTileSprite2 = game.add.sprite(0, 0, 'selected_tile');
		this.selectedTileSprite2.anchor.setTo(0.5);
		this.selectedTileSprite2.visible = false;
		this.sceneProps.add(this.selectedTileSprite2);

		
		
		// this.printBoard();


		// EnterNewScene(this.sceneProps, TranslateTween(this.newSceneTransition, 1000, configuration.transition_easing));
		// tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
		// 	// console.log("Transition completed.");
		// 	// this.gameTimer = game.time.create(false);
		// 	// this.gameTimer.add(5000, test);
		// 	// this.gameTimer.start();
		// 	obj.scanBoard();
		// });

		this.positionComponents(game.width, game.height);
		obj.scanBoard();
		// checkCookie(); // TEST
		// this.addText();
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	},

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			var availableGridSpace = Math.min(width * 2/3, height);
			let chosenSideLength = Math.max(configuration.board_columns, configuration.board_rows);
			this.calculatedTileSize = (availableGridSpace * 0.9) / chosenSideLength;
			this.horizontalMargin = (width * 2/3 - configuration.board_columns * this.calculatedTileSize) / 2;
			this.verticalMargin = (height - configuration.board_rows * this.calculatedTileSize) / 2;


			// Progress Bar
			this.progressBar.x = this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns * 1/4); 
			this.progressBar.y = this.verticalMargin - this.calculatedTileSize/2;
			ScaleSprite(this.progressBar, this.calculatedTileSize * configuration.board_columns * 3/4, null, 0, 1);


			// Board
			this.boardSpriteGroup.x = (width * 1/3) + this.horizontalMargin + this.calculatedTileSize/2;
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
			this.tileGroup.x = (width * 1/3) + this.horizontalMargin + this.calculatedTileSize/2;
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
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			ScaleSprite(this.button.getSprite(), width/3, height/3, 20, 1);
			this.button.getSprite().x = width/6;
			this.button.getSprite().y = this.verticalMargin + this.button.getSprite().height/2;
			this.button.updateIntendedScale();
		}
		else {
			var availableGridSpace = width;
			let chosenSideLength = Math.max(configuration.board_columns, configuration.board_rows);
			this.calculatedTileSize = (availableGridSpace * 0.8) / chosenSideLength;
			this.horizontalMargin = (width - (configuration.board_columns * this.calculatedTileSize)) / 2;
			this.verticalMargin = (height - (configuration.board_rows * this.calculatedTileSize)) / 2;


			// Progress Bar
			this.progressBar.x = this.horizontalMargin + (this.calculatedTileSize * configuration.board_columns * 1/4); 
			this.progressBar.y = this.verticalMargin - this.calculatedTileSize/2;
			ScaleSprite(this.progressBar, this.calculatedTileSize * configuration.board_columns * 3/4, null, 0, 1);

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
			this.background.width = width;
			this.background.height = height;
			this.background.x = width/2;
			this.background.y = height/2;

			// Exit Button
			ScaleSprite(this.button.getSprite(), width / 2 - this.horizontalMargin, this.verticalMargin, 10, 1);
			this.button.getSprite().x = this.horizontalMargin + this.button.getSprite().width/2;
			this.button.getSprite().y = height - this.verticalMargin + this.button.getSprite().height;
			this.button.updateIntendedScale();

			// Progress Bar
			// this.progress.position.set(this.horizontalMargin, this.verticalMargin - this.progress.height - this.calculatedTileSize/2);
			// this.progress.width = (availableGridSpace * 0.8);
		}
	},

	resize: function(width, height) {
		"use strict";
		UpdateScreenInfo();
		//console.log("Resized");

		
		this.positionComponents(width, height);
		game.scale.refresh();
		// this.updateBoard();
		// this.scanBoard();
		// tweenManager.stopAllTweens();
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    //this.exitTransition();
	    //this.game.state.start("GameState", false, false, this.game_details_data, this);
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
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
			    
			    this.findDirectionOfSwipe(calculatedSwipeDirectionVector);
			    this.showHint();
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

	initializeBoard: function() {	// INCOMPLETE
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
				
				let tile = game.add.sprite(tileX, tileY, 'board_tile');
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

	placeTile: function(x, y) {
		let num = RandomBetween(0, gameTileKeys.length-1); // Random tile number.
		let tile = this.tile(this, x, y, gameTileKeys[num], gameTileKeys[num]); // The resulting tile.
		return tile;
	},

	tile: function(theState, x, y, spriteKey, tileTag) {
		let obj = {};
		obj.theState = theState;

		obj.tag = tileTag;

		obj.tileButton = SpriteButton(50, 350, spriteKey);

		obj.sprite = obj.tileButton.getSprite();
		obj.sprite.x = x;
		obj.sprite.y = y;
		obj.sprite.anchor.set(0.5);

		obj.arrayPos = new Phaser.Point(0, 0);

		obj.mouseOver = false;
		obj.mouseOff = false;
		obj.mouseDown = false;
		obj.mouseUp = false;

		obj.tileButton.setBehaviors(
			function() { //On mouse over...
				//console.log("Over");
				mouseOverObj = obj;
				this.mouseOver = true;
				this.mouseOff = false;
			}, 
			function() { //On mouse off...
				//console.log("Off");
				mouseOffObj = obj;
				this.mouseOff = true;
				this.mouseOver = false;
			},
			function() { //On mouse down...
				if(tweenManager.getSize() == 0 && (selectedTile1 == null || selectedTile2 == null)) {
					// console.log("Down");
					mouseDownObj = obj;
					this.mouseDown = true;
					this.mouseUp = false;

					if(selectedTile1 == null) { // If there is no selected tile, save this in selectedTile1.
						selectedTile1 = obj;
						theState.placeSelectedSprite(selectedTile1);
					} 
					else {	// If selectedTile1 is full, save in selectedTile2 and...
						selectedTile2 = obj;
						theState.placeSelectedSprite(selectedTile2);
						if(selectedTile1 === selectedTile2) { // If the two selected tiles are the same, reset.
							selectedTile1 = null; 
							selectedTile2 = null;
							theState.hideSelectedSprites();
							return;
						}

						let differenceInX = Math.abs(selectedTile1.getArrayPosition().x - selectedTile2.getArrayPosition().x);
						let differenceInY = Math.abs(selectedTile1.getArrayPosition().y - selectedTile2.getArrayPosition().y);
						let sum = differenceInX + differenceInY;
						if(sum == 1) { // If the two tiles are right next to eachother, swap and reset. 
							theState.swapTiles(selectedTile1, selectedTile2);
						}
						else { // If the two tiles are not right next to eachother, don't save the second selection.
							selectedTile2 = null;
							theState.hideSelectedSprites();
							selectedTile1 = obj;
							theState.placeSelectedSprite(selectedTile1);
						}
					}
				}
			}, 
			function() { //On mouse up...
				// console.log("Up");
				mouseUpObj = obj;
				this.mouseUp = true;
				this.mouseDown = false;
			}
		);

		obj.setPosition = function(x, y) {
			this.sprite.x = x;
			this.sprite.y = y;
		};
		obj.setArrayPosition = function(x, y) {
			this.arrayPos = new Phaser.Point(x, y);
		};
		obj.getArrayPosition = function(x, y) {
			return this.arrayPos;
		};
		obj.setScale = function(x, y) { this.sprite.scale.setTo(x, y); };
		obj.getSprite = function() { return this.sprite; };
		obj.getTag = function() { return this.tag; };
		obj.getPositionX = function() { return this.sprite.x; };
		obj.getPositionY = function() { return this.sprite.y; };
		obj.getPosition = function() { return new Phaser.Point(this.sprite.x, this.sprite.y) };

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
	swapTiles: function(t1, t2) {
		let x1 = t1.getArrayPosition().x;
		let y1 = t1.getArrayPosition().y;
		let x2 = t2.getArrayPosition().x;
		let y2 = t2.getArrayPosition().y;

		let temp = this.tileArray[x1][y1];
		this.tileArray[x1][y1] = this.tileArray[ x2 ][ y2 ];
		this.tileArray[x1][y1].setArrayPosition(x1, y1);
		this.tileArray[x2][y2] = temp;
		this.tileArray[x2][y2].setArrayPosition(x2, y2);
	
		let tween1 = game.add.tween(this.tileArray[ x1 ][ y1 ].getSprite()).to({ x: this.tileArray[ x2 ][ y2 ].getPositionX(), y: this.tileArray[x2][y2].getPositionY() }, 1000, Phaser.Easing.Elastic.Out, true);
		let tween2 = game.add.tween(this.tileArray[ x2 ][ y2 ].getSprite()).to({ x: this.tileArray[ x1 ][ y1 ].getPositionX(), y: this.tileArray[x1][y1].getPositionY() }, 1000, Phaser.Easing.Elastic.Out, true);
		tweenManager.addTween(tween1);
		tweenManager.addTween(tween2);
		
		let obj = this;
		tweenManager.callOnComplete(function() { // When the tiles are finished swapping...
			// console.log("All tweens completed.");
			obj.hideSelectedSprites();
			obj.scanBoard();
		});

	},

	shuffleBoard: function() {
		let theTiles = [];
		for(let x = 0; x < configuration.board_columns; x++) { // For each column...
			for(let y = 0; y < configuration.board_rows; y++) { // Go down the column...
				theTiles.push(this.tileArray[ x ][ y ]);
			}
		}

		while(theTiles.length > 1) {
			let num1 = RandomBetween(0, theTiles.length-1);
			let tile1 = theTiles[num1];
			theTiles.splice(num1, 1);
			let num2 = RandomBetween(0, theTiles.length-1);
			let tile2 = theTiles[num2];
			theTiles.splice(num2, 1);

			this.swapTiles(tile1, tile2);
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

		if(x >= 0 && x < configuration.board_columns && y >= 0 && y < configuration.board_rows) { // If on the board...
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
						if(repeatedTiles.length >= configuration.min_required_tiles_for_points) {
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
			if(repeatedTiles.length >= configuration.min_required_tiles_for_points) { // Check to see if the remaining tiles in the column are worth anything...
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
						if(repeatedTiles.length >= configuration.min_required_tiles_for_points) { 
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
			if(repeatedTiles.length >= configuration.min_required_tiles_for_points) { // Check to see if the remaining tiles in the row are worth anything...
				this.removeTiles(repeatedTiles);	
				foundAnything = true;							
			}
			repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
		}

		if(!foundAnything) {
			if(scoreMultiplier == 1 && selectedTile1 != null && selectedTile2 != null) {
				this.swapTiles(selectedTile1, selectedTile2);
			}
			selectedTile1 = null; 
			selectedTile2 = null;
			scoreMultiplier = 1;
			console.log("--- Multiplier Reset ---");
		}
		else {
			scoreMultiplier += 1;
		}
		return foundAnything;
	}, 

	removeTiles: function(arr) {
		let str = ("SCORE: " + score + " + (" + arr.length + " * " + scoreMultiplier + ") = ");
		score += (arr.length * scoreMultiplier);
		str += score;
		console.log(str);



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
		this.showPoints(centerX + this.tileGroup.x, centerY + this.tileGroup.y, (arr.length * scoreMultiplier));

		for(let i = 0; i < arr.length; i++) {
			this.removeTile(arr[i].x, arr[i].y);
		}

		let obj = this;
		tweenManager.callOnComplete(function() {
			// console.log("All tweens completed.");
			obj.updateBoard();
		});
	},

	removeTile: function(col, row) {
		let target = this.tileArray[col][row].getSprite();

		let tween = game.add.tween(target.scale).to({ x: 0, y: 0 }, 600, Phaser.Easing.Linear.None, true);
		tweenManager.addTween(tween);

		tween.onComplete.addOnce(function() { // Removes the tile after it has finished its tween.
			target.destroy();
			this.tileGroup.remove(this.tileArray[col][row]);
			this.tileArray[col][row] = null; 
		}, this);
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
				let tween = game.add.tween(this.tileArray[col][tempI].getSprite()).to({ x: tileX, y: tileY }, 1000, Phaser.Easing.Bounce.Out, true);
				this.tileArray[col][tempI].setArrayPosition(col, i);
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

					let tween = game.add.tween(tile.getSprite()).to({ x: tileX, y: tileY }, 1000, Phaser.Easing.Bounce.Out, true);
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
							str += "[0]";
							break;
					}
				}
			}
			str += "\n";
		}
		console.log(str);
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

	showPoints: function(x, y, val) {
		let strVal = val.toString();

		let graphics = game.add.graphics(0, 0);
		graphics.beginFill(0x000000, 0.75);
		// graphics.lineStyle(5, 0x000000, 1);
		graphics.drawCircle(0, 0, 40); // x, y, diameter
		graphics.endFill();

		let graphicsTexture = graphics.generateTexture();
    	graphics.destroy();

    	let graphicsSprite = game.add.sprite(x, y, graphicsTexture);
    	graphicsSprite.anchor.setTo(0.5);
    	this.sceneProps.add(graphicsSprite);

		text_test = game.add.bitmapText(0, 0, 'testFont', strVal, 20);
		text_test.anchor.setTo(0.5);
		text_test.align = 'center';
		this.sceneProps.add(text_test);

		graphicsSprite.addChild(text_test);

		let pointLifetime = 1000;

		let tween = game.add.tween(graphicsSprite.scale).to({ x: 2, y: 2 }, pointLifetime, Phaser.Easing.Quartic.Out, true);
		let tween1 = game.add.tween(graphicsSprite).to({ alpha: 0 }, pointLifetime, Phaser.Easing.Linear.None, true);
		let tween2 = game.add.tween(graphicsSprite).to({ y: graphicsSprite.y - 25 }, pointLifetime, Phaser.Easing.Linear.None, true);
		tween.onComplete.add(function() {
			graphicsSprite.destroy();
		}, this);
	}














};


























