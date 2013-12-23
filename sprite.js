function Sprite(name, img, sheet, x, y, w, h) {
    this.name = name;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.spdX = 0;
    this.spdY = 0;
    this.rotation = 0;

    // Movement & facing directions
    this.facDir = "N";
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    
    this.action = undefined;
    this.sheet = sheet;

    this.updateFacingDirection = function () {
	if (this.moveLeft && this.moveUp)
	    this.facDir = "NW";
	else if (this.moveLeft && this.moveDown)
	    this.facDir = "SW";
	else if (this.moveRight && this.moveUp)
	    this.facDir = "NE";
	else if (this.moveRight && this.moveDown)
	    this.facDir = "SE";
	else if (this.moveRight)
	    this.facDir = "E";
	else if (this.moveLeft)
	    this.facDir = "W";
	else if (this.moveUp)
	    this.facDir = "N";
	else if (this.moveDown)
	    this.facDir = "S";

    };
    
    this.updateAction = function(action) {
	if (this.action == action) {
	    return;
	}
	else {
	    this.action = action;
	    
	    this.currentFrame = 0;
	    this.tileW = this.sheet[this.action]["tilewidth"];
	    this.tileH = this.sheet[this.action]["tileheight"];
	    this.startRow = this.sheet[this.action]["startrow"];
	    this.tileRows = this.sheet[this.action]["tilerows"];
	    this.tileCols = this.sheet[this.action]["tilecols"];
	    this.numOfFrames = this.sheet[this.action]["frames"];
	    this.framerate = this.sheet[this.action]["framerate"];

	    this.updateAnimation();
	}
    };
    
    this.updateAnimation = function() {
	this.srcX
	    = (this.currentFrame % this.tileCols) * this.tileW;
	this.srcY
	    = Math.floor((this.currentFrame / this.tileCols) + this.startRow) * this.tileH;

	this.currentFrame++;

	if(this.currentFrame >= this.numOfFrames) {
	    this.currentFrame = 0;
	}
    };

    this.update = function() {
	switch(this.facDir) {
	case "N": this.rotation = 0;
	    break;
	case "NE": this.rotation = 45;
	    break;
	case "E": this.rotation = 90;
	    break;
	case "SE": this.rotation = 135;
	    break;
	case "S": this.rotation = 180;
	    break;
	case "SW": this.rotation = 225;
	    break;
	case "W": this.rotation = 270;
	    break;
	case "NW": this.rotation = 315;
	    break;

	}
	
	// move player
	if (this.moveLeft && !this.moveRight) {
	    this.vx = -this.spdX;
	}
	if (this.moveRight && !this.moveLeft) {
	    this.vx = this.spdX;
	}
	if (this.moveUp && !this.moveDown) {
	    this.vy = -this.spdY;
	}
	if (this.moveDown && !this.moveUp) {
	    this.vy = this.spdY;
	}
	if (!this.moveLeft && !this.moveRight) {
	    this.vx = 0;
	}
	if (!this.moveUp && !this.moveDown) {
	    this.vy = 0;
	}

	this.x += Math.floor(this.vx / TPS);
	this.y += Math.floor(this.vy / TPS);

    };

}
