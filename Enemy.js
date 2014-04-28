function Enemy(game, pos, radius, colour, topSpeed, maxHealth, strength, attackCooldown){
	Creature.call(this, game, pos, radius, colour, topSpeed, maxHealth, strength, attackCooldown);
	
	this.enemyUpdate = function(){
	}
	this.AI = function(){
	}
	
	this.specificUpdate = function(){
		this.AI();
		this.enemyUpdate();
	}
	
	this.specificAttack = function(){
		this.game.attackAnimations.push(new basicAttackAnimation(this, this.game.player.centre));
	}	
}

function Zombie(game, pos){
	Enemy.call(this, game, pos, 14, "#6D7F00", 180, 80, 10, .4);
	
	this.sightRadius = 300;
	
	this.timeBetweenSwitchDirection = 1;
	this.timeUntilSwitchDirection = 0;
	
	this.dirXCooldown = .4;
	this.dirYCooldown = .4;
	
	this.timeToFindPlayer = 2;
	this.timeUntilFindPlayer = this.timeToFindPlayer;
	
	this.dirXCooldownRemaining = 0;
	this.dirYCooldownRemaining = 0;
	
	this.AI = function(){
		if (this.centre.distanceTo(this.game.player.centre) < this.sightRadius  && this.timeUntilFindPlayer <= 0){
			var v = this.centre.angleTo(this.game.player.centre).mul(this.topSpeed);
			
			if (this.dirXCooldownRemaining <= 0){
				this.velocity[0] = v[0];
			}
			if (this.dirYCooldownRemaining <= 0){
				this.velocity[1] = v[1];
			}
			
			this.attack();
		}
		else{
			if (this.timeUntilSwitchDirection <= 0){
				var v = GameRandom.normalVector2().mul(this.topSpeed * .5);
				
				if (this.dirXCooldownRemaining <= 0){
					this.velocity[0] = v[0];
				}
				if (this.dirYCooldownRemaining <= 0){
					this.velocity[1] = v[1];
				}
				
				this.timeUntilSwitchDirection = this.timeBetweenSwitchDirection;
			}
		}
	}
	
	this.onCollisionX = function(){
		this.velocity[0] *= -1;
		this.dirXCooldownRemaining = this.dirXCooldown;
	}
	this.onCollisionY = function(){
		this.velocity[1] *= -1;
		this.dirYCooldownRemaining = this.dirYCooldown;
	}
	
	this.specificAttack = function(){
		this.basicAttack(this.game.player.centre);
	}
	
	this.enemyUpdate = function(){
		this.timeUntilSwitchDirection -= deltaTime;
		
		this.dirXCooldownRemaining -= deltaTime;
		this.dirYCooldownRemaining -= deltaTime;
		
		if (this.centre.distanceTo(this.game.player.centre) < this.sightRadius){
			this.timeUntilFindPlayer -= deltaTime;
		}
		else{
			this.timeUntilFindPlayer = this.timeToFindPlayer;
		}
	}
}

function Bat(game, pos){
	Enemy.call(this, game, pos, 10, "#000000", 250, 25, 5, .4);
	this.impassableTiles = [0, 4];
	
	var left_images = [this.game.tileSet[0][2], this.game.tileSet[1][2], this.game.tileSet[2][2], this.game.tileSet[3][2], this.game.tileSet[4][2]];
	var right_images = [this.game.tileSet[0][3], this.game.tileSet[1][3], this.game.tileSet[2][3], this.game.tileSet[3][3], this.game.tileSet[4][3]];
	
	this.sprite = new Sprite(left_images, right_images, .1, true);
	
	this.sightRadius = 500;
	
	this.timeBetweenSwitchDirection = 1;
	this.timeUntilSwitchDirection = 0;
	
	this.dirXCooldown = .4;
	this.dirYCooldown = .4;
	
	this.dirXCooldownRemaining = 0;
	this.dirYCooldownRemaining = 0;
	
	this.draw = function(ctx){
		if (this.dead){
			return;
		}
		
		var pos = [this.centre[0] - 24, this.centre[1] - 24];
		this.sprite.draw(ctx, pos);
	}
	
	this.AI = function(){
		if (this.centre.distanceTo(this.game.player.centre) < this.sightRadius){
			
			var v = this.centre.angleTo(this.game.player.centre).mul(this.topSpeed);
			
			if (this.dirXCooldownRemaining <= 0){
				this.velocity[0] = v[0];
			}
			if (this.dirYCooldownRemaining <= 0){
				this.velocity[1] = v[1];
			}
			
			this.attack();
		}
		else{
			if (this.timeUntilSwitchDirection <= 0){
				var v = GameRandom.normalVector2().mul(this.topSpeed * .5);
				
				if (this.dirXCooldownRemaining <= 0){
					this.velocity[0] = v[0];
				}
				if (this.dirYCooldownRemaining <= 0){
					this.velocity[1] = v[1];
				}
				
				this.timeUntilSwitchDirection = this.timeBetweenSwitchDirection;
			}
		}
	}
	
	this.onCollisionX = function(){
		this.velocity[0] *= -1;
		this.dirXCooldownRemaining = this.dirXCooldown;
	}
	this.onCollisionY = function(){
		this.velocity[1] *= -1;
		this.dirYCooldownRemaining = this.dirYCooldown;
	}
	
	this.specificAttack = function(){
		this.basicAttack(this.game.player.centre);
	}
	
	this.enemyUpdate = function(){
		this.sprite.update();
		
		if (this.velocity[1] > 0){
			this.sprite.facing = facings.RIGHT;
		}
		else if (this.velocity[1] < 0){
			this.sprite.facing = facings.LEFT;
		}
		
		this.timeUntilSwitchDirection -= deltaTime;
		
		this.dirXCooldownRemaining -= deltaTime;
		this.dirYCooldownRemaining -= deltaTime;
	}
}

