var map = {
    initMap: function(mapData, canvas, img) {
	this.layers = mapData["layers"];
	this.tilesetsData = mapData["tilesets"];

	this.img = img;
	this.tileW = mapData["tilewidth"];
	this.tileH = mapData["tileheight"];
	this.imgW = mapData["tilesets"][0]["imagewidth"];
	this.imgH = mapData["tilesets"][0]["imageheight"];	
	this.tileCols = this.imgW / this.tileW;
	this.tileRows = this.imgH / this.tileH;

	this.cols = mapData["width"];
	this.rows = mapData["height"];

	this.w = this.cols * this.tileW;
	this.h = this.rows * this.tileH;

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
