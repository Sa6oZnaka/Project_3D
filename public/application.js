var socket = io();
            
socket.on("id", function(id, data, list){
    sharedStorage.id = id;
    sharedStorage.data = data;
    sharedStorage.list = list;
    //starts the game when connection is established
    
    socket.on("listCon", function(id){
        sharedStorage.list[id]=1;
    });
    socket.on("listDiscon", function(id){
        sharedStorage.list[id]=0;
    });
    socket.on("update", function(variable, value){
        sharedStorage.data[variable] = value;
    });
    socket.on("updateForUser", function(user, variable, value){
        if (sharedStorage.data.users[user] == undefined){
            sharedStorage.data.users[user] = {};
        }
        sharedStorage.data.users[user][variable] = value;
    });
    
    initGame();
    redraw();
    callupdate();
});

            
class SharedStorage{
    constructor(){
        this.list = [];
        this.data = {};
        this.data.users = [];
    }
    
    set(variable, value){
        this.data[variable] = value;
        socket.emit("update", variable, value);
    }
    
    get(variable){
        return this.data[variable];
    }
    
    setForUser(user, variable, value){
        if (this.data.users[user] == undefined){
            this.data.users[user] = {};
        }
        this.data.users[user][variable] = value;
        socket.emit("updateForUser", user, variable, value);
    }
    
    getForUser(user, variable){
        if (this.data.users[user]==undefined){
            this.data.users[user] = {};
        }
        return this.data.users[user][variable];
    }
    
    setForMe(variable, value){
        this.setForUser(this.id, variable, value);
    }
    
    getForMe(variable){
        return this.getForUser(this.id, variable);
    }
};
var sharedStorage = new SharedStorage();
            

           
            
var canvas = document.getElementById("canvas-id");
var context = canvas.getContext("2d");

// global variables with mouse coordinates
var mouseX = 0;
var mouseY = 0;

// some keycodes
var key_left	= 37;
var key_up		= 38;
var key_right	= 39;
var key_down	= 40;
var key_a		= 65;
var key_z		= 90;

var isKeyPressed=[];
for(i=0;i<256;++i)
	isKeyPressed.push(0);

// gridSize = 50; // uncomment or add to game.js if you want a grid

var reqAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		setTimeout(callback, 1000/30);
	}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

	// draw grid
	context.fillStyle = "#FF0000";
	context.font = "10px Arial";
	if(typeof gridSize != "undefined" && gridSize >= 25) {
		context.fillText(0, 4, 10);
		context.beginPath();
		for(i=gridSize;i<canvas.width;i+=gridSize) {
			context.moveTo(i, 0);
			context.lineTo(i, canvas.height);
			context.fillText(i, i+4, 10);
		}
		for(i=gridSize;i<canvas.height;i+=gridSize) {
			context.moveTo(0, i);
			context.lineTo(canvas.width, i);
			context.fillText(i, 4, i+10);
		}
		context.stroke();
	}

	context.fillStyle = "#0000FF"; 

	draw(); 

	reqAnimationFrame(redraw);
}

function callupdate() {
	update(); // call programmer's update() function
	setTimeout(callupdate, 10); // and 10 ms after that ...
}

function areColliding(Ax, Ay, Awidth, Aheight, Bx, By, Bwidth, Bheight) {
	if (Bx <= Ax + Awidth) {
		if (Ax <= Bx + Bwidth) {
			if (By <= Ay + Aheight) {
				if (Ay <= By + Bheight) {
					return 1;
				}
			}
		}
	}
	return 0;
}

function init() {
	window.addEventListener("mousemove", function(e) {
		// update mouse coordinates
		mouseX=e.pageX-canvas.offsetLeft;
		mouseY=e.pageY-canvas.offsetTop;
        if(mouseX < 0){
            mouseX = 0.01;
        }
        if(mouseY < 0){
            mouseY = 0.01;
        }
        if(mouseX > canvas.width){
            mouseX = canvas.width;
        }
        if(mouseY > canvas.height){
            mouseY = canvas.height;
        }
        
	});

	// add eventlisteners for defined functions
	if(typeof mousemove != "undefined")
		window.addEventListener("mousemove", mousemoves);
	if(typeof mouseup != "undefined")
		window.addEventListener("mouseup", mouseup);
	if(typeof mousedown != "undefined")
		window.addEventListener("mousedown", mousedown);

	if(typeof keydown != "undefined")
		window.addEventListener("keydown", function(e) {
			isKeyPressed[e.keyCode]=1;
			keydown(e.keyCode);
		});
	else window.addEventListener("keydown", function(e) {
		isKeyPressed[e.keyCode]=1;
	});
	if(typeof keyup != "undefined")
		window.addEventListener("keyup", function(e) {
			isKeyPressed[e.keyCode]=0;
			keyup(e.keyCode);
		});
	else window.addEventListener("keyup", function(e) {
		isKeyPressed[e.keyCode]=0;
	});

	// check for function draw() existence
	if(typeof draw == "undefined")
		redraw = function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.globalAlpha = 1;
			context.fillStyle = "#FF0000";
			context.font = "30px Arial";
			context.fillText("You have an error in your draw function or somewhere else!", 40, 40);
		}
}