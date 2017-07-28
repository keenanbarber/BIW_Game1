=======================
MARTIAN MATCH
=======================

LAST MODIFIED - 07/28/17

--- README ----------------------------------------------------
	The goal was to make a game that can be reskinned that will also work on both mobile and desktop browsers. It was created with HTML and Javascript as well as the Javascript library Phaser. 


--- MODIFYING THE JSON FILE -----------------------------------
	DO NOT modify any keys unless mentioned below

	[ game_details ]
			This section is for defining general facts about the game like how long the game will last, how large it is, what is the players reward, and so on. 

			o	name
					This is the users name to be used by the game.

			o	reward
					What the player is rewarded by playing the game. 

			o	date_played
					The date that the game is being played. 

			o	high_score
					The high score pulled from somewhere to tell the player if they beat it. 

			o	desktop_min_width, desktop_min_height, desktop_max_width, desktop_max_height
					The minimum/maximum dimensions of the game size when playing on desktop browsers. 

			o	game_duration
					The amount of time the player is allowed to play the game. 

			o	board_rows
					The amount of rows on the board of the game. 

			o	board_columns
					The amount of columns on the board of the game. 

			o	min_tiles_required_for_match
					The minimum amount of tiles required to be considered a match. 

						[ EXAMPLE ] - If this value was 3...

							- Works 			---> [X][X][X]
												---> [_][X][X][X][_]
												---> [X][X][X][X]

							- Doesn't Works		---> [X][_][X][X]
												---> [X][_][_][X]

			o 	hint_delay
					This is the amount of time before a hint is shown to the player. If the player doesn't get any points after this amount of time, a hint will be shown and the timer for showing a hint will be reset. Another hint will then be shown again after this amount of time. 

						[ EXAMPLE ] - If the value was 5...

							Start Game --> 5 --> 4 --> 3 --> 2 --> 1 --> HINT --> 5 --> 4 --> 3 --> 2 --> 1 --> HINT --> [...]

							Start Game --> 5 --> 4 --> 3 --> MOVE PLAYED --> 5 --> 4 --> 3 --> 2 --> 1 --> HINT --> [...]


	[ user_interface_settings ]
			This section defines details about the UI. This includes the information for the text above the game board when playing the game. Modify the text, style, color of those things here. 


	[ font_files ]
			This is where your fonts are loaded. In this section, THE KEYS CAN BE CHANGED. Let's look at the example below: 

						"font_1": {"source": "assets/fonts/brandon_light-webfont.woff", "format": "woff"}, 

			The "font_1" can be changed to be whatever you would like it to be. The "source" and "format" keys must remain unchanged however with a value. You will use the names, like "font_1," throughout the json file when setting font styles. For example, in the section [ user_interface_settings ], when defining the "score_text_style," you can use font_1 now:

						"score_text_style": { "font": "14px font_1", "fill": "#ffffff" } 


	[ audio_files ]
			Similar to how [ font_files ] works, this loads the audio clips. In this section, THE KEYS CAN BE CHANGED. 

						"sound_1": ["assets/audio/MySound.mp3", "assets/audio/MySound.wav"], 

			The "sound_1" can be changed to whatever you would like. In the section [ audio_assignment ], you will be using these names to assign them to different parts of the game. Multiple audio formats of the desired audio clip can be put into the array in case one doesn't work with the browser. 


	[ audio_assignment ]
			Asign the sounds that you defined in [ audio_files ] to different parts of the game. 

						"button_press_sound": "sound_1" 

	[ sprite_adjustment ]
			Modify these values to make small adjustments to the positioning of certain elements in the game. 

	[ game_sprites ]
			This is where you provide the paths to the sprites you want the game to be using. 

						"background_image": "assets/images/MyBackgroundImage.png" 

	[ game_tiles ]
			...