function Spider(game, pos){
	Enemy.call(this, game, pos, 18, "#888888", 150, 60, 8, .3);
		
	this.sightRadius = 200;
	
	var images = [this.game.tileSet[0][1], this.game.tileSet[1][1], this.game.tileSet[2][1], this.game.tileSet[3][1],
				  this.game.tileSet[4][1], this.game.tileSet[5][1], this.game.tileSet[6][1], this.game.tileSet[7][1], this.game.tileSet[8][1]];
	
	this.sprite = new Sprite(images, null, .1, true);
	
	this.minTileCentreDist = 1;
	
	this.chasingPlayer = false;
	
	this.setUpTiles = function(){
		this.tile = this.game.grid.pxToTileCoords(this.centre.copy());
		this.tileCentre = this.game.grid.tileToPxCoords(this.tile);
		this.tileCentre[0] += this.game.grid.tileSize[0] / 2;
		this.tileCentre[1] += this.game.grid.tileSize[1] / 2;
		this.lastTile = this.tile;
	}
	
	this.setUpTiles();
	
	this.draw = function(ctx){
		if(this.dead){
			return;
		}
		
		var rotation;
		
		if (! this.velocity.equals(Vector2.ZERO)){
			rotation = toRadians(this.velocity.copy().normalise());
		}
		else{
			rotation = 0;
		}
		
		this.sprite.draw(ctx, this.centre, rotation);
	}
	
	this.enemyUpdate = function(){
		this.sprite.update();
	}
	
	this.specificAttack = function(){
		this.basicAttack(this.game.player.centre);
	}
	
	this.pickNewTile = function(){
		var sTiles = this.game.grid.surroundingTiles(this.tile);
		var sWalkable = [];
		
		for (var i=sTiles.length-1; i >= 0; i--){
			if (this.impassableTiles.indexOf(this.game.grid.tileTypes[sTiles[i][0]][sTiles[i][1]])){
				sWalkable.push(sTiles[i]);
			}
		}
		
		var tileHolder = [];
		tileHolder[0] = this.tile[0];
		tileHolder[1] = this.tile[1];
		
		if (sWalkable.length === 0){
			return;
		}
		else if (sWalkable.length === 1 || this.lastTile === null){
			this.tile = sWalkable[0];
		}
		else{
			do{
				this.tile = Random.choice(sWalkable);
			}
			while(this.tile[0] === this.lastTile[0] && this.tile[1] === this.lastTile[1]);
		}
		
		this.tileCentre = this.game.grid.tileToPxCoords(this.tile);
		this.tileCentre[0] += this.game.grid.tileSize[0] / 2;
		this.tileCentre[1] += this.game.grid.tileSize[1] / 2;
		
		this.lastTile = tileHolder;
	}
	
	this.AI = function(){
		if (Math.abs(this.centre[0] - this.tileCentre[0]) < this.minTileCentreDist && Math.abs(this.centre[1] - this.tileCentre[1]) < this.minTileCentreDist){
			this.pickNewTile();
		}
		
		this.velocity = this.centre.angleTo(this.tileCentre).mul(this.topSpeed * .8);
		
		if (this.centre.distanceTo(this.game.player.centre) < this.sightRadius){
			this.attack();
			this.chasingPlayer = true;
			
			this.velocity = this.centre.angleTo(this.game.player.centre).mul(this.topSpeed);
		}
		
		else if (this.chasingPlayer){
			this.chasingPlayer = false;
			
			this.setUpTiles();
			this.pickNewTile();
		}
	}
	
	this.onCollisionX = function(){
		this.setUpTiles();
		this.pickNewTile();
	}
	
	this.onCollisionY = function(){
		this.setUpTiles();
		this.pickNewTile();
	}
}

function Boss(game, pos){
	Enemy.call(this, game, pos, 300, "#009900", 0, 500, 21, 1);
	
	this.greetingSound = document.getElementById("boss_greeting");
	this.deathSound = document.getElementById("boss_parting");
	this.shootSound = document.getElementById("boss_shoot");
	
	this.playedGreeting = false;
	
	this.bulletSpeed = 400;
	
	var images = [this.game.bossSprites[0][0], this.game.bossSprites[1][0], this.game.bossSprites[2][0], this.game.bossSprites[3][0], this.game.bossSprites[4][0]];
	
	this.sprite = new Sprite(images, null, .4, true);
	
	this.AI = function(){
		this.attack();
	}
	
	this.enemyUpdate = function(){
		this.sprite.update();
		
		if (! this.playedGreeting){
			this.greetingSound.play();
			this.playedGreeting = true;
		}
	}
	
	this.draw = function(){
		if (this.dead){
			return;
		}
		
		this.sprite.draw(ctx, [this.centre[0] - 250, this.centre[1] - 250]);
	}
	
	this.die = function(){
		this.deathSound.play();
	}
	
	this.specificAttack = function(){
		this.shootSound.play();
		
		var angle = this.centre.angleTo(this.game.player.centre);
		
		this.game.attackAnimations.push(new Bullet(this.centre.copy(), angle.mul(this.bulletSpeed), "#800000", 6, this.strength, [this,]));
	}
}
