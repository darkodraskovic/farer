function findCollisionCandidates(sprite, map) {
    var collisionCandidates = [];    
    
    var spriteMapX = Math.floor(sprite.centerX() / map.tileW);
    var spriteMapY = Math.floor(sprite.centerY() / map.tileH);
    for (var i = 0; i < map.collisionLayers.length; i++) {
	var collisionLayer = map.collisionLayers[i];

	collisionCandidates.push(collisionLayer[spriteMapX][spriteMapY]);    
	if (sprite.vx < 0) {
	    collisionCandidates.push(collisionLayer[spriteMapX - 1][spriteMapY]);
	} else if (sprite.vx > 0) {
	    collisionCandidates.push(collisionLayer[spriteMapX + 1][spriteMapY]);
	}
	if (sprite.vy < 0) {
	    collisionCandidates.push(collisionLayer[spriteMapX][spriteMapY - 1]);
	} else if (sprite.vy > 0) {
	    collisionCandidates.push(collisionLayer[spriteMapX][spriteMapY + 1]);
	}
    }

    return collisionCandidates;
}

function blockRectangle(r1, r2)
{
    // Collision bit mask defines the collision types sprite r1 interacts with
    if (!(r1.colMask & r2.colType)) {
	return "overlap";
    } 

    //A variable to tell us which side the collision is occurring on
    var collisionSide = "";
    
    //Calculate the distance vector
    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();
    
    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();
    
    //Check whether vx is less than the combined half-widths 
    if(Math.abs(vx) < combinedHalfWidths) 
    {
	//A collision might be occurring! 
	//Check whether vy is less than the combined half-heights 
	if(Math.abs(vy) < combinedHalfHeights)
	{
	    //A collision has occurred! This is good! 
	    //Find out the size of the overlap on both the X and Y axes
	    var overlapX = combinedHalfWidths - Math.abs(vx);
	    var overlapY = combinedHalfHeights - Math.abs(vy);
            
	    //The collision has occurred on the axis with the
	    //*smallest* amount of overlap. Let's figure out which
	    //axis that is
            
	    if(overlapX >= overlapY)
	    {
		//The collision is happening on the X axis 
		//But on which side? vy can tell us
		if(vy > 0)
		{
		    collisionSide = "top";
		    
		    //Move the rectangle out of the collision
		    r1.y = r1.y + overlapY;
		}
		else 
		{
		    collisionSide = "bottom";
		    
		    //Move the rectangle out of the collision
		    r1.y = r1.y - overlapY;
		}
	    } 
	    else 
	    {
		//The collision is happening on the Y axis 
		//But on which side? vx can tell us
		if(vx > 0)
		{
		    collisionSide = "left";
		    
		    //Move the rectangle out of the collision
		    r1.x = r1.x + overlapX;
		}
		else 
		{
		    collisionSide = "right";
		    
		    //Move the rectangle out of the collision
		    r1.x = r1.x - overlapX;
		}
	    } 
	}
	else 
	{
	    //No collision
	    collisionSide = "none";
	}
    } 
    else 
    {
	//No collision
	collisionSide = "none";
    }
    
    return collisionSide;
}

