
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
	tweenManager.clear();
	tweenManager.addTween(tween);
}
function ClearSceneProps(group) {
	while(group.length != 0) {
		let removedElement = group.removeChildAt(0);
		removedElement.destroy();
	}
	group.removeAll();
}




/*_______________________________________
		Simplified Animations			|
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
	let originalScale = prop.scale;
	let tween = game.add.tween(prop.scale).to({ x: maxScaleX, y: maxScaleY }, duration/2, Phaser.Easing.Exponential.Out, true);
	tween.onComplete.addOnce(function() {
		tween = game.add.tween(prop.scale).to({ x: originalScale.x, y: originalScale.y }, duration/2, Phaser.Easing.Exponential.Out, true);
	}, this);
}
function Tweenimate_SpinWobble(prop, goalAngle, duration) {
	let tween = game.add.tween(prop).to({ angle: goalAngle }, duration, Phaser.Easing.Elastic.Out, true);
}





function ChangeSpriteOnTweenComplete(tween, oldSprite, newSpriteKey) {
	tween.onComplete.addOnce(function() { // Once completed...
		oldSprite.loadTexture(newSpriteKey);
	}, this);
}



/*_______________________________________
		GROUP TWEEN ON COMPLETE			|
_________________________________________*/
function GroupTweenManager() {
	let obj = {};
	obj.tweenArray = [];
	obj.animArray = [];
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
			if(this.tweenArray.length == 0 && this.animArray.length == 0 && this.bool == false) {
				if(this.funcToCallOnComplete) {
					game.time.events.add(0, this.funcToCallOnComplete, this); // Slight delay before calling on complete
				}
				this.bool = true;
			}
		}, this);
	};
	obj.addAnimation = function(_anim) {
		let obj = this;
		this.animArray.push(_anim);
		_anim.addCallOnComplete(function() {
			obj.animArray.pop(_anim);
			// console.log(obj.tweenArray.length + " + " + obj.animArray.length + " things remaining.")
			if(obj.tweenArray.length == 0 && obj.animArray.length == 0 && obj.bool == false) {
				if(obj.funcToCallOnComplete) {
					game.time.events.add(0, obj.funcToCallOnComplete, this); // Slight delay before calling on complete
				}
				obj.bool = true;
			}
		});
	};
	obj.clear = function() {
		// for(let i = 0; i < this.tweenArray.length; i++) {
		// 	this.tweenArray[i].stop(true);
		// }
		this.tweenArray = [];
		this.animArray = [];
	};
	obj.getSize = function() {
		return (this.tweenArray.length + this.animArray.length);
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
function MyText(t, style) {
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
	obj.destroy = function() {
		obj.sprite.destroy();
	};

    return obj;
};


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



function ScaleSprite(sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	//var scale = this.getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
	
	let currentDevicePixelRatio = window.devicePixelRatio;

	let spriteWidth = sprite._frame.width;
	let spriteHeight = sprite._frame.height;

	let widthRatio;
	if(availableSpaceWidth != null)
		widthRatio = ((availableSpaceWidth) - (2*padding)) / (spriteWidth);

	let heightRatio;
	if(availableSpaceHeight != null)
		heightRatio = ((availableSpaceHeight) - (2*padding)) / (spriteHeight);
	
	let scale;
	if(availableSpaceWidth == null) {
		scale = heightRatio;
	}
	else if(availableSpaceHeight == null) {
		scale = widthRatio;
	}
	else  {
		scale = Math.min(widthRatio, heightRatio);
	}
	
	sprite.scale.setTo(scale * scaleMultiplier, scale * scaleMultiplier);
	game.scale.refresh();
}

function GetScaleSprite(sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	let currentDevicePixelRatio = window.devicePixelRatio;

	let spriteWidth = sprite._frame.width;
	let spriteHeight = sprite._frame.height;

	let widthRatio = ((availableSpaceWidth) - (2*padding)) / (spriteWidth);
	let heightRatio = ((availableSpaceHeight) - (2*padding)) / (spriteHeight);
	
	let scale = Math.min(widthRatio, heightRatio);
	
	return scale;
}

function ScaleGroup(prop, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
	//var scale = this.getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
	let spriteWidth = prop.width;
	let spriteHeight = prop.height;

	let widthRatio;
	if(availableSpaceWidth != null)
		widthRatio = ((availableSpaceWidth) - (2*padding)) / (spriteWidth);

	let heightRatio;
	if(availableSpaceHeight != null)
		heightRatio = ((availableSpaceHeight) - (2*padding)) / (spriteHeight);
	
	let scale;
	if(availableSpaceWidth == null) {
		scale = heightRatio;
	}
	else if(availableSpaceHeight == null) {
		scale = widthRatio;
	}
	else  {
		scale = Math.min(widthRatio, heightRatio);
	}
	
	prop.scale.setTo(scale * scaleMultiplier, scale * scaleMultiplier);
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
 
/* EXAMPLE
*************************
	myDialogBox1 = DialogBox(game.world.centerX, game.world.centerY, 300);
	myDialogBox1.addTextSegment("CONGRATULATIONS!", { font: "22px font_2", fill: '#ffffff' }, 'center', 'top');
	myDialogBox1.addTextSegment("YOU'VE WON", { font: "14px font_1", fill: '#ffffff' }, 'center');
	myDialogBox1.addTextSegment(score, { font: "40px font_2", fill: '#7ffff4' }, 'center');
	myDialogBox1.addTextSegment("POINTS!", { font: "14px font_1", fill: '#ffffff' }, 'center');
	myDialogBox1.addButton('CLAIM NOW', null,
	 	function() { //On click...
			// obj.myDialogBox1.hide();
			obj.game.state.start("MenuState", false, false, obj.sceneProps, "CENTER_TO_RIGHT", "LEFT_TO_CENTER");
		}
	);
	sceneProps.add(myDialogBox1.getGroup());
*/

function DialogBox(x, y, availableSpaceWidth) {
	let obj = {};

	obj.useDefaultBackground = true;

	obj.boxWidth = availableSpaceWidth;
	obj.boxHeight = 150;
	obj.boxX = x; 
	obj.boxY = y;
	obj.roundedCornerRadius_container = 15;
	obj.roundedCornerRadius_buttons = 8;
	

	obj.defaultBackgroundColor = game_details_data.dialog_box_settings.default_dialog_box_background_color.replace('#', '0x');
	obj.defaultBackgroundAlpha = game_details_data.dialog_box_settings.default_dialog_box_background_alpha;
	obj.defaultOutlineColor = game_details_data.dialog_box_settings.default_dialog_box_outline_color.replace('#', '0x');
	obj.defaultOutlineSize = game_details_data.dialog_box_settings.default_dialog_box_outline_size;
	
	// obj.buttonText = game.add.group();
	obj.canPressButtons = true;

	let graphics = game.add.graphics(0, 0);
	graphics.beginFill(obj.defaultBackgroundColor, obj.defaultBackgroundAlpha);
	graphics.lineStyle(obj.defaultOutlineSize, obj.defaultOutlineColor, 1);
	graphics.drawRoundedRect(0, 0, obj.boxWidth, obj.boxHeight, obj.roundedCornerRadius_container); 
	graphics.endFill();

	let graphicsTexture = graphics.generateTexture();
	graphics.destroy();

	obj.graphicsSprite = game.add.sprite(0, 0, graphicsTexture);
	obj.graphicsSprite.anchor.setTo(0.5);	
	obj.originalBackgroundWidth = obj.graphicsSprite.width;

	obj.buttonSprites = [];
	obj.buttonGroup = game.add.group();
	obj.textGroup = game.add.group();
	obj.contentsGroup = game.add.group();
	obj.contentsGroup.add(obj.buttonGroup);
	obj.contentsGroup.add(obj.textGroup);

	obj.dialogBoxGroup = game.add.group();
	obj.dialogBoxGroup.add(obj.graphicsSprite);
	obj.dialogBoxGroup.add(obj.contentsGroup);

	obj.textHeight = 0;
	obj.largestButtonTexture = null;
	obj.myTimer = null;

	// Spacing
	obj.textButtonSpacing = 10; 
	obj.contentsPadding = 10;
	obj.buttonTextPadding = 10;
	obj.buttonSpacing = 10;
	obj.buttonOffsets = [ // Point for each button
		new Phaser.Point(0, 0)
	];
	obj.textYOffsets = []; // Value for each text segment
	

	obj.setSpacing = function(contentsPadding, buttonTextWidthPadding, textButtonSpacing, buttonSpacing) {
		obj.contentsPadding = contentsPadding;
		obj.buttonTextPadding = buttonTextWidthPadding;
		obj.textButtonSpacing = textButtonSpacing; 
		obj.buttonSpacing = buttonSpacing;

		for(let i = 0; i < obj.textGroup.children.length; i++) {
			obj.textGroup.getAt(i).wordWrapWidth = (obj.boxWidth - (2 * contentsPadding));
		}

		obj.resize();
	};

	obj.setOffsets = function() {

	};

	obj.destroy = function() {
		obj.contentsGroup.destroy();
	};

	obj.show = function() {
		// When created, grow into the screen.
		obj.dialogBoxGroup.visible = true;
		obj.dialogBoxGroup.scale.x = 0;
		obj.dialogBoxGroup.scale.y = 0;
		obj.dialogBoxGroup.alpha = 0;
		Tweenimate_ElasticScale(obj.dialogBoxGroup, 1, 1, 1200);
		let tweenAppear = game.add.tween(obj.dialogBoxGroup).to({ alpha: 1 }, 1200, Phaser.Easing.Quartic.Out, true);
	};

	obj.hide = function() {
		let tweenShrink = game.add.tween(obj.dialogBoxGroup.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Quartic.In, true);
		let tweenDisappear = game.add.tween(obj.dialogBoxGroup).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
		let thisObj = obj;
		tweenShrink.onComplete.addOnce(function() {
			thisObj.dialogBoxGroup.visible = false;
		}, this);
	};

	obj.setLifetime = function(time, funcToCallOnComplete) {
		let myFunc = function() {
			if(funcToCallOnComplete)
				funcToCallOnComplete();
			obj.hide
		};
		obj.myTimer = game.time.create(false);
		obj.myTimer.add(time, myFunc, this);
		obj.myTimer.start(0);
	};

	obj.setBackgroundSprite = function(spriteKey) {
		obj.useDefaultBackground = false;

		obj.graphicsSprite.loadTexture(spriteKey);
		obj.graphicsSprite.width = obj.boxWidth;
		obj.graphicsSprite.height = obj.boxHeight;

		let tempSprite = game.add.sprite(0, 0, spriteKey);
		obj.originalBackgroundWidth = tempSprite.width;
		tempSprite.destroy();

		obj.resize();
	};

	obj.addTextSegment = function(text, style, horizontalAlign, yOffset) {
		obj.textYOffsets.push( yOffset );

		let horizontalTextAlign = horizontalAlign;
		let textX = obj.graphicsSprite.x - obj.graphicsSprite.width/2 + obj.contentsPadding;
		let textY = obj.graphicsSprite.y - obj.graphicsSprite.height/2 + obj.contentsPadding;
		let anchorX = 0;
		let anchorY = 0;
		if(horizontalTextAlign === 'center') {
			textX = 0;
			anchorX = 0.5;
		}
		else if(horizontalTextAlign === 'left') {
			textX = -obj.graphicsSprite.width/2 + obj.contentsPadding;
		}
		textY = -obj.graphicsSprite.height/2 + obj.contentsPadding;

		let myStyle = style;
		myStyle.wordWrap = true;
		myStyle.wordWrapWidth = obj.boxWidth - (2 * obj.contentsPadding);

		let myText = game.add.text(textX, textY, text, myStyle);

		myText.anchor.setTo(anchorX, anchorY);
		myText.align = horizontalTextAlign;
		// myText.padding.set(4, 4);

		obj.textGroup.add(myText)

		obj.resize();
	};

	obj.addButton = function(text, desiredSpriteKey, clickFunc) {
		// Text on button
		let buttonTextStyle = game_details_data.dialog_box_settings.button_text_style; // #68588C
		let buttonText = game.add.text(0, 0, text, buttonTextStyle);
		// buttonText.fontSize *= devicePixelRatio;
		buttonText.anchor.setTo(0.5, 0.4);
		buttonText.align = 'center';


		// The button
		let button = game.add.group();

		let buttonGraphic; 
		if(desiredSpriteKey === null) {
			graphics = game.add.graphics(0, 0);
			graphics.beginFill(0xffffff, 1.0);
			// graphics.lineStyle(1, 0x68588C, 1);
			graphics.drawRoundedRect(0, 0, buttonText.width + (2 * obj.buttonTextPadding), buttonText.height, obj.roundedCornerRadius_buttons); 
			graphics.endFill();

			let buttonTexture = graphics.generateTexture();
			graphics.destroy();
			buttonGraphic = SpriteButton(0, 0, buttonTexture);

			if(obj.largestButtonTexture == null) {
				obj.largestButtonTexture = buttonTexture;
			}
			else if(buttonTexture.width > obj.largestButtonTexture.width) {
				obj.largestButtonTexture = buttonTexture;
			}
		}
		else {
			buttonGraphic = SpriteButton(0, 0, desiredSpriteKey);
		}
		
		buttonGraphic.setBehaviors(
			function() { //On mouse over...
				let newScale = (this.getSprite().width + obj.contentsPadding) / this.getSprite().width;
				Tweenimate_ElasticScale(this.getSprite(), 1.2, 1, 1000);
				game.canvas.style.cursor = "pointer";
			}, 
			function() { //On mouse off...
				Tweenimate_ElasticScale(this.getSprite(), 1, 1, 1000);
				game.canvas.style.cursor = "default";
			},
			function() { //On mouse down...
			}, 
			function() { //On mouse up...
			}
		);
		buttonGraphic.setClickBehavior(function() {
			if(obj.canPressButtons) {
				clickFunc();
				obj.canPressButtons = false;
			}
		});
		button.add(buttonGraphic.getSprite());
		button.add(buttonText);
		obj.buttonGroup.add(button);
		obj.buttonSprites.push( buttonGraphic.getSprite() );

		obj.resize();
	};

	obj.updateButtonSizes = function() {
		for (let i = 0; i < obj.buttonSprites.length; i++) {
			console.log( 'Updating Sizes: ' + i );
			obj.buttonSprites[i].loadTexture(obj.largestButtonTexture);
		}
	};

	obj.resize = function() { 
		let expectedButtonHeight = ( obj.buttonGroup.length > 0 ) ? ( ( obj.buttonGroup.getAt(0).getAt(0).height + obj.buttonSpacing ) * obj.buttonGroup.length ) - obj.buttonSpacing : 0;
		obj.boxHeight = obj.textGroup.height + obj.textButtonSpacing + expectedButtonHeight + ( obj.contentsPadding * 2 ) + 2; // +2 for the couple extra pixels at the end?

		// Update the alignment of left aligned text.
		for (let i = 0; i < obj.textGroup.children.length; i++) { 
			if(obj.textGroup.getAt(i).align !== 'center') {
				obj.textGroup.getAt(i).x = -obj.boxWidth/2 + obj.contentsPadding;
			}
		}

		// Update the text group's position.
		let tempTextHeight = 0;
		for (let i = 0; i < obj.textGroup.children.length; i++) {
			// console.log(obj.textGroup[i]);
			let textYOffset = ( i < obj.textYOffsets.length ) ? obj.textYOffsets[i] : 0;
			obj.textGroup.getAt(i).y = -obj.boxHeight/2 + obj.contentsPadding + tempTextHeight + textYOffset;
			tempTextHeight += obj.textGroup.getAt(i).height + textYOffset;
		}
		tempTextHeight += obj.textButtonSpacing;

		// Update the position of the buttons.
		if(obj.buttonGroup.length > 0) {
			let tempButtonHeight = 0;
			for (let i = 0; i < obj.buttonGroup.length; i++) {
				let buttonOffset = ( i < obj.buttonOffsets.length ) ? obj.buttonOffsets[i] : new Phaser.Point(0, 0);
				obj.buttonGroup.getAt(i).x = buttonOffset.x;
				obj.buttonGroup.getAt(i).y = -obj.boxHeight/2 + obj.buttonGroup.getAt(i).height/2 + tempTextHeight + tempButtonHeight + obj.contentsPadding + buttonOffset.y;
				tempButtonHeight += obj.buttonGroup.getAt(i).getAt(0).height + obj.buttonSpacing;
			}
		}
		obj.updateButtonSizes();

		if(obj.useDefaultBackground) {
			// Update the background dialog box sprite size
			let graphics = game.add.graphics(0, 0);
			graphics.beginFill(obj.defaultBackgroundColor, obj.defaultBackgroundAlpha);
			graphics.lineStyle(obj.defaultOutlineSize, obj.defaultOutlineColor, 1);
			graphics.drawRoundedRect(0, 0, obj.boxWidth, obj.boxHeight, obj.roundedCornerRadius_container); 
			graphics.endFill();
			let graphicsTexture = graphics.generateTexture();
			graphics.destroy();
			this.graphicsSprite.loadTexture(graphicsTexture);
		}
		else {
			// obj.graphicsSprite.width = obj.boxWidth;
			// obj.graphicsSprite.height = obj.boxHeight;

			obj.graphicsSprite.scale.setTo( 1 / ( obj.originalBackgroundWidth / obj.boxWidth ) );
		}
	};

	obj.setWidth = function(availableWidth, maxWidth, minWidth, padding) {
		let desiredWidth = BoundNumber(availableWidth - 2*padding, minWidth, maxWidth - 2*padding); 

		obj.boxWidth = desiredWidth;
		for(let i = 0; i < obj.textGroup.children.length; i++) {
			obj.textGroup.getAt(i).wordWrapWidth = (obj.boxWidth - (2 * obj.contentsPadding));
		}

		obj.resize();
		obj.resize();
	};

	obj.setPosition = function(x, y) {
		obj.dialogBoxGroup.x = x;
		obj.dialogBoxGroup.y = y;
	};

	obj.getHeight = function() {
		return obj.boxHeight;
	};

	obj.getWidth = function() {
		return obj.boxWidth;
	};

	obj.getGroup = function() {
		return obj.dialogBoxGroup;
	};

	obj.dialogBoxGroup.visible = false;
	return obj;
}

function ToggleButton( x, y, width, height, onSprite, offSprite ) {
	let obj = {};

	obj.toggleState = true;
	obj.canPressButton = true;

	obj.toggleOnFunc; 
	obj.toggleOffFunc;

	// The button
	obj.buttonGroup = game.add.group();
	obj.buttonImage = game.add.sprite( 0, 0, onSprite ); 
	obj.buttonImage.anchor.setTo( 0.5, 0.5 );
	obj.buttonGraphic; 

	obj.graphics = game.add.graphics( 0, 0 );
	obj.graphics.beginFill( 0xffffff, 0.0 );
	// graphics.lineStyle(1, 0x68588C, 1);
	obj.graphics.drawRect( 0, 0, width, height ); 
	obj.graphics.endFill();

	let buttonTexture = obj.graphics.generateTexture();
	obj.graphics.destroy();
	obj.buttonGraphic = SpriteButton( 0, 0, buttonTexture );
	
	obj.buttonGraphic.setBehaviors(
		function() { //On mouse over...
			// Tweenimate_ElasticScale(obj.buttonImage, 1.2, 1.2, 1000);
			game.canvas.style.cursor = "pointer";
		}, 
		function() { //On mouse off...
			// Tweenimate_ElasticScale(obj.buttonImage, 1, 1, 1000);
			game.canvas.style.cursor = "default";
		},
		function() { //On mouse down...
		}, 
		function() { //On mouse up...
		}
	);
	obj.buttonGraphic.setClickBehavior( function() {
		if( obj.canPressButton ) {
			obj.toggleState = !obj.toggleState;
			obj.setState( obj.toggleState );

			if( obj.toggleState && obj.toggleOnFunc ) {
				obj.toggleOnFunc();
			} 
			else if( !obj.toggleState && obj.toggleOffFunc ) {
				obj.toggleOffFunc();
			}
		}
	} );
	obj.buttonGroup.add( obj.buttonGraphic.getSprite() );
	obj.buttonGroup.add( obj.buttonImage );

	obj.setBehaviors = function( toggleOnFunc, toggleOffFunc ) {
		obj.toggleOnFunc = toggleOnFunc; 
		obj.toggleOffFunc = toggleOffFunc;
	};
	obj.setState = function( stateBool ) {
		if( stateBool ) {
			obj.buttonImage.loadTexture( onSprite );
		}
		else {
			obj.buttonImage.loadTexture( offSprite )
		}
	};
	obj.setPosition = function( x, y ) {
		obj.buttonGroup.x = x;
		obj.buttonGroup.y = y;
	};
	obj.getGroup = function() {
		return obj.buttonGroup;
	};

	return obj;
}

function Animator(targetSprite) {
	let obj = {};
	obj.animations = [];
	obj.targetSprite = targetSprite;
	obj.originalSprite = targetSprite.key;
	obj.timer = game.time.create();
	obj.frameTimer;

	obj._isPlaying = false;
	obj.funcsToCallOnComplete = [];

	obj.currentAnimation = '';
	obj.frameTime = 60;
	obj.currentAnimationNum = 0;
	obj.currentFrameNum = 0;
	obj.loopCurrentAnim = false;

	obj.newAnimation = function(name, arrayOfKeys) {
		obj.animations.push({
			"name": name, 
			"frameKeys": arrayOfKeys
		});
	};
	obj.playAnimation = function(name, loopBool) {
		obj.cancelAnimation();
		obj._isPlaying = true;
		obj.loopCurrentAnim = loopBool;
		obj.currentAnimation = name;
		for(let i = 0; i < obj.animations.length; i++) {
			if(obj.animations[i].name === name) {
				// console.log("Found '" + name + "' with (" + obj.animations[i].frameKeys.length + ") frames.");
				obj.currentAnimationNum = i;

				// obj.frameTimer = obj.timer.add(obj.animationTime, obj.endGameDialogBoxShow, obj);
				// obj.timer.start();
				obj.frameTimer = game.time.events.loop(obj.frameTime, obj.nextFrame, this);
				
				return;
			}
		}
		console.log("Animation '" + name + "' not found!");
	}
	obj.addCallOnComplete = function(func) {
		obj.funcsToCallOnComplete.push(func);
		// obj.funcToCallOnComplete = func;
	};
	obj.resetAnimationDetails = function() {
		obj._isPlaying = false;
		obj.loopCurrentAnim = false;
		game.time.events.remove(obj.frameTimer);
		obj.frameTimer = null;
		obj.currentAnimation = '';
		obj.currentAnimationNum = 0;
		obj.currentFrameNum = 0;
		targetSprite.loadTexture(obj.originalSprite);
	};
	obj.endAnimation = function() {
		obj.resetAnimationDetails();
		if(obj.funcsToCallOnComplete) {
			for(let i = 0; i < obj.funcsToCallOnComplete.length; i++) {
				obj.funcsToCallOnComplete[i]();
			}
		}
	};
	obj.cancelAnimation = function() {
		obj.resetAnimationDetails();
	};
	obj.nextFrame = function() {

		if(obj.currentFrameNum > obj.animations[obj.currentAnimationNum].frameKeys.length - 1) {
			if(obj.loopCurrentAnim) {
				obj.currentFrameNum = 0;
			}
			else {
				obj.endAnimation();
				return;
			}
		}
		// console.log("New Frame: " + obj.currentFrameNum);
		targetSprite.loadTexture(obj.animations[obj.currentAnimationNum].frameKeys[obj.currentFrameNum]);
		obj.currentFrameNum++;
	};
	obj.setTimeToTimeDividedByFrameCount = function(anim, time) {
		for(let i = 0; i < obj.animations.length; i++) {
			if(obj.animations[i].name === anim) {
				obj.frameTime = time / obj.animations[i].frameKeys.length;
				return;
			}
		}
		console.log("Animation '" + anim + "' not found!");
	};
	obj.isPlaying = function() {
		return obj._isPlaying;
	};
	obj.setFPS = function(fps) {
		obj.frameTime = (1/fps) * 1000;
	};
	obj.setFrametime = function(val) {
		obj.frameTime = val;
	};

	return obj;
}

// Used as the timer bar in the game
function ProgressBar() {
	let obj = {};

	obj.fillPercent = 1;
	obj.fillBarOffset_X_rightSide = game_details_data.user_interface_settings.fill_bar_offset_x_rightSide_SCALED;
	obj.fillBarOffset_X_leftSide = game_details_data.user_interface_settings.fill_bar_offset_x_leftSide_SCALED;
	obj.fillBarOffset_Y = game_details_data.user_interface_settings.fill_bar_offset_y_SCALED;
	obj.fillBarHeight = game_details_data.user_interface_settings.fill_bar_height_SCALED;

	obj.barGroup = game.add.group();
	obj.barGroup.x = 0;
	obj.barGroup.y = 0;
	obj.align = 'center';

	obj.centerPiece = game.add.sprite(0, 0, 'test_2');
	obj.centerPiece.anchor.setTo(0.5, 0.5);
	obj.barGroup.add(obj.centerPiece);

	obj.leftCap = game.add.sprite(0, 0, 'test_1');
	obj.leftCap.anchor.setTo(1, 0.5);
	obj.leftCap.x = -obj.centerPiece.width/2;
	obj.barGroup.add(obj.leftCap);

	obj.rightCap = game.add.sprite(0, 0, 'test_3');
	obj.rightCap.anchor.setTo(0, 0.5);
	obj.rightCap.x = obj.centerPiece.width/2;
	obj.barGroup.add(obj.rightCap);

	obj.roundedCornerRadius = 30;
	obj.scaleValue = 1;

	// Fill
	obj.defaultFillColor = game_details_data.user_interface_settings.default_timer_fill_color.replace('#', '0x');
	obj.defaultFillAlpha = game_details_data.user_interface_settings.default_timer_fill_alpha;
	obj.defaultOutlineColor = game_details_data.user_interface_settings.default_timer_outline_color.replace('#', '0x');
	obj.defaultOutlineSize = game_details_data.user_interface_settings.default_timer_outline_size;

	graphics = game.add.graphics(0,0);
	graphics.beginFill(obj.defaultFillColor, obj.defaultFillAlpha);
	// graphics.lineStyle(obj.defaultOutlineSize, obj.defaultOutlineColor);
	graphics.drawRoundedRect(0, 0, obj.centerPiece.width, 50, 10);
	graphics.endFill();
	graphicsTexture = graphics.generateTexture();
	graphics.destroy();

	obj.progressBarFill = game.add.sprite(-obj.centerPiece.width/2, obj.fillBarOffset_Y, graphicsTexture);
	obj.progressBarFill.anchor.setTo(0, 0.5);
	obj.barGroup.add(obj.progressBarFill);


	obj.updateProgress = function ( perc ) {
		obj.fillPercent = perc;

		obj.progressBarFill.x = -obj.centerPiece.width/2 + ( obj.fillBarOffset_X_leftSide * obj.scaleValue );
		graphics = game.add.graphics(0,0);
		graphics.beginFill(obj.defaultFillColor, obj.defaultFillAlpha);
		// graphics.lineStyle(obj.defaultOutlineSize, obj.defaultOutlineColor);
		graphics.drawRoundedRect(0, 0, perc * (obj.centerPiece.width - ( obj.fillBarOffset_X_leftSide * obj.scaleValue ) + ( obj.fillBarOffset_X_rightSide * obj.scaleValue ) ), obj.fillBarHeight * obj.scaleValue, obj.roundedCornerRadius);
		graphics.endFill();
		graphicsTexture = graphics.generateTexture();
		graphics.destroy();

		obj.progressBarFill.loadTexture(graphicsTexture);
	};
	obj.getPercentage = function () {
		return obj.fillPercent;
	};
	obj.getGroup = function () {
		return obj.barGroup;
	};
	obj.setPosition = function ( x, y ) {
		if(obj.align === 'left') {
			obj.barGroup.x = x + (obj.barGroup.width/2);
			obj.barGroup.y = y;
		}
		else if(obj.align === 'center') {
			obj.barGroup.x = x;
			obj.barGroup.y = y;
		}
		else if(obj.align === 'right') {
			obj.barGroup.x = x - (obj.barGroup.width/2);
			obj.barGroup.y = y;
		}
		else {
			obj.barGroup.x = x;
			obj.barGroup.y = y;
		}

		obj.leftCap.x = ( -obj.centerPiece.width / 2 );
		obj.rightCap.x = ( obj.centerPiece.width / 2 );
	};
	obj.setAlignment = function(val) {
		obj.align = val;
	};
	obj.setWidth = function ( availableWidth ) {
		let calculatedWidth = availableWidth - obj.leftCap.width - obj.rightCap.width;
		obj.centerPiece.width = calculatedWidth; 
		obj.leftCap.x = ( -calculatedWidth / 2 );
		obj.rightCap.x = ( calculatedWidth / 2 );

		this.updateProgress( obj.fillPercent );
	};
	obj.setHeight = function ( height ) {
		let scaleValue = height / ( obj.centerPiece.height * ( 1 / obj.centerPiece.scale.y ) );
		obj.scaleValue = scaleValue;

		obj.leftCap.scale.setTo( scaleValue );
		obj.rightCap.scale.setTo( scaleValue );

		obj.progressBarFill.x = 200;
		obj.progressBarFill.y = obj.fillBarOffset_Y * scaleValue;

		obj.centerPiece.height = height;

		this.updateProgress( obj.fillPercent );
	};

	return obj;
}

function BoundNumber(num, min, max) {
	// console.log(num + ", " + max + ", " + min); 
	return Math.min(
		Math.max(min, num),
		max
	)
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
	














