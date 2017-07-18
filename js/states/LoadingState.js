// Loads all of the game assets and starts the Level State.

var MyGame = MyGame || {}; /* Created namespace if it hasn't yet been created. */

MyGame.LoadingState = function(game) {
	"use strict";
	
};

MyGame.LoadingState.prototype = { 
	init: function() {
		// Recieves game_details_data from BootState and stores it. 
		"use strict";
	}, 

	preload: function() {
		"use strict"; 

		// this.stage.backgroundColor = 0xBB4242;
		// var loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
		// loadingBar.anchor.setTo(0.5);
		// this.load.setPreloadSprite(loadingBar);

		// USER DETAILS
		var user_details, user_detail_key, detail;
		user_details = game_details_data.user_details;
		for(user_detail_key in user_details) {
			if(user_details.hasOwnProperty(user_detail_key)) { // Makes sure the key exists in the assets.
				detail = user_details[ user_detail_key ];
				switch(user_detail_key) {
					case "name": 
						//this.load.image(asset_key, asset.source);
						console.log("Found \'" + detail + "\' in the json file.");
						break; 
					case "points": 
						//this.load.spritesheet(asset_key, asset_source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
						console.log("Found \'" + detail + "\' in the json file.");
						break;
				}
			}
		}

		// ASSETS
		var assets, asset_key, asset;
	    assets = game_details_data.assets;
	    for (asset_key in assets) { // load assets according to asset key
	        if (assets.hasOwnProperty(asset_key)) {
	            asset = assets[asset_key];
	            switch (asset.type) {
		            case "image":
		                this.load.image(asset_key, asset.source);
		                break;
		            case "spritesheet": 
		            	this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frame_count);
		            	break;
		            case "audio": 
		            	this.load.audio(asset_key, asset.source);
	            }
	        }
	    }

	    // ASSETS 2
	    var assets, asset_key, asset;
	    assets = game_details_data.assets_2;
	    for (asset_key in assets) {
	    	if (assets.hasOwnProperty(asset_key)) {
	    		switch (asset_key) {
	    			case "game_tiles":
	    				for (let i = 0; i < assets[asset_key].length; i++) {
	    					this.load.image("tile_" + i, assets[asset_key][i]);
	    					gameTileKeys.push("tile_" + i);
	    				}
	    				break;
	    			case "sprite_animation_frames": 
	    				for (let i = 0; i < assets[asset_key].length; i++) {
	    					this.load.image("anim_" + i, assets[asset_key][i]);
	    				}
	    				break;
	    			case "font_files":
	    				// assets = assets_2
	    				// asset_key = font_files

	    				// Font_1
	    				var newStyle = document.createElement('style');
						newStyle.appendChild(document.createTextNode("\
						@font-face {\
						    font-family: 'font_1';\
						    src: url('" + assets[asset_key].font_1.source + "') format('" + assets[asset_key].font_1.format + "');\
						}\
						")); document.head.appendChild(newStyle);

						// Font_2
						var newStyle = document.createElement('style');
						newStyle.appendChild(document.createTextNode("\
						@font-face {\
						    font-family: 'font_2';\
						    src: url('" + assets[asset_key].font_2.source + "') format('" + assets[asset_key].font_2.format + "');\
						}\
						")); document.head.appendChild(newStyle);

						// To use custom fonts, you need to use them once before you can actually use them... For some reason. So here is where that happens. 
						var t = this.game.add.text(0, 0, "Loading font...", {font:"1px font_1", fill:"#FFFFFF"});
						var t = this.game.add.text(0, 0, "Loading font...", {font:"1px font_2", fill:"#FFFFFF"});
	    				break;
	    			case "board_tile": 
	    				this.load.image(asset_key, assets[asset_key]);
	    				break;
	    			case "selected_tile":
	    				this.load.image(asset_key, assets[asset_key]);
	    				break;
	    			case "background_image": 
	    				this.load.image(asset_key, assets[asset_key]);
	    				break;
	    			case "stopwatch": 
	    				this.load.image(asset_key, assets[asset_key]);
	    				break;
	    		}
	    	}
	    }


	    // this.preloadBar = game.add.graphics(0, 50);  
	    // this.preloadBar.lineStyle(3, 0xffffff, 1);  
	    // this.preloadBar.moveTo(0, 0);  
	    // this.preloadBar.lineTo(game.width, 0);      
	    // this.preloadBar.scale.x = 0; // set the bar to the beginning position
	},

	loadUpdate: function() {  // every frame during loading, set the scale.x of the bar to the progress (an integer between 0  // and 100) divided by 100 to give a float between 0 and 1  
		// this.preloadBar.scale.x = game.load.progress * 0.01;
		// console.log("Loading Bar...");
	},

	create: function() {
		"use strict"; 
		this.game.state.start("MenuState", true, false, this.game_details_data, null, "CENTER_TO_BOTTOM", "TOP_TO_CENTER");
	}
};
