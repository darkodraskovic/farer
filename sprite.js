// CONSTS
var MASK_NONE = 0;
var MASK_SCENERY = 1;
var MASK_PLAYER = 2;

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
    this.forceX = 0;
    this.forceY = 0;
    this.rotation = 0;

    this.colType = MASK_PLAYER;
    this.colMask = MASK_SCENERY;

    // Movement & facing directions
    this.facDir = undefined;

    this.movL = false;
    this.movR = false;
    this.movU = false;
    this.movD = false;
    
    this.action = undefined;

    this.updatePosition = function() {
	this.vx += this.ax;
	this.vy += this.ay;

	this.x += Math.floor(this.vx / TPS);
	this.y += Math.floor(this.vy / TPS);	
    };

    this.update = function() {
	this.updateAction();
	this.updateMovement();
	this.updatePosition();
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


// TOPDOWN SPRITE
function TopDownSprite() {};
TopDownSprite.prototype = new Sprite("top-down", 0, 0, 0, 0);
TopDownSprite.prototype.facDir = "E";

TopDownSprite.prototype.updateFacingDirection = function () {
    if (this.movL && this.movU) {
	this.facDir = "NW";
	this.rotation = 315;
    } else if (this.movL && this.movD) {
	this.facDir = "SW";
	this.rotation = 225;
    } else if (this.movR && this.movU) {
	this.facDir = "NE";
	this.rotation = 45;
    } else if (this.movR && this.movD) {
	this.facDir = "SE"; 
	this.rotation = 135;
    } else if (this.movR) {
	this.facDir = "E";
	this.rotation = 90;
    } else if (this.movL) {
	this.facDir = "W";
	this.rotation = 270;
    } else if (this.movU) {
	this.facDir = "N";
	this.rotation = 0;
    } else if (this.movD) {
	this.facDir = "S";
	this.rotation = 180;
    }

};

TopDownSprite.prototype.updateAction = function() {
    if(this.movL || this.movR || this.movU || this.movD) {
	this.action = "walking";
    } else 	if (!this.movU && !this.movD && !this.movL && !this.movR) {
	this.action = "standing";
    }
};

TopDownSprite.prototype.updateMovement = function() {    
    // move player
    if (this.movL && !this.movR) {
	this.vx = -this.forceX;
    }
    if (this.movR && !this.movL) {
	this.vx = this.forceX;
    }
    if (this.movU && !this.movD) {
	this.vy = -this.forceY;
    }
    if (this.movD && !this.movU) {
	this.vy = this.forceY;
    }
    if (!this.movL && !this.movR) {
	this.vx = 0;
    }
    if (!this.movU && !this.movD) {
	this.vy = 0;
    }
};

// PLATFORMER SPRITE
function PlatformerSprite() {};
PlatformerSprite.prototype = new Sprite("platformer", 0, 0, 0, 0);
PlatformerSprite.prototype.isJumping = false;
PlatformerSprite.prototype.isFalling = false;
PlatformerSprite.prototype.facDir = "right";

PlatformerSprite.prototype.updateFacingDirection = function () {
	if (this.movR)
	    this.facDir = "right";
	else if (this.movL)
	    this.facDir = "left";
};

PlatformerSprite.prototype.updateAction = function() {
    if (this.isJumping) {
	    this.action = "jumping_" + this.facDir;
    }
    else if (this.movL || this.movR) {
	this.action = "running_" + this.facDir;
    } else {
	this.action = "standing_" + this.facDir;
    }
    
};


PlatformerSprite.prototype.updateMovement = function() {	
    // move player
    if (this.movL && !this.movR) {
	this.vx = -this.forceX;
    }
    if (this.movR && !this.movL) {
	this.vx = this.forceX;
    }
    if (this.movU && !this.isJumping) {
	this.isJumping = true;	
	this.vy = -this.forceY;
    }
    // if (this.movD && !this.movU) {
    //     this.vy = this.forceY;
    // }
    if (!this.movL && !this.movR) {
	this.vx = 0;
    }
    // if (!this.movU && !this.movD) {
    //     this.vy = 0;
    // }

};


// SCENERY SPRITE
function SceneryObject() {
    this.rotation = 0;
    this.visible = true;

    this.colType = MASK_SCENERY;

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
