
/*_______________________________________
		TRANSITIONS 					|
_________________________________________
EXAMPLE
	o transitionTypes: 
		- Phaser.Easing.Bounce.Out
		- Phaser.Easing.Cubic.In
		- Phaser.Easing.Linear.None

	init()...
	exitPreviousScene(previousState.sceneProps, TranslateTween("CENTER_TO_LEFT", 1000, Phaser.Easing.Bounce.Out));

	create()...
	enterNewScene(this.sceneProps, TranslateTween("RIGHT_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));
________________________________________*/
function TranslateTween(direction, duration, easing) {
	let obj = {};
	obj.tweenType = "TRANSLATE";
	obj.direction = direction;
	obj.duration = duration;
	obj.easing = easing;

	obj.start_x = 0;
	obj.start_y = 0;
	obj.end_x = 0; 
	obj.end_y = 0;
	switch(direction) {
		case "LEFT_TO_CENTER": 
			obj.start_x = -game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
			break; 
		case "RIGHT_TO_CENTER": 
			obj.start_x = game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "TOP_TO_CENTER": 
			obj.start_x = 0;
			obj.start_y = -game.scale.height;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "BOTTOM_TO_CENTER": 
			obj.start_x = 0;
			obj.start_y = game.scale.height;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "CENTER_TO_LEFT": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = -game.scale.width;
			obj.end_y = 0;
			break;
		case "CENTER_TO_RIGHT": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = game.scale.width;
			obj.end_y = 0;
			break;
		case "CENTER_TO_TOP": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = -game.scale.height;
			break;
		case "CENTER_TO_BOTTOM": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = game.scale.height;
			break;
		default: 
			console.log("ERROR: Unable to perform that specific TRANSLATE transition.")
			obj.start_x = -game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
	}
	return obj;
}
function FadeTween(direction, duration, easing) {
	let obj = {};
	obj.tweenType = "FADE";
	obj.direction = direction;
	obj.duration = duration;
	obj.easing = easing;

	obj.start_a = 0; 
	obj.end_a = 0;
	switch(direction) {
		case "FADE_OUT": 
			obj.start_a = 1;
			obj.end_a = 0;
			break; 
		case "FADE_IN": 
			obj.start_a = 0;
			obj.end_a = 1;
			break;
		default: 
			console.log("ERROR: Unable to perform that specific FADE transition.")
			obj.start_a = 1;
			obj.end_a = 0;
	}
	return obj;
}
function TweenProps(props, _tween) {
	let tween;
	switch(_tween.tweenType) {
		case "TRANSLATE": 
			props.x = _tween.start_x;
			props.y = _tween.start_y;
			tween = game.add.tween(props).to({x: _tween.end_x, y: _tween.end_y}, _tween.duration, _tween.easing, true);
			break;
		case "FADE": 
			props.alpha = _tween.start_a;
			tween = game.add.tween(props).to({ alpha: _tween.end_a }, _tween.duration, _tween.easing, true);
			break;
		default: 
			console.log("ERROR: Failed to tween properly.");
	}
	return tween;
}
function EnterNewScene(newScenesProps, _tween) {
	let tween = TweenProps(newScenesProps, _tween);
	//tween.onComplete.add(clearSceneProps, this);
	tweenManager.addTween(tween);
}
function ExitPreviousScene(previousScenesProps, _tween) {
	let tween = TweenProps(previousScenesProps, _tween);
	tween.onComplete.add(function() { ClearSceneProps(previousScenesProps); }, this);
	tweenManager.clearTweenArray();
	tweenManager.addTween(tween);
}
function ClearSceneProps(group) {
	group.removeAll();
}




/*_______________________________________
		Tweenimation					|
_________________________________________*/
function Tweenimate_ElasticScale(prop, goalScaleX, goalScaleY, duration) {
	let tween = game.add.tween(prop.scale).to({ x: goalScaleX, y: goalScaleY }, duration, Phaser.Easing.Elastic.Out, true);
}
function Tweenimate_ElasticTranslate(prop, goalPosX, goalPosY, duration) {
	let tween = game.add.tween(prop).to({ x: goalPosX, y: goalPosY }, duration, Phaser.Easing.Elastic.Out, true);
}
function Tweenimate_BounceTranslate(prop, goalPosX, goalPosY, duration) {
	let tween = game.add.tween(prop).to({ x: goalPosX, y: goalPosY }, duration, Phaser.Easing.Bounce.Out, true);
}
function Tweenimate_Breathe(prop, maxScaleX, maxScaleY, duration) {
	let tween = game.add.tween(prop.scale).to({ x: maxScaleX, y: maxScaleY }, duration/2, Phaser.Easing.Exponential.Out, true);
	tween.onComplete.addOnce(function() {
		tween = game.add.tween(prop.scale).to({ x: 1, y: 1 }, duration/2, Phaser.Easing.Exponential.Out, true);
	}, this);
}
function Tweenimate_SpinWobble(prop, goalAngle, duration) {
	let tween = game.add.tween(prop).to({ angle: goalAngle }, duration, Phaser.Easing.Elastic.Out, true);
}
function Tweenimate_TintSprite(prop, goalColor, duration) { // ????????????????
	let tween = game.add.tween(prop).to({ tint: goalColor }, duration, Phaser.Easing.Linear.None, true);
}





