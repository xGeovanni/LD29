function basicAttackAnimation(creature, target){
	this.creature = creature;
	this.angle = toRadians(this.creature.centre.angleTo(target)) + Math.PI * .5;
	
	this.time = .2;
	this.timeLeft = this.time;
	
	this.update = function(){
		this.timeLeft -= deltaTime;
	}
	
	this.draw = function(ctx){
		if (this.timeLeft < 0){
			return;
		}
		
		ctx.beginPath();
			
		ctx.arc(this.creature.centre[0], this.creature.centre[1], this.creature.radius + 5 , this.angle - Math.PI * .25, this.angle + Math.PI * .25);
			
		ctx.strokeStyle = "#A00000"
		ctx.lineWidth = 3.5;
		ctx.globalAlpha = (this.timeLeft / this.time)
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}

function ShotgunAttackAnimation(creature, target){
	this.creature = creature;
	this.angle = toRadians(this.creature.centre.angleTo(target)) + Math.PI * .5;
	
	this.time = .3;
	this.timeLeft = this.time;
	
	this.update = function(){
		this.timeLeft -= deltaTime;
	}
	
	this.draw = function(ctx){
		if (this.timeLeft < 0){
			return;
		}
		
		ctx.beginPath();
			
		ctx.arc(this.creature.centre[0], this.creature.centre[1], this.creature.radius + 56 , this.angle - Math.PI * .15, this.angle + Math.PI * .15);
			
		ctx.strokeStyle = "#A00000"
		ctx.lineWidth = 55;
		ctx.globalAlpha = (this.timeLeft / this.time)
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}

function Bullet(pos, velocity, colour, radius, damage, ignore){
	Circle.call(this, pos, radius, colour);
	
	this.velocity = velocity;
	this.damage = damage;
	this.ignore = ignore;
	
	this.impassableTiles = [0, 4];
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.centre.add(this.velocity.copy().mul(deltaTime));
		
		if (this.checkCollision()){
			this.dead = true;
		}
	}
	
	this.draw = function(){
		if (this.dead){
			return;
		}
		
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.fillStyle = this.colour;
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	
	this.checkCollision = function(){
		var rect = this.toRect();
		corners = [rect.pos, new Vector2(rect.pos[0] + rect.size[0], rect.pos[1]), new Vector2(rect.pos[0], rect.pos[1] + rect.size[1]), rect.pos.copy().add(rect.size)];
		
		for (var i=corners.length-1; i >= 0; i--){
			var tile = Game.grid.pxToTileCoords(corners[i]);
			
			if ((tile[0] < 0 || tile[1] < 0 ||tile[0] > Game.grid.size[0]-1 || tile[1] > Game.grid.size[1]-1)){
				return true;
			}
			
			if (this.impassableTiles.indexOf(Game.grid.tileTypes[tile[0]][tile[1]]) !== -1){
				return true;
			}
				
			for (var j=Game.creatures.length-1; j >= 0; j--){
				var creature = Game.creatures[j];
				
				if (creature.dead || this.ignore.indexOf(creature) !== -1){
					continue;
				}
				
				if (this.collideCircle(creature.hitCircle)){
					creature.damage(this.damage);
					return true;
				}
			}
		}
		
		return false;
	}
}

function BombAttackAnimation(pos, time, radius){
	Circle.call(this, pos, radius);
	
	this.time = time;
	this.damage = 150;
	
	this.dead = false;
		
	this.update = function(){
		if (this.dead){
			return;
		}
		
		if (this.time <= 0){
			this.dead = true;
			
			Game.attackAnimations.push(new Explosion(this.centre, this.radius));
			
			for (var j=Game.creatures.length-1; j >= 0; j--){
				var creature = Game.creatures[j];
				
				if (creature.dead){
					continue;
				}
				
				if (this.collideCircle(creature.hitCircle)){
					var damage = this.damage * (1 - (this.centre.distanceToSquared(creature.centre) / (this.radius * this.radius)));
					
					creature.damage(damage);
				}
			}
		}
		
		this.time -= deltaTime;
	}
	
	this.draw = function(ctx){
		if (this.dead){
			return;
		}
		
		ctx.drawImage(Bomb.image, this.centre[0] - 24, this.centre[1] - 24);
	}
}

function Explosion(pos, radius){
	this.sprite = new Sprite([Game.tileSet[0][5], Game.tileSet[1][5], Game.tileSet[2][5], Game.tileSet[3][5], Game.tileSet[4][5]], null, .1, true);
	
	Circle.call(this, pos, radius, "#A00000");
	this.time = this.sprite.interval * 9;
	
	this.dead = false;
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.time -= deltaTime;
		
		if (this.time <= 0){
			this.dead = true;
		}
		
		this.sprite.update();
	}
	
	this.draw = function(ctx){
		if (this.dead){
			return;
		}
		
		ctx.globalAlpha = 0.7 * (this.time / (this.sprite.interval * 9));
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
	
		ctx.fillStyle = this.colour;
		ctx.fill();
		ctx.globalAlpha = 1;
		
		this.sprite.draw(ctx, [this.centre[0] - 24, this.centre[1] - 24]);
	}
}
