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
var playerSheet;

var loadData = function() {
    assetsToLoad.push(mapData);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/testLevel.json", false);
    xhr.onload = function() {
	loadHandler();
	mapData = JSON.parse(this.responseText);
    };
    xhr.send();

    assetsToLoad.push(playerSheet);    
    xhr.open("GET", "data/playerSpriteSheet.json", false);
    xhr.onload = function() {
	loadHandler();
	playerSheet = JSON.parse(this.responseText);
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
    if (loadedAssets >= 4) {
	gameState = INITIALIZE_STATE;
    }

}

// PLAYER VARS
var player;

// SCROLLING
// objects
var gameWorld = {
    x: 0,
    y: 0
};

var camera = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,

    updateCamera: function(followee) {
	// center the camera on the followee & keep it inside the gameworld boundaries
	this.x = Math.max(0, Math.min(
	    Math.floor((followee.x + followee.w / 2) - this.w / 2),
	    gameWorld.w - this.w)
			 );

	this.y = Math.max(0, Math.min(
	    Math.floor((followee.y + followee.h / 2) - this.h / 2),
	    gameWorld.h - this.h)
			 ); 
    }

};

var map = {
    initMap: function(mapData, canvas) {
	this.layers = mapData["layers"];
	this.tilesetsData = mapData["tilesets"];

	this.tileW = mapData["tilewidth"];
	this.tileH = mapData["tileheight"];
	this.imgW = mapData["tilesets"][0]["imagewidth"];
	this.imgH = mapData["tilesets"][0]["imageheight"];	
	this.tileCols = this.imgW / this.tileW;
	this.tileRows = this.imgH / this.tileH;

	this.cols = mapData["width"];
	this.rows = mapData["height"];

	this.viewportW = canvas.width / this.tileW;
	this.viewportH = canvas.height / this.tileH;
    },

    generateCollisionLayers: function() {
	this.collisionLayers = [];

	for (var i = 0; i < this.layers.length; i++) {

	    if (this.layers[i]["name"].indexOf("collision") > -1) {
		var data = this.layers[i]["data"];
		this.collisionLayers[this.collisionLayers.length] = [];

		for (var x = 0; x < this.cols; x++) {
		    this.collisionLayers[this.collisionLayers.length - 1][x] = [];
    		    for (var y = 0; y < this.rows; y++) {
			var cellCode = data[y * this.cols + x];
    			if (cellCode !== 0) {
			    var scenObj = new SceneryObject();
			    scenObj.srcX = ((cellCode - 1) % (this.imgW /this.tileW)) * this.tileW;
			    scenObj.srcY = Math.floor((cellCode - 1) / (this.imgW / this.tileW)) * this.tileH;
			    scenObj.srcW = this.tileW;
			    scenObj.srcH = this.tileH;
			    scenObj.x = x * this.tileW;
			    scenObj.y = y * this.tileH;
			    scenObj.w = this.tileW;
			    scenObj.h = this.tileH;
			    scenObj.code = cellCode;
			    this.collisionLayers[this.collisionLayers.length - 1][x][y] = scenObj;
			} else {
			    this.collisionLayers[this.collisionLayers.length - 1][x][y] = null;
			}	    
    		    }
		}

	    }
	}
    }
};

function initializeGame() {    
    player = new Sprite("player", playerTiles, playerSheet, 256, 256, 12, 12);
    player.spd = 120;
    player.updateAction("standing");

    // INPUT SETUP
    setInput(player);

    map.initMap(mapData, canvas);
    map.generateCollisionLayers();

    gameWorld.w = map.rows * map.tileW;
    gameWorld.h = map.cols * map.tileH;

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
    		var cell = k * map.rows + j;
    		if (data[cell] > 0) {
    		    ctx.drawImage(groundTiles,
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
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.drawImage(player.tiles,
    		  player.srcX, player.srcY, player.tileW, player.tileH,
    		  -player.tileW / 2, -player.tileH / 2, player.tileW, player.tileH
    		 );

    ctx.restore();

}


function playGame() {
    player.update();

    
    //    for (var i = 0; i < map2D[0].length; i++) {
    // 	blockRectangle(player, mapLayers[0][i]);
    // }

    var playerMapX = Math.floor(player.centerX() / map.tileW);
    var playerMapY = Math.floor(player.centerY() / map.tileH);
    for (var i = 0; i < map.collisionLayers.length; i++) {
	var collisionLayer = map.collisionLayers[i];
	var collisionCandidates = [];

	collisionCandidates.push(collisionLayer[playerMapX][playerMapY]);    
	if (player.vx < 0) {
	    collisionCandidates.push(collisionLayer[playerMapX - 1][playerMapY]);
	} else if (player.vx > 0) {
	    collisionCandidates.push(collisionLayer[playerMapX + 1][playerMapY]);
	}
	if (player.vy < 0) {
	    collisionCandidates.push(collisionLayer[playerMapX][playerMapY - 1]);
	} else if (player.vy > 0) {
	    collisionCandidates.push(collisionLayer[playerMapX][playerMapY + 1]);
	}
	for (var j = 0; j < collisionCandidates.length; j++) {
	    if (collisionCandidates[j] != null)
		blockRectangle(player, collisionCandidates[j]);
	}

    }
    
    
    camera.updateCamera(player);

    renderMap(map);

    if (tpsCounter % (TPS / player.framerate) === 0) {
	player.updateAnimation();
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

