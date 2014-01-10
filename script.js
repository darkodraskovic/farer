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
	if (followee.x < this.leftInnerBoundary()) {
	    this.x = Math.max(0, Math.min(
		Math.floor(followee.x - this.w * 1/4), 
		map.w - this.w
	    )); 
	}
	if (followee.x + followee.w > this.rightInnerBoundary()) {
	    this.x = Math.max(0, Math.min(
		Math.floor(followee.x + followee.w - this.w * 3/4), 
		map.w - this.w
	    ));
	}

	if (followee.y + followee.h > this.bottomInnerBoundary()) {
	    this.y = Math.max(0, Math.min(
		Math.floor(followee.y + followee.h - this.h * 3/4),
		map.h - this.h
	    )); 
	} 
	if (followee.y < this.topInnerBoundary()) {
	    this.y = Math.max(0, Math.min(
		Math.floor(followee.y - this.h * 1/4),
		map.h - this.h
	    )); 
	}
	
    },

    // The camera's inner boundaries
    rightInnerBoundary: function() {
	return this.x + this.w * 3/4;
    },
    leftInnerBoundary: function() {
	return this.x + this.w * 1/4;
    },
    topInnerBoundary: function() {
	return this.y + this.h * 1/4;
    },
    bottomInnerBoundary: function() {
	return this.y + this.h * 3/4;
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
var pacmanMap;
var pacmanPlayer;
var pacmanPlayerAnimator;

function initializeGame() {
    // INIT MAP
    var topDownMap = new Map();
    topDownMap.initMap(topDownMapData, canvas, tdMapTiles);
    topDownMap.generateCollisionLayers();

    var platformerMap = new Map();
    platformerMap.initMap(platformerMapData, canvas, pfMapTiles);
    platformerMap.generateCollisionLayers();

    var pacmanMap = new Map();
    pacmanMap.initMap(pacmanMapData, canvas, pacmanTiles);
    pacmanMap.generateCollisionLayers();
//    console.log(topDownMap.objectLayers);
    
    // INIT PLAYER
    topDownPlayer = new TopDownSprite();
    topDownPlayer.forceX = 60;
    topDownPlayer.forceY = 60;
    topDownPlayer.vxMax = 120;
    topDownPlayer.vyMax = 120;
    topDownPlayer.frictX = 0.92;
    topDownPlayer.frictY = 0.92;    
    topDownPlayer.x = 312;
    topDownPlayer.y = 312;
    topDownPlayer.w = 12;
    topDownPlayer.h = 12;
    topDownPlayer.map = topDownMap;

    topDownPlayerAnimator = new Animator(tdPlayerTiles, topDownSheet, topDownPlayer);
    topDownPlayerAnimator.parseImageData();

    platformerPlayer = new PlatformerSprite();
    platformerPlayer.x = platformerMap.tileW * 4;
    platformerPlayer.y = platformerMap.tileH * 10;
    platformerPlayer.w = 32;
    platformerPlayer.h = 32;
    platformerPlayer.forceX = 60;
    platformerPlayer.forceY = 0;
    platformerPlayer.jumpForce = 380;
    platformerPlayer.vxMax = 120;
    platformerPlayer.vyMax = 600;
    platformerPlayer.g = 14;    
    platformerPlayer.frictX = 0.93;
    platformerPlayer.frictY = 1;
    platformerPlayer.map = platformerMap;

    platformerPlayerAnimator = new Animator(pfPlayerTiles, platformerSheet, platformerPlayer);
    platformerPlayerAnimator.parseImageData();

    pacmanPlayer = new TopDownSprite();
    pacmanPlayer.forceX = 100;
    pacmanPlayer.forceY = 100;
    pacmanPlayer.vxMax = 240;
    pacmanPlayer.vyMax = 240;
    pacmanPlayer.x = 48;
    pacmanPlayer.y = 48;
    pacmanPlayer.w = 48;
    pacmanPlayer.h = 48;
    pacmanPlayer.frictX = 1;
    pacmanPlayer.frictY = 1;
    pacmanPlayer.map = pacmanMap;
    
    pacmanPlayerAnimator = new Animator(pacmanTiles, pacmanSpriteData, pacmanPlayer);
    pacmanPlayerAnimator.parseImageData();
    
    // TOPDOWN or PLATFORMER or PACMAN
    var mode = "p"; 
    if (mode === "t") {
	player = topDownPlayer;
	playerAnimator = topDownPlayerAnimator;
	map = topDownMap;
    } else if (mode === "p"){
	player = platformerPlayer;
	playerAnimator = platformerPlayerAnimator;
	map = platformerMap;
    } else if (mode === "a") {
	player = pacmanPlayer;
	playerAnimator = pacmanPlayerAnimator;
	map = pacmanMap;
    }

    // INPUT SETUP
    setInput(player);

    
    gameState = PLAY_STATE;
    console.log("Playing");

}




function playGame() {
    // update game state
    player.update();
    
    // console.log("player.vx = " + player.vx);
    // console.log("player.vy = " + player.vy);
    // console.log("player.g = " + player.g);
    // console.log("player.isJumping = " + player.isJumping);


    for (i = 0; i < map.objectLayers.length; i++) {
    	var objects = map.objectLayers[i];
    	for (var j = 0; j < objects.length; j++) {
    	    objects[j].update();
    	}
    }
    
    // test for collisions
    var collisionCandidates = findSceneryCollisionCandidates(player, map);

    for (var i = 0; i < collisionCandidates.length; i++) {
    	var collisionSide = testRectangle(player, collisionCandidates[i], true);
    	if (collisionSide !== "none") {
	    if (collisionCandidates[i]["name"] && collisionCandidates[i]["name"] === "dot") {
	        collisionCandidates[i].exists = false;
	    }
	    if (collisionSide == "bottom" && player.vy >= 0) {
		player.onGround = true;
		player.vy = -player.g;
	    } else if (collisionSide == "top" && player.vy <= 0) {
		player.vy = 0;
	    } else if (collisionSide == "right" && player.vx >= 0) {
		player.vx = 0;
	    }  else if (collisionSide == "left" && player.vx <= 0) {
		player.vx = 0;
	    }
	    if (collisionSide !== "bottom" && player.vy > 0)  {
		player.onGround = false;
	    }
    	}
    }

    for (i = 0; i < map.objectLayers.length; i++) {
	objects = map.objectLayers[i];
	for (j = 0; j < objects.length; j++) {
	    if (testCollisionMask(player, objects[j])) {
		collisionSide = testRectangle(player, objects[j], true);
    		if (collisionSide !== "none") {
		    if (collisionSide == "bottom" && player.vy >= 0) {
			player.onGround = true;
			player.vy = -player.g;
		    } else if (collisionSide == "top" && player.vy <= 0) {
			player.vy = 0;
		    } else if (collisionSide == "right" && player.vx >= 0) {
			player.vx = 0;
		    }  else if (collisionSide == "left" && player.vx <= 0) {
			player.vx = 0;
		    }
		    if (collisionSide !== "bottom" && player.vy > 0)  {
			player.onGround = false;
		    }
		}
	    }
	}
    }

    // update camera and render the world
    camera.updateCamera(player, map);

    renderMap(map, player);

    // animate
    if (tpsCounter % (TPS / playerAnimator.frameRate) === 0) {
	playerAnimator.play(player.action);
    }

    // count ticks
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

