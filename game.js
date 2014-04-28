/*
 * To Do:
 * 
 * Fog of war?
 * Dig walls?
 * 
 * Shrink bat.
 * 
 * Name:
 * Delvin'
 * Operation: Delve
 */
 
 window.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : false,
	
	player : null,
	grid : null,
	rooms : [],
	creatures : [],
	misc : [],
	totalDelta : new Vector2(0, 0),
	
	timePlayerDead : 0,
	
	enemyClasses : [Zombie, Bat, Spider],
	timeBetweenSpawnEnemy : 4,
	timeUntilSpawnEnemy : 0,
	
	attackAnimations : [],
	weaponPickups : [],
	
	songs : [],
	
	tileSetRaw : document.getElementById("tileset"),
	bossSpritesRaw : document.getElementById("boss_sprites"),
	tileSet : [],
	bossSprites : [],
	
	floor : 1,
	bossFloor : 12,
	
	tileTypeToColour : {0 : "#59321A",
						1 : "#707070",
						2 : "#676767",
						3 : "#000088",
						4 : "7F3300",
						5 : "#000000",
						6 : "#000000",
					},
	
	fillScreen : function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},
	
	intro : function(){
		var screen = document.getElementById("intro");
		
		ctx.drawImage(screen, (canvas.width - screen.width) / 2, (canvas.height - screen.height) / 2);
	},
	
	playMusic : function(){
		this.songs[Math.floor(Math.random() * this.songs.length)].play();
	},
	
	onResize : function(){
		this.fillScreen();
		
		var midScreen = new Vector2(canvas.width / 2, canvas.height / 2);
		var delta = midScreen.copy().sub(this.player.centre);
		
		this.pan(delta);
		this.grid.screenBottomRight = [canvas.width, canvas.height];
		this.player.centre = midScreen;
		this.player.hitCircle.centre = midScreen;
		this.player.createHealthBars();
	},
	
	newFloor : function(){
		// #Newfloors
		
		this.rooms = [];
		this.floorTiles = [];
		this.creatures = [this.player];
		this.attackAnimations = [];
		this.weaponPickups = [];
		
		if (this.floor === this.bossFloor){
			this.rooms = MapGen.setUpBossFloor(this.grid);
		}
		
		else{
			this.grid.fillDefault();
			this.rooms = MapGen.generate(this.grid);
		}
		
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
		
		for (var i=0; i < this.grid.size[0]; i++){
			for(var j=0; j < this.grid.size[1]; j++){
				if (this.grid.tileTypes[i][j] === 1){
					this.floorTiles.push([i, j]);
				}
			}
		}
		
		if (this.floor === this.bossFloor){
			var pos = [19 * 48 / 2 + this.grid.topleft[0], 11 * 48 - 250 + this.grid.topleft[1]];
			
			new Boss(this, pos);
			
			this.weaponPickups.push(new WeaponPickup([pos[0], pos[1] + 8 * 48], undefined, true));
		}
	},
	
	onMouseDown : function(e){
		if (! this.started){
			return;
		}
		
		if (e.button === 0){
			this.player.attack();
		}
		
		else if (e.button === 2){
			if (this.player.weapon instanceof ShotGun || this.player.weapon instanceof Bomb){
				this.player.weapon.use();
			}
		}
	},
	
	init : function(){
		this.fillScreen();
		
		this.tileSet = new Tileset(this.tileSetRaw, [16, 16], [48, 48], 1);
		this.tileTypeToColour[0] = this.tileSet[2][0];
		this.tileTypeToColour[1] = this.tileSet[1][0];
		this.tileTypeToColour[2] = this.tileSet[0][0];
		this.tileTypeToColour[3] = this.tileSet[3][0];
		this.tileTypeToColour[4] = this.tileSet[4][0];
		this.tileTypeToColour[5] = this.tileSet[5][0];
		
		this.bossSprites = new Tileset(this.bossSpritesRaw, [5, 1], [500, 500], 1);
		
		Blaster.image = this.tileSet[0][4];
		SoulGun.image = this.tileSet[1][4];
		ShotGun.image = this.tileSet[2][4];
		Bomb.image    = this.tileSet[3][4];
		Raft.image    =	this.tileSet[4][4];
		
		this.player = new Player(this);
		window.onmousedown = function(e){ Game.onMouseDown(e); };
		
		this.grid = new Grid([0, 0], [75, 48], [48, 48], canvas, 0, this.tileTypeToColour);
		this.newFloor();
		
		this.songs = [document.getElementById("song0"),
					  document.getElementById("song1"),
					  document.getElementById("song2"),
					  ];
					  
		for (var i=this.songs.length-1; i >= 0; i--){
			this.songs[i].addEventListener("ended", function(e){this.currentTime = 0; Game.playMusic();}, false);
		}
		this.playMusic();
		
		this.intro();
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}
		
		for (var i = this.creatures.length-1; i >= 0; i--){
			this.creatures[i].update();
		}
		
		for (var i = this.attackAnimations.length-1; i >= 0; i--){
			this.attackAnimations[i].update();
		}
		
		for (var i = this.weaponPickups.length-1; i >= 0; i--){
			this.weaponPickups[i].update();
		}
		
		this.timeUntilSpawnEnemy -= deltaTime;
		
		if (this.timeUntilSpawnEnemy <= 0){
			this.spawnEnemy();
			this.timeUntilSpawnEnemy = this.timeBetweenSpawnEnemy;
		}
		
		if (this.player.weapon !== null){
			this.player.weapon.update();
		}
		
		if (this.player.dead){
			this.timePlayerDead += deltaTime;
			
			if (this.timePlayerDead >= 5){
				location.reload();
			}
		}
	},
	
	render : function(){
		
		if (! this.started){
			return;
		}
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		this.grid.fillTiles(ctx);
		
		for (var i = this.weaponPickups.length-1; i >= 0; i--){
			this.weaponPickups[i].draw(ctx);
		}
		
		for (var i = this.creatures.length-1; i >= 0; i--){
			this.creatures[i].draw(ctx);
		}
		
		for (var i = this.attackAnimations.length-1; i >= 0; i--){
			this.attackAnimations[i].draw(ctx);
		}
		
		this.player.drawHUD();
		
		if (this.player.dead){
			ctx.globalAlpha = Math.min(1, (this.timePlayerDead / 5));
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	
	},
	
	pan : function(delta){
		this.grid.move(delta[0], delta[1]);
		
		for (var i = this.creatures.length-1; i > 0; i--){
			this.creatures[i].centre.add(delta);
			this.creatures[i].hitCircle.centre.add(delta);
		}
		
		for (var i = this.weaponPickups.length-1; i >= 0; i--){
			this.weaponPickups[i].centre.add(delta);
		}
		
		for (var i = this.attackAnimations.length-1; i >= 0; i--){
			
			if ("centre" in this.attackAnimations[i]){
				this.attackAnimations[i].centre.add(delta);
			}
			
			if ("pos" in this.attackAnimations[i]){
				this.attackAnimations[i].pos.add(delta);
			}
		}
		
		this.totalDelta.add(delta);
	},
	
	spawnEnemy : function(){
		if (this.floor === this.bossFloor){
			return;
		}
		
		var tile = Random.choice(this.floorTiles);;
		
		var enemyClass = Random.choice(this.enemyClasses);
		var pos = this.grid.tileToPxCoords(tile);
		
		pos[0] += this.grid.size[0] * .5;
		pos[1] += this.grid.size[1] * .5;
		
		new enemyClass(this, pos);
	},
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

setTimeout(main, 100);
