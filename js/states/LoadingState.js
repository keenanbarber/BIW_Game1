// Loads all of the game assets and starts the Level State.

var MyGame = MyGame || {}; /* Created namespace if it hasn't yet been created. */



function doesSoundExist(sound) {
	return (sound && sound != null);
}

// BUTTON PRESS SOUND
var button_press_sound;
function playButtonPressSound() {
	if(doesSoundExist(button_press_sound))
		button_press_sound.play();
} 

// TILE DISAPPEAR SOUND
var tile_disappear_sound;
function playTileDisappearSound() {
	if(doesSoundExist(tile_disappear_sound))
		tile_disappear_sound.play();
} 

// MATCH SUCCESS SOUND
var match_success_sound;
function playMatchSucessSound() {
	if(doesSoundExist(match_success_sound))
		match_success_sound.play();
} 

// MATCH FAILED SOUND
var match_failed_sound;
function playMatchFailedSound() {
	if(doesSoundExist(match_failed_sound))
		match_failed_sound.play();
} 

// TILE SELECT SOUND
var tile_select_sound;
function playTileSelectSound() {
	if(doesSoundExist(tile_select_sound))
		tile_select_sound.play();
} 

MyGame.LoadingState = function(game) {
	"use strict";
	
};

MyGame.LoadingState.prototype = { 
	init: function() {
		"use strict";

		currentState = this;
		window.addEventListener('resize', currentState.resize );

		// Loading Text
		let loadingTextMessage = game.load.progress;
		let loadingTextStyle = game_details_data.user_interface_settings.score_text_style;
		this.loadingText = game.add.text(game.world.centerX, game.world.centerY, loadingTextMessage, loadingTextStyle);
		this.loadingText.anchor.setTo(0.5);
		this.loadingText.align = 'center';
		this.loadingText.fontSize = this.loadingText.fontSize * devicePixelRatio;
	}, 

	preload: function() {
		"use strict"; 

		// READ THE JSON FILE! :D
		var header;
		for(header in game_details_data) {
			switch(header) {
				case "game_details":
					let game_details_header;
					for(game_details_header in game_details_data[ header ]) {
						let value = game_details_data[ header ][ game_details_header ];
						switch(game_details_header) {
							case "name": 
								//this.load.image(asset_key, asset.source);
								console.log("USER:    " + value);
								break; 
							case "reward": 
								//this.load.spritesheet(asset_key, asset_source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
								console.log("REWARD:  " + value);
								break;
							case "date_played": 
								//this.load.spritesheet(asset_key, asset_source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
								console.log("DATE:    " + value);
								break;
							case "desktop_min_width": 
								configuration.desktop_min_width = value;
								break;
							case "desktop_min_height": 
								configuration.desktop_min_height = value;
								break;
							case "desktop_max_width": 
								configuration.desktop_max_width = value;
								break;
							case "desktop_max_height": 
								configuration.desktop_max_height = value;
								break;
							case "game_duration":
								configuration.game_duration = value * 1000;
								break;
							case "board_rows": 
								configuration.board_rows = value;
								break;
							case "board_columns": 
								configuration.board_columns = value;
								break;
							case "min_tiles_required_for_match": 
								configuration.min_tiles_required_for_match = value;
								break;
						}
					}
					break;
				case "font_files":
					let font_files_header;
					for(font_files_header in game_details_data[ header ]) {
						let value = game_details_data[ header ][ font_files_header ];
						switch(font_files_header) {
							case "font_1": 
								// Font_1
			    				var newStyle = document.createElement('style');
								newStyle.appendChild(document.createTextNode("\
								@font-face {\
								    font-family: '" + font_files_header + "';\
								    src: url('" + game_details_data[header][font_files_header].source + "') format('" + game_details_data[header][font_files_header].format + "');\
								}\
								")); document.head.appendChild(newStyle);
								var t = this.game.add.text(0, 0, "Loading font...", {font:"1px " + font_files_header, fill:"#FFFFFF"});
								break; 
							case "font_2": 
								// Font_2
								var newStyle = document.createElement('style');
								newStyle.appendChild(document.createTextNode("\
								@font-face {\
								    font-family: '" + font_files_header + "';\
								    src: url('" + game_details_data[header][font_files_header].source + "') format('" + game_details_data[header][font_files_header].format + "');\
								}\
								")); document.head.appendChild(newStyle);
								var t = this.game.add.text(0, 0, "Loading font...", {font:"1px " + font_files_header, fill:"#FFFFFF"});
								break;
						}
					}
					break;
				case "audio_files":
					let audio_files_header;
					for(audio_files_header in game_details_data[ header ]) {
						let value = game_details_data[ header ][ audio_files_header ];
						game.load.audio(audio_files_header, value);
					}
					break;
				case "game_sprites":
					let game_sprites_header;
					for(game_sprites_header in game_details_data[ header ]) {
						let value = game_details_data[ header ][ game_sprites_header ];
						switch(game_sprites_header) {
							case "board_tile": 
								this.load.image(game_sprites_header, value);
								break; 
							case "selected_tile": 
								this.load.image(game_sprites_header, value);
								break;
							case "background_image": 
								this.load.image(game_sprites_header, value);
								break; 
							case "title": 
								this.load.image(game_sprites_header, value);
								break;
							case "end_game_image": 
								this.load.image(game_sprites_header, value);
								break;
							case "dialog_box_background_sprite": 
								if(value != null)
									this.load.image(game_sprites_header, value);
								break;
						}
					}
					break;
				case "game_tiles":
					let game_tiles_array = game_details_data[ header ];
					for (let i = 0; i < game_tiles_array.length; i++) {
    					this.load.image("tile_" + i, game_tiles_array[i].main_sprite_source);
    					gameTileDetails.push(
	    					{
	    						"key": "tile_" + i, 
	    						"disappear_animation_frames": []
	    					}
    					);
    					for (let j = 0; j < game_tiles_array[i].disappear_animation_frames.length; j++) {
    						this.load.image("tile_" + i + "_disappear_" + j, game_tiles_array[i].disappear_animation_frames[j]);
    						gameTileDetails[i].disappear_animation_frames.push( "tile_" + i + "_disappear_" + j );
    					}
    				}
					break;
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
		updateGameWindow(game);
		currentState.loadingText.x = game.world.centerX; 
		currentState.loadingText.y = game.world.centerY;

		this.loadingText.setText(game.load.progress);
	},

	create: function() {
		"use strict"; 

		



		// Assigning audio to variables here because it causes errors above...?
		if(doesSoundExist(game_details_data.audio_assignment.button_press_sound))
			button_press_sound = game.add.audio(game_details_data.audio_assignment.button_press_sound);
		if(doesSoundExist(game_details_data.audio_assignment.tile_disappear_sound))
			tile_disappear_sound = game.add.audio(game_details_data.audio_assignment.tile_disappear_sound);
		if(doesSoundExist(game_details_data.audio_assignment.match_success_sound))
			match_success_sound = game.add.audio(game_details_data.audio_assignment.match_success_sound);
		if(doesSoundExist(game_details_data.audio_assignment.match_failed_sound))
			match_failed_sound = game.add.audio(game_details_data.audio_assignment.match_failed_sound);
		if(doesSoundExist(game_details_data.audio_assignment.tile_select_sound))
			tile_select_sound = game.add.audio(game_details_data.audio_assignment.tile_select_sound);

		this.game.state.start("MenuState", true, false, null, "CENTER_TO_BOTTOM", "TOP_TO_CENTER");
	}, 

	resize: function() {
		"use strict";
		updateGameWindow(game);

		let scaleManager = game.scale;
		let width = scaleManager.width; 
		let height = scaleManager.height;
	}
};







