	
var ctx,canvas, color = "#000";	

document.addEventListener( "DOMContentLoaded", function(){

	// setup a new canvas for drawing wait for device init
    setTimeout(function(){
	   newCanvas();
    }, 500);

}, false );

// function to setup a new canvas for drawing
function newCanvas(){
	//define and resize canvas
    document.getElementById("content").style.height = window.innerHeight-90;
    var canvasHtml = '<canvas id="canvas" width="'+window.innerWidth+'" height="'+(window.innerHeight-90)+'"></canvas>';
	document.getElementById("content").innerHTML = canvasHtml;
    canvas = document.getElementById('canvas');
    // setup canvas
	ctx=document.getElementById("canvas").getContext("2d");

    ctx.strokeStyle = color;
	ctx.lineWidth = 5;	
	
	// setup to trigger drawing on mouse or touch
    drawTouch();
    drawPointer();
	drawMouse();

    //listeners for file open
    document.getElementById('btn-file').addEventListener('click', () => {
        document.getElementById('file').click()
    });
    const loadInput = document.getElementById('file');
    loadInput.addEventListener('change', (event) => load(event, canvas));
    //listener for save image
    document.getElementById('btn-save').addEventListener('click', () => save(canvas));
}

function save(canvas) {
    const data = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = data;
    anchor.download = 'image.png';
    anchor.click();
}
function getFile(event) {
    return [...event.target.files].pop();
}
function readTheFile(file) {
    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    })
}
function loadTheImage(image, canvas) {
    const img = new Image();
    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = image;
}
function load(event, canvas) {
    const file = getFile(event);
    readTheFile(file, canvas)
        .then((image) => loadTheImage(image, canvas))
}
function selectColor(el){
    for(var i=0;i<document.getElementsByClassName("palette").length;i++){
        document.getElementsByClassName("palette")[i].style.borderColor = "#777";
        document.getElementsByClassName("palette")[i].style.borderStyle = "solid";
    }
    el.style.borderColor = "#fff";
    el.style.borderStyle = "dashed";
    color = window.getComputedStyle(el).backgroundColor;
    ctx.beginPath();
    ctx.strokeStyle = color;
}

// prototype to	start drawing on touch using canvas moveTo and lineTo
var drawTouch = function() {
	var start = function(e) {
		ctx.beginPath();
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY-44;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
		x = e.changedTouches[0].pageX;
		y = e.changedTouches[0].pageY-44;
        ctx.lineJoin = "round";
		ctx.lineTo(x,y);
		ctx.stroke();
	};
    document.getElementById("canvas").addEventListener("touchstart", start, false);
	document.getElementById("canvas").addEventListener("touchmove", move, false);
}; 
    
// prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
var drawPointer = function() {
	var start = function(e) {
        e = e.originalEvent;
		ctx.beginPath();
		x = e.pageX;
		y = e.pageY-44;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
        e = e.originalEvent;
		x = e.pageX;
		y = e.pageY-44;
        ctx.lineJoin = "round";
		ctx.lineTo(x,y);
		ctx.stroke();
    };
    document.getElementById("canvas").addEventListener("MSPointerDown", start, false);
	document.getElementById("canvas").addEventListener("MSPointerMove", move, false);
};        

// prototype to	start drawing on mouse using canvas moveTo and lineTo
var drawMouse = function() {
	var clicked = 0;
	var start = function(e) {
		clicked = 1;
		ctx.beginPath();
		x = e.pageX;
		y = e.pageY-44;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		if(clicked){
			x = e.pageX;
			y = e.pageY-44;
            ctx.lineJoin = "round";
			ctx.lineTo(x,y);
			ctx.stroke();
		}
	};
	var stop = function(e) {
		clicked = 0;
	};
    document.getElementById("canvas").addEventListener("mousedown", start, false);
	document.getElementById("canvas").addEventListener("mousemove", move, false);
	document.addEventListener("mouseup", stop, false);
};