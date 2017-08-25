var MyGame = MyGame || {};
var device;
var deviceOrientation;
var devicePixelRatio;

var tweenManager = GroupTweenManager();
var currentState = null;
var gameTileDetails = [];

// Default values if not provided by json file
var configuration = {
	'desktop_min_width' : 1000,
	'desktop_min_height' : 400,
	'desktop_max_width' : 1000,
	'desktop_max_height' : 400,

	'min_swipe_length' : 20,
	'falling_tile_easing' : Phaser.Easing.Bounce.Out,
	'transition_easing' : Phaser.Easing.Circular.InOut,
	'tile_fall_time' : 800,
	'new_tile_fall_time' : 950,

	'game_duration' : 30,
	'board_rows' : 6, 
	'board_columns' : 6, 
	
	'tile_padding' : 8, 
	'min_tiles_required_for_match' : 3
};

var game = new Phaser.Game(configuration.canvas_width, configuration.canvas_height, Phaser.AUTO, "game_phaser", null, false, true);

game.state.add("BootState", new MyGame.BootState());
game.state.add("LoadingState", new MyGame.LoadingState());
game.state.add("MenuState", new MyGame.MenuState());
game.state.add("OptionsState", new MyGame.OptionsState());
game.state.add("GameState", new MyGame.GameState());
game.state.add("GameOverState", new MyGame.GameOverState());
game.state.start("BootState", true, false, "assets/json/game_details.json", 'game_phaser');

function updateGameWindow(theGame) {
	if(device === "DESKTOP") {
		let desiredWidth = Math.max(
			Math.min(configuration.desktop_max_width, window.innerWidth), 
			configuration.desktop_min_width
		); 
		let desiredHeight = Math.max(
			Math.min(configuration.desktop_max_height, window.innerHeight), 
			configuration.desktop_min_height
		);
		theGame.scale.setGameSize(desiredWidth, desiredHeight);
	}
	devicePixelRatio = window.devicePixelRatio;
	theGame.scale.refresh();
}