/*_______________________________________
		GROUP TWEEN ON COMPLETE			|
_________________________________________*/
function GroupTweenManager() {
	let obj = {};
	obj.tweenArray = [];
	obj.funcToCallOnComplete;
	obj.bool = false;

	obj.callOnComplete = function(func) {
		this.bool = false;
		this.funcToCallOnComplete = func;
	};
	obj.addTween = function(_tween) {
		this.tweenArray.push(_tween);
		_tween.onComplete.addOnce(function() {
			this.tweenArray.pop(_tween);
			// console.log(this.tweenArray.length + " tweens remaining.")
			if(this.tweenArray.length == 0 && this.bool == false) {
				if(this.funcToCallOnComplete) {
					game.time.events.add(Phaser.Timer.SECOND * 0.1, this.funcToCallOnComplete, this);
				}
				this.bool = true;
			}
		}, this);
	};
	obj.clearTweenArray = function() {
		// for(let i = 0; i < this.tweenArray.length; i++) {
		// 	this.tweenArray[i].stop(true);
		// }
		this.tweenArray = [];
	};
	obj.getSize = function() {
		return this.tweenArray.length;
	}

	return obj;
}





/*_______________________________________
		TEXT 							|
_________________________________________
EXAMPLE: 

	textTest = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
	textTest.setPartialColor(1, 2, "orange");
_________________________________________*/
function Text(t, style) {
	let obj = {};
	obj.textObj = game.add.text(game.world.centerX, game.world.centerY, t, style);
    obj.textObj.anchor.set(0.5);

    obj.baseColor = (style.fill ? style.fill : 'white');
    obj.textObj.fill = obj.baseColor;
    
    obj.setFullColor = function(col) {
    	this.textObj.fill = col;
    	this.baseColor = col;
    };
    obj.setPartialColor = function(x1, x2, newColor) {
		this.textObj.addColor(newColor, x1);
	    this.textObj.addColor(this.baseColor, x2);
    };
    obj.getText = function() {
    	return this.textObj.text;
    };
    obj.getTextObject = function() {
    	return this.textObj;
    };
    return obj;
};



/*_______________________________________
		SPRITE BUTTON					|
_________________________________________
EXAMPLE: 

	let testButton = SpriteButton(400, 350, 'test_image', 
		function() { //On mouse over...
			console.log("Over");
		}, 
		function() { //On mouse off...
			console.log("Off");
		},
		function() { //On mouse down...
			console.log("Down");
		}, 
		function() { //On mouse up...
			console.log("Up");
		}
	);
_________________________________________*/
function SpriteButton(x, y, imageKey) {
	let obj = {};
	obj.sprite = game.add.sprite(x, y, imageKey);
	obj.sprite.anchor.set(0.5);
	obj.sprite.inputEnabled = true;
	obj.intendedScale = new Phaser.Point(1, 1);;

	obj.onInputOverFunc;
	obj.onInputOutFunc;
	obj.onInputDownFunc;
	obj.onInputUpFunc;
	obj.onInputClickFunc;

	obj.inputOver = false;
	obj.inputOut = false;
	obj.inputDown = false;
	obj.inputUp = false;

	obj.sprite.events.onInputOver.add(function() {
		obj.inputOver = true;
		obj.inputOut = false;
		if(obj.onInputOverFunc) {
			obj.onInputOverFunc();
		}
	}, this);
	obj.sprite.events.onInputOut.add(function() {
		obj.inputOut = true;
		obj.inputOver = false;
		if(obj.onInputOutFunc) {
			obj.onInputOutFunc();
		}
	}, this);
	obj.sprite.events.onInputDown.add(function() {
		obj.inputDown = true;
		obj.inputUp = false;
		if(obj.onInputDownFunc) {
			obj.onInputDownFunc();
		}
	}, this);
	obj.sprite.events.onInputUp.add(function() {
		obj.inputUp = true;
		obj.inputDown = false;
		if(obj.onInputUpFunc) {
			obj.onInputUpFunc();
		}
		if(obj.inputOver) {
			if(obj.onInputClickFunc) {
				obj.onInputClickFunc();
			}
		}
	}, this);

	obj.getSprite = function() {
		return this.sprite;
	};
	obj.setBehaviors = function(inputOverFunc, inputOutFunc, inputDownFunc, inputUpFunc) {
		this.onInputOverFunc = inputOverFunc;
		this.onInputOutFunc = inputOutFunc;
		this.onInputDownFunc = inputDownFunc;
		this.onInputUpFunc = inputUpFunc;
	};
	obj.setClickBehavior = function(onInputClickFunc) {
		// console.log(this.onInputUpFunc);
		this.onInputClickFunc = onInputClickFunc;
	};
	obj.updateIntendedScale = function() {
		this.intendedScale = new Phaser.Point(this.sprite.scale.x, this.sprite.scale.y);
	};
	obj.getIntendedScale = function() {
		return this.intendedScale;
	};

    return obj;
};



