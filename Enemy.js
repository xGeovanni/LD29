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
	Enemy.call(this, game, pos, 14, "#6D7F00", 150, 60, 10, .4);
	
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
