// INPUT
// Arrow key codes
var LEFT = 37;
var RIGHT = 39;   
var UP = 38;   
var DOWN = 40;   


function setInput(player) {

    // Event listeners
    window.addEventListener("keydown", function(event){
	switch(event.keyCode) {
	case LEFT:
	    player.movL = true;
	    break;	   	
	case RIGHT:
	    player.movR = true;
	    break;
	case UP:
	    player.movU = true;
	    break;	   
	case DOWN:
	    player.movD = true;
	    break;
	default: 
	    break;
	}

    });

    window.addEventListener("keyup", function(event){
	switch(event.keyCode) {
	case LEFT:
	    player.movL = false;
	    break;	   	
	case RIGHT:
	    player.movR = false;
	    break;
	case UP:
	    player.movU = false;
	    break;	   
	case DOWN:
	    player.movD = false;
	    break;	   	
	default:
	    break;
	}


    });

}
