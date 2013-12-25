function Sprite(name, x, y, w, h) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.spd = 0;
    this.rotation = 0;

    // Movement & facing directions
    this.facDir = "N";
    this.movL = false;
    this.movR = false;
    this.movU = false;
    this.movD = false;

    
    this.action = undefined;

    this.updateFacingDirection = function () {
	if (this.movL && this.movU)
	    this.facDir = "NW";
	else if (this.movL && this.movD)
	    this.facDir = "SW";
	else if (this.movR && this.movU)
	    this.facDir = "NE";
	else if (this.movR && this.movD)
	    this.facDir = "SE";
	else if (this.movR)
	    this.facDir = "E";
	else if (this.movL)
	    this.facDir = "W";
	else if (this.movU)
	    this.facDir = "N";
	else if (this.movD)
	    this.facDir = "S";

    };

    this.updateAction = function(action) {
	this.action = action;
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
	if (this.movL && !this.movR) {
	    this.vx = -this.spd;
	}
	if (this.movR && !this.movL) {
	    this.vx = this.spd;
	}
	if (this.movU && !this.movD) {
	    this.vy = -this.spd;
	}
	if (this.movD && !this.movU) {
	    this.vy = this.spd;
	}
	if (!this.movL && !this.movR) {
	    this.vx = 0;
	}
	if (!this.movU && !this.movD) {
	    this.vy = 0;
	}

	this.x += Math.floor(this.vx / TPS);
	this.y += Math.floor(this.vy / TPS);

    };

    //Getters
    this.centerX = function() {
	return this.x + (this.w / 2);
    };
    this.centerY = function() {
	return this.y + (this.h / 2);
    };
    this.halfWidth = function() {
	return this.w / 2;
    };
    this.halfHeight = function() {
	return this.h / 2;
    };
}

function SceneryObject() {
    this.rotation = 0;
    this.visible = true;

    //Getters
    this.centerX = function() {
	return this.x + (this.w / 2);
    };
    this.centerY = function() {
	return this.y + (this.h / 2);
    };
    this.halfWidth = function() {
	return this.w / 2;
    };
    this.halfHeight = function() {
	return this.h / 2;
    };
};
