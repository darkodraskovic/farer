function Map() {
    this.initMap = function(mapData, canvas, img) {
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
    };

    this.generateCollisionLayers = function() {
	this.collisionLayers = [];
	this.objectLayers = [];
	
	for (var i = 0; i < this.layers.length; i++) {
	    
	    // Tile layers in TME has "data"; only layers with custom properties has "properties"
	    if (this.layers[i].hasOwnProperty("data") && this.layers[i].hasOwnProperty("properties")
		&& "collision" in this.layers[i]["properties"]) {
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
	    // generate object layers
	    else if (this.layers[i].hasOwnProperty("objects")) {
		var objects = this.layers[i]["objects"];
		this.objectLayers[this.objectLayers.length] = [];
		for (var obj in objects) {
		    var actObj = new ActiveObject();
		    actObj.h = objects[obj]["height"] / this.tileH;
		    actObj.w = objects[obj]["width"] / this.tileW;
		    actObj.visible = objects[obj]["visible"];
		    actObj.name = objects[obj]["name"];
		    actObj.x = objects[obj]["x"];
		    actObj.y = objects[obj]["y"];
		    actObj.code = objects[obj]["gid"];
		    actObj.properties = objects[obj]["properties"];
		    for (var prop in actObj.properties) {
			actObj[prop] = parseInt(actObj.properties[prop]);
		    }
		    this.objectLayers[this.objectLayers.length - 1].push(actObj);
		}
	
	    }
	    
	}
    };
};

