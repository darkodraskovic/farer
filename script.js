var TPS = 60;
var tpsCounter = 0;

// Get a reference to the canvas and context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");



// LOAD DATA
var mapData;
var playerSheet;

var loadData = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/testLevel.json", false);
    xhr.onload = function() {
	mapData = JSON.parse(this.responseText);
    };
    xhr.send();
    
    xhr.open("GET", "data/playerSpriteSheet.json", false);
    xhr.onload = function() {
	playerSheet = JSON.parse(this.responseText);
    };
    xhr.send();
};

loadData();



// MAP SETUP
var TILE_WIDTH = mapData["tilewidth"];
var TILE_HEIGHT = mapData["tileheight"];
var MAP_COLS = mapData["width"];
var MAP_ROWS = mapData["height"];
var MAP_LAYERS = mapData["layers"].length;
var TILES_FILE = "images/" + mapData["tilesets"][0]["image"].slice((mapData["tilesets"][0]["image"].lastIndexOf("\/") + 1));

var groundTiles = new Image();
groundTiles.src = TILES_FILE;
var TILES_IMAGE = groundTiles;

var TILESHEET_COLS = groundTiles.width / TILE_WIDTH;
var TILESHEET_ROWS = groundTiles.height / TILE_HEIGHT;

var VIEWPORT_WIDTH = canvas.width / TILE_WIDTH;
var VIEWPORT_HEIGHT = canvas.height / TILE_HEIGHT;



// PLAYER SETUP
var playerTiles = new Image();
playerTiles.src = "images/playerTiles.png";

var player = new Sprite("player", playerTiles, playerSheet, 256, 256, 12, 12);
player.spdX = 100;
player.spdY = 100;
player.updateAction("standing");



// INPUT SETUP
setInput(player);



// SCROLLING
// objects
var gameWorld = {
    x: 0,
    y: 0,
    w: MAP_ROWS * TILE_WIDTH,
    h: MAP_COLS * TILE_WIDTH
};

var camera = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height
};

// functions
function updateCamera(followee) {
    // center the camera on the followee & keep it inside the gameworld boundaries
    camera.x = Math.max(0, Math.min(
	Math.floor((followee.x + followee.w / 2) - camera.w / 2),
	gameWorld.w - camera.w)
    );

    camera.y = Math.max(0, Math.min(
	Math.floor((followee.y + followee.h / 2) - camera.h / 2),
	gameWorld.h - camera.h)
    ); 
}



// RENDER GAME
function renderMap(){

    var offset = [Math.floor(camera.x / TILE_WIDTH), Math.floor(camera.y / TILE_HEIGHT)];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

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

    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.drawImage(player.tiles,
    		  player.srcX, player.srcY, player.tileW, player.tileH,
    		  -player.tileW / 2, -player.tileH / 2, player.tileW, player.tileH
    		 );

    ctx.restore();

}

function renderPlayer() {

}



// GAME LOOP
function update() {
    mozRequestAnimationFrame(update, ctx);

    player.update();
    
    updateCamera(player);

    renderMap();

    if (tpsCounter % (TPS / player.framerate) === 0) {
	player.updateAnimation();
    }

    if (++tpsCounter > 60)
	tpsCounter = 0;
}

update();
