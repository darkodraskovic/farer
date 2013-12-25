var Animator = function(image, sheet, sprite) {
    this.image = image;
    this.sheet = sheet;
    this.sprite = sprite;
    this.currentFrame = 0;
    this.frameRate = 1;
    this.loop = true;
    this.sprite.animator = this;
    
    this.parseImageData = function() {
	this.imgName = sheet["image"]["name"];
	this.imgW = sheet["image"]["imagewidth"];
	this.imgH = sheet["image"]["imageheight"];
	this.tileW = sheet["image"]["tilewidth"];
	this.tileH = sheet["image"]["tileheight"];
	this.cols = sheet["image"]["cols"];
	this.rows = sheet["image"]["rows"];
	this.sequences = sheet["sequences"];
	
	this.srcX = 0;
	this.srcY = 0;
    };

    this.play = function(sequence) {
	if (this.currentSequence != sequence) {
	    this.currentSequence = sequence;
	    this.currentFrame = 0;
	    this.frameRate = this.sequences[sequence]["framerate"];
	    this.loop = this.sequences[sequence]["loop"];
	}
	var frames = this.sequences[sequence]["frames"];
	this.srcX = (frames[this.currentFrame] % this.cols) * this.tileW;
	this.srcY = Math.floor(frames[this.currentFrame] / this.cols) * this.tileH;

	this.currentFrame++;
	
	if (this.loop && this.currentFrame >= frames.length)
	    this.currentFrame = 0;
    };
};
