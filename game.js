/*
 * To Do:
 * Enemies.
 * Floors.
 * Dig walls?
 */

var Game = {
	
	player : null,
	grid : null,
	rooms : [],
	creatures : [],
	totalDelta : new Vector2(0, 0),
	
	attackAnimations : [],
	
	tileSetRaw : document.getElementById("tileset"),
	tileSet : [],
	
	tileTypeToColour : {0 : "#59321A",
						1 : "#707070",
						2 : "#676767",
					},
	
	fillScreen : function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},
	
	onResize : function(){
		this.fillScreen();
		
		var midScreen = new Vector2(canvas.width / 2, canvas.height / 2);
		var delta = midScreen.copy().sub(this.player.centre);
		
		this.grid.move(delta[0], delta[1]);
		this.grid.screenBottomRight = [canvas.width, canvas.height];
		this.player.centre = midScreen;
		this.player.hitCircle.centre = midScreen;
	},
	
	newFloor : function(){
		// #Newfloors
		
		this.grid.fillDefault();
		this.rooms = [];
		
		this.rooms = MapGen.generate(this.grid);
		
		var canMove = [0, 0];
		
		do{
			this.totalDelta = new Vector2(0, 0);
			this.grid.topleft = new Vector2(0, 0);
			
			var spawnRoom = Random.choice(this.rooms);
			var delta = [-spawnRoom.centre[0] * this.grid.tileSize[0] + canvas.width / 2, -spawnRoom.centre[1] * this.grid.tileSize[1] + canvas.height / 2];
			
			this.pan(delta);
			
			canMove = this.player.checkMove(Vector2.ZERO);
		}
		while(canMove[0] !== 1 || canMove[1] !== 1);
	},
	
	init : function(){
		this.fillScreen();
		
		this.tileSet = new Tileset(this.tileSetRaw, [16, 16], [48, 48], 1);
		this.tileTypeToColour[0] = this.tileSet[2][0];
		this.tileTypeToColour[1] = this.tileSet[1][0];
		this.tileTypeToColour[2] = this.tileSet[0][0];
		
		this.player = new Player(this);
		window.onmousedown = function(){ Game.player.attack(); };
		
		this.grid = new Grid([0, 0], [75, 48], [48, 48], canvas, 0, this.tileTypeToColour);
		this.newFloor();
		
	},
	
	update : function(){
		for (var i = this.creatures.length-1; i >= 0; i--){
			this.creatures[i].update();
		}
		
		for (var i = this.attackAnimations.length-1; i >= 0; i--){
			this.attackAnimations[i].update();
		}
	},
	
	render : function(){
		this.grid.fillTiles(ctx);
		
		for (var i = this.creatures.length-1; i >= 0; i--){
			this.creatures[i].draw(ctx);
		}
		
		for (var i = this.attackAnimations.length-1; i >= 0; i--){
			this.attackAnimations[i].draw(ctx);
		}
	},
	
	pan : function(delta){
		this.grid.move(delta[0], delta[1]);
		this.totalDelta.add(delta);
	}
}

window.onresize = function(){ Game.onResize(); };

function init(){
	Game.init();
}

function update(){
	updateDeltaTime();
	Game.update();
}

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	Game.render();
}

function main(){
	console.time('init timer');
	init();
	console.timeEnd('init timer');
	
	window.setInterval(update, 5);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

setTimeout(main, 10);