/*_______________________________________
		FLIP SPRITES					|		<---- May not quite work...
_________________________________________*/
function FlipSprite(sprite, axis, anchor_x, anchor_y) {
	let originalAnchor = sprite.anchor;
	
	switch(axis) {
		case "X_AXIS": 
			sprite.anchor.setTo(anchor_x, anchor_y);
			sprite.scale.x = -sprite.scale.x;
			sprite.anchor.setTo(originalAnchor.x, originalAnchor.y);
			break;
		case "Y_AXIS": 
			sprite.anchor.setTo(anchor_x, anchor_y);
			sprite.scale.y = -sprite.scale.y;
			sprite.anchor.setTo(originalAnchor.x, originalAnchor.y);
			break;
		default: 
			console.log("ERROR: Failed to flip the sprite on that axis. ");
			sprite.anchor.setTo(anchor_x, anchor_y);
			sprite.scale.x = -sprite.scale.x;
			sprite.anchor.setTo(originalAnchor.x, originalAnchor.y);
			break;
	}
}


/*_______________________________________
		PHYSICS 						|
_________________________________________
EXAMPLE: 

	var physics = Physics();

	physics.applyPhysicsTo(thing1);
	physics.setGravity(thing1, 0, 500);
	physics.collideWorldBounds(thing1, true);
	physics.setBounce(thing1, 0.8);
_________________________________________*/

function Physics() {
	let obj = {};
    game.physics.startSystem(Phaser.Physics.ARCADE);

    obj.applyPhysicsTo = function(thing) {
    	game.physics.enable(thing, Phaser.Physics.ARCADE);
    };
    obj.beginCollisionBetween = function(thing1, thing2, whatToCallWhenCollides) {
    	game.physics.arcade.collide(ball, bricks, whatToCallWhenCollides, null, this);
    };
    obj.setBounce = function(thing, value) {
    	thing.body.bounce.set(value);
    };
    obj.setImmovable = function(thing, bool) {
    	thing.body.immovable = bool;
    };
    obj.setGravity = function(thing, xDir, yDir) {
    	thing.body.gravity.set(xDir, yDir);
    };
    obj.checkOverlap = function(thing1, thing2, whatToCallWhenOverlaps) {
    	return game.physics.arcade.overlap(thing1, thing2, whatToCallWhenOverlaps, null, this);
    };
    obj.collideWorldBounds = function(thing, bool) {
    	thing.body.collideWorldBounds = bool;
    };

    return obj;
};


/*_______________________________________
		RANDOM BETWEEN NUMBERS			|
_________________________________________*/
function RandomBetween(n1, n2) { // Inclusive
	return (n1-1) + Math.ceil(Math.random() * (n2-(n1-1)));
}


/*_______________________________________
		ACCELEROMETER					|
_________________________________________*/
function AccessAccelerometer(sendDataTo) {
	let obj = {};
	obj.x = 0; 
	obj.y = 0; 
	obj.z = 0;
	
	obj.storeData = function(e) {
		this.x = e.gamma;
		this.y = e.beta;
		this.z = e.alpha;
		//console.log("Accelerometer: x=" + this.x + ", y=" + this.y + ", z=" + this.z);
	};
	obj.getData = function() {
	    return {"x": this.x, 
				"y": this.y, 
				"z": this.z}
	};
	obj.startReading = function() {
		window.addEventListener("deviceorientation", this.storeData, true); 
	};
	return obj;
}



function test() {
	console.log("This is a test.");
}







