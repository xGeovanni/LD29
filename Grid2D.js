// Class assumes access to GameMaths.js and 2D Shapes.js

function Grid(topleft, size, tileSize, screenTopleft, screenBottomRight, defaultTile, tileTypeToColour){
	
	this.topleft = topleft;
	this.size = size;
	this.tileSize = tileSize;
	
	this.tileTypeToColour = tileTypeToColour;
	
	this.screenTopleft = screenTopleft ? screenTopleft : [0, 0];
	this.screenBottomRight = screenBottomRight ? screenBottomRight : [this.size[0] * this.tileSize[0], this.size[1] * this.tileSize[1]];
	
	defaultTile = defaultTile ? defaultTile : 0;
	
	this.tileTypes = [];
	
	for (var i=0; i < this.size[0]; i++){
		this.tileTypes.push([]);
		
		for(var j=0; j < this.size[1]; j++){
			this.tileTypes[i].push(defaultTile);
		}
	}
	
	this.move = function(x, y){
		if (x === 0 && y === 0){
			return;
		}
		
		this.topleft[0] += x;
		this.topleft[1] += y;
	};
	
	this.draw = function(ctx, colour, width){
		ctx.strokeStyle = colour ? colour : "#000000";
		ctx.lineWidth = width ? width : 1;
		
		var end_x = this.topleft[0] + this.size[0] * this.tileSize[0];
		var end_y = this.topleft[1] + this.size[1] * this.tileSize[1];
		
		ctx.beginPath();
		
		var i = this.size[0] + 1;
		
		while(i--){
			var pos = this.topleft[0] + i * this.tileSize[0];
			
			ctx.moveTo(pos, this.topleft[1]);
			ctx.lineTo(pos, end_y);
		}
		
		var j = this.size[1] + 1;
		
		while(j--){
			var pos = this.topleft[1] + j * this.tileSize[1];
						
			ctx.moveTo(this.topleft[0], pos);
			ctx.lineTo(end_x, pos);
		}
		
		ctx.stroke();
	};
	
	this.fillTiles = function(ctx, ignoreZero){
		
		if (this.tileTypeToColour === undefined){
			throw "Grid2D Error: An object is required which maps tile type to a certain colour.";
		}
		
		var start_i = Math.floor((this.screenTopleft[0] - this.topleft[0]) / this.tileSize[0]);
		var start_j = Math.floor((this.screenTopleft[1] - this.topleft[1]) / this.tileSize[1]);
		
		if (start_i >= this.size[0] || start_j >= this.size[1]){
			return;
		}
		
		if (start_i < 0){
			start_i = 0;
		}
		
		if (start_j < 0){
			start_j = 0;
		}
		
		var end_i = Math.ceil((this.screenBottomRight[0] - this.topleft[0]) / this.tileSize[0]);
		var end_j = Math.ceil((this.screenBottomRight[1] - this.topleft[1]) / this.tileSize[1]);
		
		for (var i=start_i; i < end_i; i++){
			if (i < 0 || i >= this.size[0]){
				continue;
			}
			
			for(var j=start_j; j < end_j; j++){
				
				if (j < 0 || j >= this.size[1]){
					continue;
				}
				
				var type = this.tileTypes[i][j];
				
				if (ignoreZero && type === 0){
					continue;
				}
				
				var x = this.topleft[0] + i * this.tileSize[0];
				var y = this.topleft[1] + j * this.tileSize[1];
				
				var colour = this.tileTypeToColour[type];
				
				if (typeof colour === "string"){
					ctx.fillStyle = colour;	
					ctx.fillRect(x, y, this.tileSize[0], this.tileSize[1], 2);
				}
				else{
					colour.style.width = this.tileSize[0] + "px";
					colour.style.height = this.tileSize[1] + "px";
					
					ctx.drawImage(colour, x, y);
				}
			}
		}
	};
}
