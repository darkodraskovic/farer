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
//    console.log("loadedAssets: " + loadedAssets + "; assetsToLoad: " + assetsToLoad.length);


}

// MAP CONSTS
var TILE_WIDTH;
var TILE_HEIGHT;
var MAP_COLS;
var MAP_ROWS;
var MAP_LAYERS;
var TILES_FILE;
var TILES_IMAGE;
var TILESHEET_COLS;
var TILESHEET_ROWS;

var VIEWPORT_WIDTH;
var VIEWPORT_HEIGHT;

var map2D = [];

// PLAYER VARS
var player;

// SCROLLING
// objects
var gameWorld = {
    x: 0,
    y: 0,

    getCellX: function(x) {
	return Math.floor(x / TILE_WIDTH);
    },
    getCellY: function(y) {
	return Math.floor(y / TILE_HEIGHT);
    },

    getCellCode: function(layer, x, y) {
	return (layer["data"][this.getCellY(y) * layer["width"] + this.getCellX(x)]);
    }
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


function initializeGame() {
    TILE_WIDTH = mapData["tilewidth"];
    TILE_HEIGHT = mapData["tileheight"];
    MAP_COLS = mapData["width"];
    MAP_ROWS = mapData["height"];
    MAP_LAYERS = mapData["layers"].length;
    TILES_FILE = "images/" + mapData["tilesets"][0]["image"].slice((mapData["tilesets"][0]["image"].lastIndexOf("\/") + 1));
    TILES_IMAGE = groundTiles;

    TILESHEET_COLS = groundTiles.width / TILE_WIDTH;
    TILESHEET_ROWS = groundTiles.height / TILE_HEIGHT;

    VIEWPORT_WIDTH = canvas.width / TILE_WIDTH;
    VIEWPORT_HEIGHT = canvas.height / TILE_HEIGHT;
    
    player = new Sprite("player", playerTiles, playerSheet, 256, 256, 12, 12);
    player.spd = 120;
    player.updateAction("standing");

    // INPUT SETUP
    setInput(player);

    gameWorld.w = MAP_ROWS * TILE_WIDTH;
    gameWorld.h = MAP_COLS * TILE_WIDTH;

//    console.log(mapLayers.length);
    generateMap(mapData["layers"][1], mapData["tilesets"][0], map2D);

    gameState = PLAY_STATE;
}



function generateMap(layerData, tileset, layers) {
    var COLS = layerData["width"]; 
    var ROWS = layerData["height"];
    var cells = layerData["data"];

    var TILE_W = tileset["tilewidth"];
    var TILE_H = tileset["tileheight"];
    var IMG_W = tileset["imagewidth"];
    var IMG_H = tileset["imageheight"];

    layers[layers.length] = [];

    
    for (var x = 0; x < COLS; x++) {
	layers[layers.length - 1][x] = [];
    	for (var y = 0; y < ROWS; y++) {
	    var cellCode = cells[y * COLS + x];
    	    if (cellCode !== 0) {
		var scenObj = new SceneryObject();
		scenObj.srcX = ((cellCode - 1) % (IMG_W /TILE_W)) * TILE_W;
		scenObj.srcY = Math.floor((cellCode - 1) / (IMG_W / TILE_W)) * TILE_H;
		scenObj.srcW = TILE_W;
		scenObj.srcH = TILE_H;
		scenObj.x = x * TILE_W;
		scenObj.y = y * TILE_H;
		scenObj.w = TILE_W;
		scenObj.h = TILE_H;
		scenObj.code = cellCode;
		layers[layers.length - 1][x][y] = scenObj;
	    } else {
		layers[layers.length - 1][x][y] = null;
	    }	    
    	}
    }
}

// RENDER GAME
function renderMap(){

    var offset = [Math.floor(camera.x / TILE_WIDTH), Math.floor(camera.y / TILE_HEIGHT)];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // render the map
    var i, j, k;
    for (i = 0; i < MAP_LAYERS; i++) {
    	var layerData = mapData["layers"][i]["data"];
    	for (j = offset[0]; j <= (offset[0] + VIEWPORT_WIDTH); j++) {
    	    for (k = offset[1]; k <= (offset[1] + VIEWPORT_HEIGHT); k++) {
    		var cell = k * MAP_ROWS + j;
    		if (layerData[cell] > 0) {
    		    ctx.drawImage(TILES_IMAGE,
    		    		  ((layerData[cell] - 1) % TILESHEET_COLS) * TILE_WIDTH,
    				  Math.floor((layerData[cell] - 1) / TILESHEET_COLS) * TILE_HEIGHT,
    		    		  TILE_WIDTH, TILE_HEIGHT,
    		    		  j * TILE_WIDTH, k * TILE_HEIGHT,
    				  TILE_WIDTH, TILE_HEIGHT);
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

    var playerMapX = Math.floor(player.centerX() / TILE_WIDTH);
    var playerMapY = Math.floor(player.centerY() / TILE_HEIGHT);
    var collisionCandidates = [];
    collisionCandidates.push(map2D[0][playerMapX][playerMapY]);    
    if (player.vx < 0) {
	collisionCandidates.push(map2D[0][playerMapX - 1][playerMapY]);
    } else if (player.vx > 0) {
	collisionCandidates.push(map2D[0][playerMapX + 1][playerMapY]);
    }
    if (player.vy < 0) {
	collisionCandidates.push(map2D[0][playerMapX][playerMapY - 1]);
    } else if (player.vy > 0) {
	collisionCandidates.push(map2D[0][playerMapX][playerMapY + 1]);
    }
    for (var i = 0; i < collisionCandidates.length; i++) {
	if (collisionCandidates[i] != null)
	    blockRectangle(player, collisionCandidates[i]);
    }
    
    
    camera.updateCamera(player);

    renderMap();

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

