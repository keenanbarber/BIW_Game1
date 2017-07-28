=======================
MARTIAN MATCH
=======================

LAST MODIFIED - 07/28/17

--- README ----------------------------------------------------
	The goal was to make a game that can be reskinned that will also work on both mobile and desktop browsers. It was created with HTML and Javascript as well as the Javascript library Phaser. 


--- THE GAME --------------------------------------------------
	This game is supposed to play similar to Bejeweled. In a certain amount of time, the player is supposed to match as many tiles as they can by flipping two of them to get as large of a score as possible. If the player gets a score that is higher than the recorded high score, a special dialog box will appear. If not, the usual dialog box will appear. At the end of the game, and after being shown your score, the player is then awarded reward points. 

	Gameplay

	Upon entering the game state, where the board is shown and the player is told to start, the player is allowed to make two selections to flip those tiles. 

		Input
			To select two tiles, the player is able to click the target tiles with a left mouse button press. Alternatively, if the player clicks on their first tile, holds down the button, and drags the mouse in a direction, the tile that is next to the first selected tile in the direction of the mouse drag is chosen as the second selected tile. The two tiles are flipped at this point. The same should apply to mobile devices, except instead of a mouse, a stylus or touch is used. 

		Tile Selection Details
			o 	If the player selects a tile with no tiles currently selected, a sprite is places on top of the newly selected tile to indicate that it has been selected. 

						[_][_][_]  → Selects tile 2  →  [_][1][_] 

			o 	If the player selects a second tile that is either on the left, right, top, or bottom side of the first selected tile, then these two selected tiles are flipped and the board is scanned for matches. 

						[_][1][_]  → Selects tile 3  →  [_][1][2]  →  Swap tiles  →  [_][2][1]  →  Board scanned

			o 	If the player selects a second tile that is NOT on the left, right, top, or bottom side of the first selected tile, the first selected tile gets deselected and the new tile that was selected becomes the first selected tile. 

						[1][_][_]  → Selects tile 3  →  [_][_][1] 

			o 	If the player selects a second tile that is the same as the first selected tile, the first selected tile is deselected and there will not be any tiles that are selected. 

						[_][1][_]  → Selects tile 2  →  [_][_][_]

		After two tiles are selected and are swapped, the board is then scanned and the player's ability to interact with the board is taken away. Going through the board horizontally and vertically, groups of three (or whatever number is put into the json file) tiles are read and if all of the tiles in the group are the same, then this counts as a match and points are awarded. After the whole board is scanned and the found matches have disappeared with points being shown, the tiles above the found matches fall down to fill in the gaps made. Because of this, more gaps are made and these are filled by random tiles that fall from the top of the screen. 

						[_][_][_][_][_][_]         [_][_][_][_][_][_]         [_][_]         [_]         [_][_][_][_][_][_]
						[_][_][_][_][_][_]         [_][_][_][_][_][_]         [_][_][_][_][_][_]         [_][_][_][_][_][_]
						[_][_][X][X][X][_]    →    [_][_]         [_]    →    [_][_][_][_][_][_]    →    [_][_][_][_][_][_]
						[_][_][_][_][_][_]         [_][_][_][_][_][_]         [_][_][_][_][_][_]         [_][_][_][_][_][_]

		After this, the board is scanned again for new potential matches. This will keep happening until there are no matches on the board and the player is allowed to interact with the board again. 

		If there happens to be no available moves on the board, the whole board is cleared and the player is awarded points equal to the number of tiles that are on the board. The board is then refilled and the process continues. 

		This process will keep happening as long as there is time on the timer. Once the time runs out, the game is over. 


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
			Assign the sounds that you defined in [ audio_files ] to different parts of the game. 

						"button_press_sound": "sound_1" 

	[ sprite_adjustment ]
			Modify these values to make small adjustments to the positioning of certain elements in the game. 

	[ game_sprites ]
			This is where you provide the paths to the sprites you want the game to be using. 

						"background_image": "assets/images/MyBackgroundImage.png" 

	[ game_tiles ]
			The game tiles section contains an array of the tiles. Each tile being made up of the "main_sprite_source" which is its default sprite and its "disappear_animation_frames" which is just an array of images to act as the frames of the animation. The animation is called when there is a match on the board during gameplay and the tiles disappear. 

	[ dialog_box_settings ]
			... Incomplete section ... 

			The dialog boxes that appear in the game are built off of the data put in this section. There are some default settings that can be modified at the top of this section, but below those are the 7 dialog boxes that can be changed. Each one has a "max_width" and "max_height" to keep its width from getting too large if needed. 

			There is a "text_components" section in each dialog box. This is an array of objects that contain information about a line of text that should be put into the dialog box. To insert a new line in the dialog box, put this into the array and modify it so that it is what you want: 

						{   
							"type": "DEFAULT",
		                    "text": "This text is to test the dialog boxes.", 
		                    "style": { "font": "18px font_1", "fill": "#ffffff" },
		                    "align": "center" 
		                }

		    If the "type" is set to "DEFAULT" then the text will be displayed normally. If it is set to "SCORE" then the score obtained while playing the game will be displayed in front of the text that put in "text". 

		    "text" is the text that you want shown on the line. 

		    "style" is the style of the text in "text". 

		    "align" is the alignment of the text in "text". 

		    Each dialog box also has buttons. The number of buttons and action of these can't be changed, but the text that shows up on these buttons can be changed. 












