var TPS = 60;
var tpsCounter = 0;

// Get a reference to the canvas and context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// GAME STATES
var LOAD_STATE = 0;
var INITIALIZE_STATE = 1;
var PLAY_STATE = 2;

var gameState = LOAD_STATE;

// LOAD DATA
var assetsToLoad = [];
var loadedAssets = 0;

var mapData;
var spriteSheetData;
var manSheet;

var loadData = function() {
    assetsToLoad.push(mapData);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/testLevel.json", false);
    xhr.onload = function() {
	loadHandler();
	mapData = JSON.parse(this.responseText);
    };
    xhr.send();


    assetsToLoad.push(spriteSheetData);    
    xhr.open("GET", "data/spriteSheetData.json", false);
    xhr.onload = function() {
	loadHandler();
	spriteSheetData = JSON.parse(this.responseText);
    };
    xhr.send();

    assetsToLoad.push(manSheet);    
    xhr.open("GET", "data/manSheet.json", false);
    xhr.onload = function() {
	loadHandler();
	manSheet = JSON.parse(this.responseText);
    };
    xhr.send();

};

loadData();

var groundTiles = new Image();
groundTiles.addEventListener("load", loadHandler, false);
groundTiles.src = "images/groundTiles.png";
assetsToLoad.push(groundTiles);

var playerTiles = new Image();
playerTiles.addEventListener("load", loadHandler, false);
playerTiles.src = "images/playerTiles.png";
assetsToLoad.push(playerTiles);

function loadHandler() {
    loadedAssets++;
    if (loadedAssets >= 5) {
	gameState = INITIALIZE_STATE;
    }

}

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

function initializeGame() {    
    player = new Sprite("player", 256, 256, 12, 12);
    player.spd = 120;
    player.updateAction("standing");

    playerAnimator = new Animator(playerTiles, manSheet, player);
    playerAnimator.parseImageData();

    // INPUT SETUP
    setInput(player);

    map.initMap(mapData, canvas, groundTiles);
    map.generateCollisionLayers();

    console.log("Playing");
    gameState = PLAY_STATE;

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
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.drawImage(animator.image,
    		  animator.srcX, animator.srcY, animator.tileW, animator.tileH,
    		  -animator.tileW / 2, -animator.tileH / 2, animator.tileW, animator.tileH
    		 );

    ctx.restore();

}


function playGame() {
    
    player.update();

    var collisionCandidates = findCollisionCandidates(player, map);

    for (var j = 0; j < collisionCandidates.length; j++) {
	if (collisionCandidates[j] != null)
	    blockRectangle(player, collisionCandidates[j]);
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
    case LOAD_STATE: console.log("Loading");
	break;
    case INITIALIZE_STATE: if (!initRunning) {
	initRunning = true;
	initializeGame();
    }
	console.log("Initializing");
	break;
    case PLAY_STATE: 
	playGame();
	break;
    default: break;
    }
}

update();

