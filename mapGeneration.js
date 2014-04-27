var bossFloor = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

function Room(pos, size){
	this.pos = pos;
	this.size = size;
	
	this.centre = [Math.floor(this.pos[0] + this.size[0] / 2), Math.floor(this.pos[1] + this.size[1] / 2)];
	
	this.connectedTo = null;
}

var MapGen = {
	minRooms : 4,
	maxRooms : 12,
	
	minLakes : 0,
	maxLakes : 6,
	
	minRoomSize : [6, 6],
	maxRoomSize : [20, 20],
	
	connectRooms : function(grid, room1, room2){
		var tile;
		
		for (var i=room1.centre[0]; i != room2.centre[0]; i += (room1.centre[0] > room2.centre[0] ? -1 : 1)){
			grid.tileTypes[i][room1.centre[1]] = 1;
			tile = [i, room1.centre[1]];
		}
		
		if (tile === undefined){
			return false;
		}
		
		for (var i=tile[1]; i != room2.centre[1]; i += (tile[1] > room2.centre[1] ? -1 : 1)){
			grid.tileTypes[tile[0]][i] = 1;
		}
		
		return true;
	},
	
	generate : function(grid){
		var rooms = [];
		
		var numRooms = Random.range(this.minRooms, this.maxRooms);
		var numLakes = Random.range(this.minLakes, this.maxLakes);
		
		for (var i=0; i < numRooms; i++){
			var pos = [Random.range(grid.size[0]), Random.range(grid.size[1])];
			var size = [Random.range(this.minRoomSize[0], this.maxRoomSize[0]), Random.range(this.minRoomSize[1], this.maxRoomSize[1])];
			
			if (size[0] > grid.size[0] - pos[0]){
				size[0] = grid.size[0] - pos[0];
			}
			
			if (size[1] > grid.size[1] - pos[1]){
				size[1] = grid.size[1] - pos[1];
			}
			
			var room = new Room(pos, size);
			rooms.push(room);
			
			for(var x = pos[0] + size[0] - 1; x > pos[0]; x--){
				for(var y = pos[1] + size[1] - 1; y > pos[1]; y--){
					grid.tileTypes[x][y] = 1;
				}
			}
		}
	
		for (var i=0; i < rooms.length; i++){
			var connectTo;
			
			do{
				connectTo = Random.choice(rooms);
			}
			while(connectTo === rooms[i] || connectTo.connectedTo === rooms[i]);
			
			rooms[i].connectedTo = connectTo;
			
			var connected = false;
			
			this.connectRooms(grid, rooms[i], connectTo);
		}
		
		for (var i=0; i < numLakes; i++){
			var room = Random.choice(rooms);
			
			var pos = [Random.range(room.pos[0] + 1, room.pos[0] + room.size[0]-1),
			           Random.range(room.pos[1] + 1, room.pos[1] + room.size[1]-1)];
			
			var width = Random.range(1, room.size[0] - (pos[0] - room.pos[0]));
			var height = Random.range(1, room.size[1] - (pos[1] - room.pos[1]));
			
			for(var x=pos[0]; x < pos[0] + width; x++){
				for(var y=pos[1]; y < pos[1] + height; y++){
					grid.tileTypes[x][y] = 3;
				}
			}
		}
		
		var stairsTile;
		
		do{
			stairsTile = [Random.range(grid.size[0]), Random.range(grid.size[1])];
		}
		while (grid.tileTypes[stairsTile[0]][stairsTile[1]] !== 1);
		
		grid.tileTypes[stairsTile[0]][stairsTile[1]] = 2;
		
		var chestTile;
		
		do{
			chestTile = [Random.range(grid.size[0]), Random.range(grid.size[1])];
		}
		while (grid.tileTypes[chestTile[0]][chestTile[1]] !== 1);
		
		grid.tileTypes[chestTile[0]][chestTile[1]] = 4;
		
		return rooms;
		
	},
	
	setUpBossFloor : function(grid){
		var room = new Room([1, 1], [18, 18]);
		
		grid.fillDefault(6);
		
		for (var i=0; i < bossFloor.length; i++){
			for (var j=0; j < bossFloor[i].length; j++){
				grid.tileTypes[j][i] = bossFloor[i][j];
			}
		}
		room.centre = [10, 17];
		
		return [room,];
	},
}
