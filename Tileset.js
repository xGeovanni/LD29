function imageToCanvas(image){
	var canvas = document.createElement("canvas");
	
	canvas.width = image.width;
	canvas.height = image.height;
	
	canvas.getContext("2d").drawImage(image, 0, 0);

	return canvas;
}

function subCanvasRaw(canvas, x, y, w, h){
	var data = canvas.getContext("2d").getImageData(x, y, w, h);
	
	return data;
}

function subCanvas(canvas, x, y, w, h){
	var newCanvas = document.createElement("canvas");
	
	newCanvas.width = w;
	newCanvas.height = h;
	
	var data = subCanvasRaw(canvas, x, y, w, h);
	
	newCanvas.getContext("2d").putImageData(data, 0, 0);
	
	return newCanvas;
}

function Tileset(image, size, tileSize){
	
	
	this.baseImage = image;
	this.baseCanvas = imageToCanvas(this.baseImage);
	this.size = size;
	this.tileSize = tileSize;
	
	for (var i=0; i < this.size[0]; i++){
		this[i] = [];
		
		for (var j=0; j < this.size[1]; j++){
			this[i].push(subCanvas(this.baseCanvas, i * this.tileSize[0], j * this.tileSize[1], this.tileSize[0], this.tileSize[1]));
		}
	}
}
