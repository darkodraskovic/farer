// LOAD DATA
var assetsToLoad = 11;
var loadedAssets = 0;

var topDownMapData;
var topDownSheet;

var platformerMapData;
var platformerSheet;

var pacmanMapData;
var pacmanSpriteData;

var loadData = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/topdownMap.json", false);
    xhr.onload = function() {
	loadHandler();
	topDownMapData = JSON.parse(this.responseText);
    };
    xhr.send();

    xhr.open("GET", "data/manSheet.json", false);
    xhr.onload = function() {
	loadHandler();
	topDownSheet = JSON.parse(this.responseText);
    };
    xhr.send();

    xhr.open("GET", "data/platformerMap.json", false);
    xhr.onload = function() {
	loadHandler();
	platformerMapData = JSON.parse(this.responseText);
    };
    xhr.send();

    xhr.open("GET", "data/platformerSheet.json", false);
    xhr.onload = function() {
	loadHandler();
	platformerSheet = JSON.parse(this.responseText);
    };
    xhr.send();

    xhr.open("GET", "data/pacmanMap.json", false);
    xhr.onload = function() {
	loadHandler();
	pacmanMapData = JSON.parse(this.responseText);
    };
    xhr.send();

    xhr.open("GET", "data/pacmanSprite.json", false);
    xhr.onload = function() {
	loadHandler();
	pacmanSpriteData = JSON.parse(this.responseText);
    };
    xhr.send();

};

var tdMapTiles = new Image();
var tdPlayerTiles = new Image();
var pfPlayerTiles = new Image();
var pfMapTiles = new Image();
var pacmanTiles = new Image();

function loadImages() {
    tdMapTiles.addEventListener("load", loadHandler, false);
    tdMapTiles.src = "images/groundTiles.png";

    tdPlayerTiles.addEventListener("load", loadHandler, false);
    tdPlayerTiles.src = "images/playerTiles.png";

    pfPlayerTiles.addEventListener("load", loadHandler, false);
    pfPlayerTiles.src = "images/raiser_anim.png";

    pfMapTiles.addEventListener("load", loadHandler, false);
    pfMapTiles.src = "images/platformertiles.png";

    pacmanTiles.addEventListener("load", loadHandler, false);
    pacmanTiles.src = "images/pacmanTiles.png";
}

function loadHandler() {
    loadedAssets++;
    if (loadedAssets >= assetsToLoad) {
    	gameState = INITIALIZE_STATE;
	console.log("Initializing");
    }
}

console.log("Loading");
loadData();
loadImages();


