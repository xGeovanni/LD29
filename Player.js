function Player(game){
	Creature.call(this, game, [canvas.width / 2, canvas.height / 2], 14, "#EFBD94", 180, 100, 20, .05);
	
	this.mouseDistScaleFactor = .8;
	this.healthRegenPerSecond = .8;
	
	this.timeSinceDamage = 0;
	
	this.weapon = null;
	
	this.weaponPickupCooldown = .5;
	this.weaponPickupCooldownRemaining = 0;
	
	this.createHealthBars = function(){
		this.healthBar = new Rect([0, canvas.height * .95], [canvas.width * .4, canvas.height * .05]);
		this.redBar = this.healthBar.copy();
		this.redBar.colour = "#FF0000";
		this.greenBar = this.healthBar.copy();
		this.greenBar.colour = "#00FF00";
		
		this.weaponDisplay = new Rect([0, canvas.height * .95 - 52], [52, 52], "#72B6FF");
		this.weaponCooldownDisplay = new Rect([2, canvas.height * .95 - 50], [48, 48], "#C00000");
	}
	
	this.damage = function(amt){
		this.health -= amt;
		this.timeSinceDamage = 0;
		
		if (this.health <= 0){
			this.dead = true;
			this.die();
		}
	}
	
	this.createHealthBars();
	
	this.specificUpdate = function(){
		var speed = Math.min(this.centre.distanceTo(mousePos) * this.mouseDistScaleFactor, this.topSpeed);
		this.velocity = this.centre.angleTo(mousePos).mul(speed);
		
		this.timeSinceDamage += deltaTime;
		this.weaponPickupCooldownRemaining -= deltaTime;
		
		if (Key.isDown(Key.ALT) || Key.isDown(Key.R)){
			if (this.checkCollision(this.hitCircle, false, false, [2,])){
				this.game.floor++;
				this.game.newFloor();
			}
			
			this.pickUpWeapon();
		}
		
		this.health = Math.min(this.maxHealth, this.health + this.healthRegenPerSecond * deltaTime * (this.timeSinceDamage / 30));
	};
	
	this.drawHUD = function(){
		var ratio = this.health / this.maxHealth;
		
		this.redBar.pos[0] = this.healthBar.pos[0] + this.healthBar.size[0] * ratio;
		this.redBar.size[0] = this.healthBar.size[0] - this.healthBar.size[0] * ratio;
		this.greenBar.size[0] = this.healthBar.size[0] * ratio;
		
		ctx.globalAlpha = 0.5;
		if (ratio < 1){
			this.redBar.draw(ctx);
		}
		this.greenBar.draw(ctx);
		
		this.weaponDisplay.draw(ctx);
		ctx.globalAlpha = 1;
		
		this.weaponDisplay.draw(ctx, 3, "#1E8BFF");
		
		if (this.weapon !== null){
			ctx.drawImage(this.weapon.image, this.weaponDisplay.pos[0] + 3, this.weaponDisplay.pos[1] + 3);
		
			
			var cooldownRatio = this.weapon.cooldownRemaining / this.weapon.cooldown;
			
			if (cooldownRatio > 0){
				ctx.globalAlpha = 0.7 * cooldownRatio;
				this.weaponCooldownDisplay.draw(ctx);
				ctx.globalAlpha = 1;
			}
		}
	};
	
	this.pickUpWeapon = function(){
		if (this.weaponPickupCooldownRemaining > 0){
			return;
		}
		
		this.weaponPickupCooldownRemaining = this.weaponPickupCooldown;
		
		for (var i=this.game.weaponPickups.length-1; i >= 0; i--){
			if (this.game.weaponPickups[i].dead){
				continue;
			}
			
			if (this.game.weaponPickups[i].collideCircle(this)){
				if (this.weapon != null){
					this.game.weaponPickups.push(new WeaponPickup(this.centre.copy(), this.weapon.constructor));
				}
				
				this.weapon = new this.game.weaponPickups[i].weaponClass(this.game);
				this.game.weaponPickups[i].dead = true;
				
				break;
			}
		}
	}
	
	this.specificAttack = function(){
		this.basicAttack(mousePos);
		var chestTile = this.checkCollision(this, false, false, [4,]);
		
		if (chestTile !== false){
			this.game.grid.tileTypes[chestTile[0]][chestTile[1]] = 1;
			
			this.game.weaponPickups.push(new WeaponPickup(this.game.grid.tileToPxCoords(chestTile)));
		}
	}
	
	this.move = function(delta){
		this.game.pan(delta.mul(-1));
	};
	
	this.draw = function(ctx){
		if (this.dead){
			return;
		}
		
		if (this.weapon instanceof Raft){
			if (this.checkCollision(this.hitCircle, false, false, [3,])){
				drawRotatedImage(Raft.image, this.centre, Math.abs(this.velocity[1]) > Math.abs(this.velocity[0]) ? 0 : Math.PI * .5);
			}
		}
		
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.fillStyle = this.colour;
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		ctx.stroke();
	}
}
