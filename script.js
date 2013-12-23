var TPS = 60;
var tpsCounter = 0;

// Get a reference to the canvas and context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var map;
var playerSpriteSheet;

var loadData = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/testLevel.json", false);
    xhr.onload = function() {
	map = JSON.parse(this.responseText);
    };
    xhr.send();
    
    xhr.open("GET", "data/playerSpriteSheet.json", false);
    xhr.onload = function() {
	playerSpriteSheet = JSON.parse(this.responseText);
    };
    xhr.send();
};



loadData();

var groundTiles = new Image();
// groundTiles.addEventListener("load", loadHandler, false);
groundTiles.src = "images/groundTiles.png";

var playerTiles = new Image();
// playerWalking.addEventListener("load", loadHandler, false);
playerTiles.src = "images/playerTiles.png";

function loadHandler() {
    // ctx.drawImage(groundTiles,
    // 		  0, 0, groundTiles.width, groundTiles.height,
    // 		  0, 0, groundTiles.width, groundTiles.height);
    // console.log(groundTiles.height);
    
    renderMap(groundTiles);
}

var TILE_WIDTH = map["tilewidth"];
var TILE_HEIGHT = map["tileheight"];
var MAP_ROWS = map["height"];
var MAP_COLS = map["width"];
var MAP_LAYERS = map["layers"].length;
var TILESHEET_ROWS = groundTiles.height / TILE_HEIGHT;
var TILESHEET_COLS = groundTiles.width / TILE_WIDTH;

var VIEWPORT_WIDTH = canvas.width / TILE_WIDTH;
var VIEWPORT_HEIGHT = canvas.height / TILE_HEIGHT;


var player = new Sprite("player", playerTiles, playerSpriteSheet, 256, 256, 12, 12);
player.spdX = 100;
player.spdY = 100;
player.updateAction("standing");


// SCROLLING
// objs
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

// INPUT
// Arrow key codes
var LEFT = 37;
var RIGHT = 39;   
var UP = 38;   
var DOWN = 40;   


// Event listeners
window.addEventListener("keydown", function(event){
    switch(event.keyCode) {
    case LEFT:
	player.movL = true;
	break;	   	
    case RIGHT:
	player.movR = true;
	break;
    case UP:
	player.movU = true;
	break;	   
    case DOWN:
	player.movD = true;
	break;	   	
    default: 
	break;
    }

    
    player.updateFacingDirection();
    player.updateAction("walking");

});

window.addEventListener("keyup", function(event){
    switch(event.keyCode) {
    case LEFT:
	player.movL = false;
	break;	   	
    case RIGHT:
	player.movR = false;
	break;
    case UP:
	player.movU = false;
	break;	   
    case DOWN:
	player.movD = false;
	break;	   	
    default:
	break;
    }

    player.updateFacingDirection();
    if (!player.movU && !player.movD && !player.movL && !player.movR) {
	player.updateAction("standing");
    }

});


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





// Render the game by looping through the map array
function renderMap(tilesheet){

    var offset = [Math.floor(camera.x / TILE_WIDTH), Math.floor(camera.y / TILE_HEIGHT)];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    var i, j, k;
    for (i = 0; i < MAP_LAYERS; i++) {
	var layerData = map["layers"][i]["data"];
	for (j = offset[0]; j <= (offset[0] + VIEWPORT_WIDTH); j++) {
	    for (k = offset[1]; k <= (offset[1] + VIEWPORT_HEIGHT); k++) {
		var cell = k * MAP_ROWS + j;
		if (layerData[cell] > 0) {
		    ctx.drawImage(tilesheet,
		    		  ((layerData[cell] - 1) % TILESHEET_COLS) * TILE_WIDTH,
				  Math.floor((layerData[cell] - 1) / TILESHEET_COLS) * TILE_HEIGHT,
		    		  TILE_WIDTH, TILE_HEIGHT,
		    		  (cell % MAP_COLS) * TILE_WIDTH, Math.floor(cell / MAP_COLS) * TILE_HEIGHT,
				  TILE_WIDTH, TILE_HEIGHT);

		}
	    }
	    
	}
    }

    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.drawImage(player.img,
    		  player.srcX, player.srcY, player.tileW, player.tileH,
    		  -player.tileW / 2, -player.tileH / 2, player.tileW, player.tileH
    		 );

    ctx.restore();


}

function renderPlayer() {

}

function update() {
    mozRequestAnimationFrame(update, ctx);

    player.update();
    
    updateCamera(player);

    renderMap(groundTiles);

    if (tpsCounter % (TPS / player.framerate) === 0) {
	player.updateAnimation();
    }

    if (++tpsCounter > 60)
	tpsCounter = 0;
}

update();