function ScaleSprite(sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	//var scale = this.getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
	
	let currentDevicePixelRatio = window.devicePixelRatio;

	let spriteWidth = sprite._frame.width;
	let spriteHeight = sprite._frame.height;

	let widthRatio = ((availableSpaceWidth) - (2*padding*currentDevicePixelRatio)) / (spriteWidth);
	let heightRatio = ((availableSpaceHeight) - (2*padding*currentDevicePixelRatio)) / (spriteHeight);
	
	let scale = Math.min(widthRatio, heightRatio);
	
	sprite.scale.setTo(scale * scaleMultiplier, scale * scaleMultiplier);
	game.scale.refresh();

	
	// console.log("Pixel Ratio: " + currentDevicePixelRatio);
	// console.log("Screen Width: " + availableSpaceWidth + ", Screen Height: " + availableSpaceHeight);
	// console.log("(" + availableSpaceWidth + " + (" + (2*padding) + ")) / " + spriteWidth  + " = " + widthRatio);
	// console.log("(" + availableSpaceHeight + " + (" + (2*padding) + ")) / " + spriteHeight + " = " + heightRatio);
	// console.log("Scale: " + scale);
	// console.log("Sprite Width: " + sprite.width + ", with padding of: " + (availableSpaceWidth-sprite.width));
	// console.log("Sprite Height: " + sprite.height + ", with padding of: " + (availableSpaceHeight-sprite.height));
	
}

function GetScaleSprite(sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	let currentDevicePixelRatio = window.devicePixelRatio;

	let spriteWidth = sprite._frame.width;
	let spriteHeight = sprite._frame.height;

	let widthRatio = ((availableSpaceWidth) - (2*padding*currentDevicePixelRatio)) / (spriteWidth);
	let heightRatio = ((availableSpaceHeight) - (2*padding*currentDevicePixelRatio)) / (spriteHeight);
	
	let scale = Math.min(widthRatio, heightRatio);
	
	return scale;
}

function ScaleText(text, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	let currentDevicePixelRatio = window.devicePixelRatio;
	let maxWidth = 200 * currentDevicePixelRatio;

	

	let textWidth = text.width;
	let textHeight = text.height;

	let widthRatio = ((availableSpaceWidth) - (2*padding*currentDevicePixelRatio)) / (textWidth);
	let heightRatio = ((availableSpaceHeight) - (2*padding*currentDevicePixelRatio)) / (textHeight);
	
	let scale = Math.min(widthRatio, heightRatio);


	text.scale.setTo((text.width * scale) / (text.width / text.scale.x), (text.width * scale) / (text.width / text.scale.x));
	game.scale.refresh();


	
	// console.log("Pixel Ratio: " + currentDevicePixelRatio);
	// console.log("Screen Width: " + availableSpaceWidth + ", Screen Height: " + availableSpaceHeight);
	// console.log("(" + availableSpaceWidth + " + (" + (2*padding) + ")) / " + spriteWidth  + " = " + widthRatio);
	// console.log("(" + availableSpaceHeight + " + (" + (2*padding) + ")) / " + spriteHeight + " = " + heightRatio);
	// console.log("Scale: " + scale);
	// console.log("Sprite Width: " + sprite.width + ", with padding of: " + (availableSpaceWidth-sprite.width));
	// console.log("Sprite Height: " + sprite.height + ", with padding of: " + (availableSpaceHeight-sprite.height));
	
}

function ScaleGroup(prop, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	//var scale = this.getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
	
	let currentDevicePixelRatio = window.devicePixelRatio;

	let spriteWidth = prop.width;
	let spriteHeight = prop.height;

	let widthRatio = ((availableSpaceWidth) - (2*padding*currentDevicePixelRatio)) / (spriteWidth);
	let heightRatio = ((availableSpaceHeight) - (2*padding*currentDevicePixelRatio)) / (spriteHeight);
	
	let scale = Math.min(widthRatio, heightRatio);
	
	prop.scale.set(scale * scaleMultiplier, scale * scaleMultiplier);
	game.scale.refresh();
	
}




function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username + " ");
    } else {
    	user = prompt("Please enter your name:", "");
        if (username == "" || username == null) {
            setCookie("username", "Keenan", 365);
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var deleteCookie = function(cname) {
    setCookie(cname, "", -1);
}
 


/*_______________________________________
	REFERENCE CODE						|
_________________________________________

	FOR COLORED TEXT... 
		text_test = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
		text_test.setPartialColor(1, 2, "orange");

	FOR PHYSICS... 
		physics.applyPhysicsTo(thing1);
		physics.setGravity(thing1, 0, 500);
		physics.collideWorldBounds(thing1, true);
		physics.setBounce(thing1, 0.8);

	FOR A SPRITE SHEET ANIMATION... 
		let spriteThing = game.add.sprite(500, 300, 'test_spritesheet');
		let walk = spriteThing.animations.add('walk', [1, 2, 3], 12, true, true); // anim name, frames to play, fps, loop?, useNumericIndex?
		spriteThing.animations.play('walk', 12, true);

_________________________________________*/
	




































