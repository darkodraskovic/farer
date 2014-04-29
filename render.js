// SETUP CAMERA
function Camera(map) {
    this.x = 0;
    this.y = 0;
    this.w = canvas.width;
    this.h = canvas.height,

    this.updateCamera = function(followee, map) {
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
    this.rightInnerBoundary = function() {
	return this.x + this.w * 3/4;
    },
    this.leftInnerBoundary = function() {
	return this.x + this.w * 1/4;
    },
    this.topInnerBoundary = function() {
	return this.y + this.h * 1/4;
    },
    this.bottomInnerBoundary = function() {
	return this.y + this.h * 3/4;
    }

};


// RENDER GAME
function renderMap(map, player){
    // var offsetX;
    // var offsetY;
    // if (map.cols < map.viewportW)
    // 	offsetX = 0;
    // else offsetX = Math.floor(camera.x / map.tileW);
    // if (map.rows < map.viewportH)
    // 	offsetY = 0;
    // else offsetY = Math.floor(camera.x / map.tileH);
    
    var offset = [Math.floor(camera.x / map.tileW), Math.floor(camera.y / map.tileH)];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // render the map
    var i, j, k;
    var colInd = 0;
    var objInd = 0;
    for (i = 0; i < map.layers.length; i++) {
	// render background and collision layers
	if ("data" in map.layers[i]) {
    	    var data = map.layers[i]["data"];
	    if (map.layers[i]["properties"]["background"]) {
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
	    if (map.layers[i]["properties"]["collision"]) {
    		for (j = offset[0]; j <= (offset[0] + map.viewportW); j++) {
    		    for (k = offset[1]; k <= (offset[1] + map.viewportH); k++) {
    			var cell = k * map.cols + j;
    			if (data[cell] > 0 && map.collisionLayers[colInd][j] && map.collisionLayers[colInd][j][k]) {
			    var colObj =  map.collisionLayers[colInd][j][k];
			    if (colObj.exists) {
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
		colInd++;
    	    }

	}
	// render object layers
	else if ("objects" in map.layers[i] && map.objectLayers[objInd]) {
	    var objects = map.objectLayers[objInd];
	    if (map.layers[i]["properties"]["tiled"]) {
		for (j = 0; j < objects.length; j++) {
    		    ctx.drawImage(map.img,
    		    		  ((objects[j].code - 1) % map.tileCols) * map.tileW,
    				  Math.floor((objects[j].code - 1) / map.tileCols) * map.tileH,
    		    		  map.tileW, map.tileH,
    		    		  objects[j].x, objects[j].y,
    				  objects[j].w, objects[j].h);		
		}
	    } else if (map.layers[i]["properties"]["moving"]) {

		for (j = 0; j < objects.length; j++) {
		    ctx.fillStyle="#FF0000";
		    ctx.fillRect(objects[j].x, objects[j].y, objects[j].w, objects[j].h);
		}
	    }
	    objInd++;
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
