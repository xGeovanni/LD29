function Room(pos, size){
	this.pos = pos;
	this.size = size;
	
	this.centre = [Math.floor(this.pos[0] + this.size[0] / 2), Math.floor(this.pos[1] + this.size[1] / 2)];
}

var MapGen = {
	minRooms : 4,
	maxRooms : 12,
	
	minRoomSize : [6, 6],
	maxRoomSize : [20, 20],
	
	connectRooms : function(grid, room1, room2, axis){
		var from;
		var to;
			
		if (room1.pos[axis] < room2.pos[axis]){
			from = room1;
			to = room2;
		}
		else{
			from = room2;
			to = room1;
		}
		
		for (var i=from.centre[axis]; i <= to.centre[axis]; i++){
			if (axis === 0){
				grid.tileTypes[i][from.centre[1]] = 0;
			}
			
			else if (axis === 1){
				grid.tileTypes[from.centre[0]][i] = 0;
			}
		}
	},
	
	generate : function(grid){
		var rooms = [];
		
		var numRooms = Random.range(this.minRooms, this.maxRooms);
		
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
					grid.tileTypes[x][y] = 0;
				}
			}
		}
		
		for (var i=0; i < rooms.length; i++){
			var connectTo;
			
			do{
				connectTo = Random.choice(rooms);
			}
			while(rooms[i] === connectTo);
			
			if (Random.chance(.5)){
				this.connectRooms(grid, rooms[i], connectTo, 0);
				this.connectRooms(grid, rooms[i], connectTo, 1);
			}
			else{
				this.connectRooms(grid, rooms[i], connectTo, 1);
				this.connectRooms(grid, rooms[i], connectTo, 0);
			}
		}
		
		return rooms;
		
	},
}
