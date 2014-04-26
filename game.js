var Game = {
	
	player : null,
	grid : null,
	rooms : [],
	totalDelta : new Vector2(0, 0),
	
	tileTypeToColour : {0 : "#707070",
						1 : "#59321A",
					},
	
	fillScreen : function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},
	
	onResize : function(){
		this.fillScreen();
		
		var midScreen = new Vector2(canvas.width / 2, canvas.height / 2);
		var delta = midScreen.copy().sub(this.player.centre);
		
		this.pan(delta);
		this.player.centre = midScreen;
	},
	
	init : function(){
		this.fillScreen();
		
		this.player = new Player(this);
		this.grid = new Grid([0, 0], [75, 48], [48, 48], canvas, 1, this.tileTypeToColour);
		
		this.rooms = MapGen.generate(this.grid);
		
		var spawnRoom = Random.choice(this.rooms);
		var delta = [-spawnRoom.centre[0] * this.grid.tileSize[0] + canvas.width / 2, -spawnRoom.centre[1] * this.grid.tileSize[1] + canvas.height / 2];
		
		this.pan(delta);
	},
	
	update : function(){
		this.player.update(deltaTime);
	},
	
	render : function(){
		ctx.fillStyle = this.tileTypeToColour[0];
		ctx.fillRect(this.grid.topleft[0], this.grid.topleft[1], this.grid.pxSize[0], this.grid.pxSize[1]);
		
		this.grid.fillTiles(ctx, true);
		this.player.draw(ctx);
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
