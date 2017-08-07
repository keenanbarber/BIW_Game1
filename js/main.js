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






/*****************
 * SORT TESTING
 *****************/

// function item (cost, foundOnRow, quality) {
// 	let obj = {};
// 	obj.cost = cost;
// 	obj.foundOnRow = foundOnRow;
// 	obj.quality = quality;
// 	return obj;
// };

// var itemList = [
// 	item(2.15, 1, 'used'), 
// 	item(5.99, 3, 'good'), 
// 	item(3.00, 1, 'used'), 
// 	item(10.00, 2, 'good'), 
// 	item(4.92, 2, 'good'), 
// 	item(7.50, 3, 'poor'), 
// 	item(1.06, 3, 'used'), 
// 	item(12.57, 1, 'good'), 
// 	item(7.50, 3, 'poor')
// ];

// var sortBy = 'asc';

// function testAsc (x, y) {
// 	return x < y ? -1 : x > y ? 1 : 0;
// }
// function testDesc (x, y) {
// 	return x < y ? 1 : x > y ? -1 : 0;
// }
// const qualityToValue = (str) => {
// 	if(str === 'good') 
//         return 0;
//     else if(str === 'used')  
//         return 1;
//     else if(str === 'poor') 
//         return 2;
//     else // Anything else...
//         return 3; 
// }

// itemList.sort( ( a, b ) => {
//     switch ( sortBy ) {
//         case 'asc':
//             return testAsc( a.foundOnRow, b.foundOnRow) || testAsc( qualityToValue(a.quality), qualityToValue(b.quality) ) || testAsc( a.cost, b.cost);
//         case 'desc':
//             return testDesc( a.foundOnRow, b.foundOnRow) || testAsc( qualityToValue(a.quality), qualityToValue(b.quality) ) || testAsc( a.cost, b.cost)
//         default:
//             console.error( 'Sort by value does not match "asc" or "desc"' );
//             return;
//     }
// } );

// // print out resulting list
// for(let i = 0; i < itemList.length; i++) {
// 	console.log("[" + i + "] Item - ROW: " + itemList[i].foundOnRow + ", " + itemList[i].quality);
// 		//+ ", COST: $" + itemList[i].cost);
// }

        // console.log(a[ 0 ][ 'firstName' ] + " " + a[ 0 ][ 'lastName' ] + " status: " + a[ sortIndex ][ 'secondaryLabel' ] + ", value: " + a[ sortIndex ][ 'value' ]);





