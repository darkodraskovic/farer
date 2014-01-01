// LOAD DATA
var assetsToLoad = 8;
var loadedAssets = 0;

var topDownMapData;
var topDownSheet;

var platformerMapData;
var platformerSheet;

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

    xhr.open("GET", "data/movingPlatforms.json", false);
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

};

var tdMapTiles = new Image();
var tdPlayerTiles = new Image();
var pfPlayerTiles = new Image();
var pfMapTiles = new Image();

function loadImages() {
    tdMapTiles.addEventListener("load", loadHandler, false);
    tdMapTiles.src = "images/groundTiles.png";

    tdPlayerTiles.addEventListener("load", loadHandler, false);
    tdPlayerTiles.src = "images/playerTiles.png";

    pfPlayerTiles.addEventListener("load", loadHandler, false);
    pfPlayerTiles.src = "images/raiser_anim.png";

    pfMapTiles.addEventListener("load", loadHandler, false);
    pfMapTiles.src = "images/outdoorTiles.png";
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


