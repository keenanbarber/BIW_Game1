var MyGame = MyGame || {};
var device;
var deviceOrientation;

var tweenManager = GroupTweenManager();
var gameTileKeys = [];

// Default values if not provided by json file
var configuration = {
	'game_width_max' : 1000,
	'game_width_min' : 400,
	'game_height_max' : 1000,
	'game_height_min' : 400,

	'min_swipe_length' : 40,
	'transition_easing' : Phaser.Easing.Circular.InOut,
	'transition_time' : 800,

	'board_rows' : 6, 
	'board_columns' : 6, 
	
	'tile_padding' : 6, 
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



function UpdateGameWindow(theGame) {
	let desiredWidth = Math.max(
		Math.min(configuration.game_width_max, window.innerWidth), 
		configuration.game_width_min
	); 
	let desiredHeight = Math.max(
		Math.min(configuration.game_height_max, window.innerHeight), 
		configuration.game_height_min
	);

	theGame.scale.refresh();
	theGame.scale.setGameSize(desiredWidth, desiredHeight);
}








