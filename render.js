// RENDER GAME
function renderMap(map, player){

    var offset = [Math.floor(camera.x / map.tileW), Math.floor(camera.y / map.tileH)];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // render the map
    var i, j, k;
    var objInd = 0;
    for (i = 0; i < map.layers.length; i++) {
	// render background and collision layers
	if ("data" in map.layers[i]) {
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
