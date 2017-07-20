var MyGame = MyGame || {};
var device;
var deviceOrientation;

var tweenManager = GroupTweenManager();
var gameTileKeys = [];

var configuration = {
	'canvas_width_max' : 1000,
	'canvas_width_min' : 400,
	'canvas_width' : 400,
	'canvas_height_max' : 1000,
	'canvas_height_min' : 400,
	'canvas_height' : 650,
	// 'scale_ratio' : 1,
	'min_swipe_length' : 40,
	'aspect_ratio' : 1,
	'transition_easing' : Phaser.Easing.Circular.InOut,
	'transition_time' : 800,
	'board_columns' : 6, 
	'board_rows' : 6, 
	'tile_padding' : 6, 
	'number_of_tiles' : 4, // Up to 5 right now
	'min_required_tiles_for_points' : 3
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
	configuration.canvas_width = Math.min(window.screen.availWidth * window.devicePixelRatio, 500);
	configuration.canvas_height = window.screen.availHeight * window.devicePixelRatio;

	// game.scale.setGameSize(configuration.canvas_width, configuration.canvas_height);
	// game.camera.setSize(width, height);
	// game.renderer.resize(width, height);

	theGame.scale.refresh();
	theGame.scale.setGameSize(
		Math.max(
			Math.min(configuration.canvas_width_max, window.innerWidth), 
			configuration.canvas_width_min
		),
		Math.max(
			Math.min(configuration.canvas_height_max, window.innerHeight), 
			configuration.canvas_height_min
		)
	);


	// console.log("WINDOW SIZE: " + window.innerWidth + ", " + window.innerHeight);
	

	// configuration.aspect_ratio = configuration.canvas_width / configuration.canvas_height;
	// if (configuration.aspect_ratio < 1) configuration.scale_ratio = configuration.canvas_height / configuration.canvas_height_max;
	// else configuration.scale_ratio = configuration.canvas_width / configuration.canvas_width_max;
}








