var TPS = 60;
var tpsCounter = 0;

// Get a reference to the canvas and context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// GAME STATES
var LOAD_STATE = 0;
var INITIALIZE_STATE = 1;
var PLAY_STATE = 2;

// LOAD
var gameState = LOAD_STATE;


var camera = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,

    updateCamera: function(followee, map) {
	// center the camera on the followee & keep it inside the map boundaries
	this.x = Math.max(0, Math.min(
	    Math.floor((followee.x + followee.w / 2) - this.w / 2),
	    map.w - this.w)
			 );

	this.y = Math.max(0, Math.min(
	    Math.floor((followee.y + followee.h / 2) - this.h / 2),
	    map.h - this.h)
			 ); 
    }

};

var map;
var player;
var playerAnimator;
var platformerPlayer;
var platformerPlayerAnimator;
var platformerMap;
var topDownPlayer;
var topDownPlayerAnimator;
var topDownMap;

function initializeGame() {    
    topDownPlayer = new TopDownSprite();
    topDownPlayer.forceX = 120;
    topDownPlayer.forceY = 120;
    topDownPlayer.x = 256;
    topDownPlayer.y = 360;
    topDownPlayer.w = 16;
    topDownPlayer.h = 16;


    topDownPlayerAnimator = new Animator(tdPlayerTiles, topDownSheet, topDownPlayer);
    topDownPlayerAnimator.parseImageData();

    platformerPlayer = new PlatformerSprite();
    platformerPlayer.x = 128;
    platformerPlayer.y = 256;
    platformerPlayer.w = 32;
    platformerPlayer.h = 32;
    platformerPlayer.forceX = 120;
    platformerPlayer.forceY = 370;
    platformerPlayer.ay = 16;


    platformerPlayerAnimator = new Animator(pfPlayerTiles, platformerSheet, platformerPlayer);
    platformerPlayerAnimator.parseImageData();

    player = topDownPlayer;
    playerAnimator = topDownPlayerAnimator;

    player = platformerPlayer;
    playerAnimator = platformerPlayerAnimator;

    
    // INPUT SETUP
    setInput(player);

    var topDownMap = new Map();
    topDownMap.initMap(topDownMapData, canvas, tdMapTiles);
    topDownMap.generateCollisionLayers();

    var platformerMap = new Map();
    platformerMap.initMap(platformerMapData, canvas, pfMapTiles);
    platformerMap.generateCollisionLayers();

    map = topDownMap;
    map = platformerMap;
    
    gameState = PLAY_STATE;

    console.log("Playing");    
}



// RENDER GAME
function renderMap(map){

    var offset = [Math.floor(camera.x / map.tileW), Math.floor(camera.y / map.tileH)];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // render the map
    var i, j, k;
    for (i = 0; i < map.layers.length; i++) {
    	var data = map.layers[i]["data"];
    	for (j = offset[0]; j <= (offset[0] + map.viewportW); j++) {
    	    for (k = offset[1]; k <= (offset[1] + map.viewportH); k++) {
    		var cell = k * map.cols + j;
    		if (data[cell] > 0) {
    		    ctx.drawImage(map.img,
    		    		  ((data[cell] - 1) % map.tileCols) * map.tileW,
    				  Math.floor((data[cell] - 1) / map.tileCols) * map.tileH,
    		    		  map.tileW, map.tileH,
    		    		  j * map.tileW, k * map.tileH,
    				  map.tileW, map.tileH);
    		}
    	    }
	    
    	}

    }


    // render the PC
    var animator = player.animator;
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    if (player.rotation != 0)
	ctx.rotate(player.rotation * Math.PI / 180);
    ctx.drawImage(animator.image,
    		  animator.srcX, animator.srcY, animator.tileW, animator.tileH,
    		  -animator.tileW / 2, -animator.tileH / 2, animator.tileW, animator.tileH
    		 );

    ctx.restore();

}

function playGame() {
    
    player.update();
    
    var collisionCandidates = findSceneryCollisionCandidates(player, map);

    for (var j = 0; j < collisionCandidates.length; j++) {
	if (collisionCandidates[j] != null) {
	    var collisionSide = testRectangle(player, collisionCandidates[j], false, true);
	    if (collisionSide === "bottom") {
		player.vy = 0;
		player.isJumping = false;
	    } else if (collisionSide === "top") {
		player.vy = 0;
	    }
	}
    }
    
    
    camera.updateCamera(player, map);

    renderMap(map);

    if (tpsCounter % (TPS / playerAnimator.frameRate) === 0) {
	playerAnimator.play(player.action);
    }

    if (++tpsCounter > 60)
	tpsCounter = 0;
}

var initRunning = false;
// GAME LOOP
function update() {
    mozRequestAnimationFrame(update, canvas);
    switch(gameState) {
    case LOAD_STATE: 
	break;
    case INITIALIZE_STATE: if (!initRunning) {
	initRunning = true;
	initializeGame();
    }
	break;
    case PLAY_STATE:
	playGame();
	break;
    default: break;
    }
}

update();

// var mode = "platformer";
// function toggleMode() {
//     if (mode !== "platformer") {
// 	mode = "platformer";
// 	player = platformerPlayer;
// 	playerAnimator = platformerPlayerAnimator;
// 	map = platformerMap;
//     }
//     else {
// 	mode = "topdown";
// 	player = topDownPlayer;
// 	playerAnimator = topDownPlayerAnimator;
// 	map = topDownMap;
//     }
// }

