function Creature(game, pos, radius, colour, topSpeed, maxHealth, strength, attackCooldown){
	Circle.call(this, pos, radius, colour);
	
	this.game = game;
	this.game.creatures.push(this);
	
	this.dead = false;
	
	this.velocity = new Vector2(0, 0);
	this.topSpeed = topSpeed;
	
	this.hitCircle = this.copy();
	this.hitCircle.radius = Math.floor(this.radius * .8);
	
	this.strength = strength;
	this.attackCooldown = attackCooldown;
	this.timeUntilAttack = 0;
	
	this.maxHealth = maxHealth;
	this.health = this.maxHealth;
	
	this.impassableTiles = [0, 3, 4, 5, 6];
	
	this.specificUpdate = function(){
	}
	this.specificAttack = function(){
	}
	this.onCollisionX = function(hit){
	}
	this.onCollisionY = function(hit){
	}
	this.die = function(){
	}
	
	this.damage = function(amt, textPos){
		this.health -= amt;
		
		if (this.health <= 0){
			this.dead = true;
			this.die();
		}
		
		this.game.attackAnimations.push(new damageText(textPos, amt));
	}
	
	this.attack = function(){
		if (this.dead){
			return;
		}
		
		if (this.timeUntilAttack <= 0){
			this.specificAttack();
			this.timeUntilAttack = this.attackCooldown;
		}
	}
	
	this.basicAttack = function(target){
		this.game.attackAnimations.push(new basicAttackAnimation(this, target));
		
		var angle = this.centre.angleTo(target);
		var point = this.centre.copy().add(angle.mul(this.radius * 1.5));
		var circle = new Circle(point, this.radius *.49);
		
		for (var j=this.game.creatures.length-1; j >= 0; j--){
			var creature = this.game.creatures[j];
			
			if (creature === this || creature.dead){
				continue;
			}
			
			if (circle.collideCircle(creature)){
				creature.damage(this.strength, circle.centre);
			}
		}
	}
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.specificUpdate();
		
		var delta = this.velocity.copy().mul(deltaTime);
		var canMove = this.checkMove(delta);
		
		delta[0] *= canMove[0];
		delta[1] *= canMove[1];
		
		this.move(delta);
		
		this.timeUntilAttack -= deltaTime;
	};
	
	this.move = function(delta){
		this.centre.add(delta);
		this.hitCircle.centre.add(delta);
	}
	
	this.checkMove = function(delta){
		var canMove = [1, 1];
		
		var testX = this.hitCircle.copy();
		var testY = this.hitCircle.copy();
		
		testX.centre.add(delta);
		testY.centre.add(delta);
		
		var impassableTiles = this.impassableTiles.slice(0);
		if (this === this.game.player && this.weapon instanceof Raft && impassableTiles.indexOf(3) !== -1){
			impassableTiles[impassableTiles.indexOf(3)] = null;
		}
		
		var hit = [this.checkCollision(testX, true, true, impassableTiles), this.checkCollision(testY, true, true, impassableTiles)]
		
		if (hit[0]){
			canMove[0] = 0;
			this.onCollisionX(hit[0]);
		}
		if (hit[1]){
			canMove[1] = 0;
			this.onCollisionY(hit[1]);
		}
		
		return canMove;
	}
	
	this.checkCollision = function(circle, bordersTrue, creaturesTrue, tiles){
		var rect = circle.toRect();
		var tiles = (tiles !== undefined ? tiles : this.impassableTiles);
		
		corners = [rect.pos, new Vector2(rect.pos[0] + rect.size[0], rect.pos[1]), new Vector2(rect.pos[0], rect.pos[1] + rect.size[1]), rect.pos.copy().add(rect.size)];
		
		for (var i=corners.length-1; i >= 0; i--){
			var tile = this.game.grid.pxToTileCoords(corners[i]);
			
			if (bordersTrue && (tile[0] < 0 || tile[1] < 0 ||tile[0] > this.game.grid.size[0]-1 || tile[1] > this.game.grid.size[1]-1)){
				return true;
			}
			
			if (tiles.indexOf(this.game.grid.tileTypes[tile[0]][tile[1]]) !== -1){
				return tile;
			}
			
			if (creaturesTrue){
				
				for (var j=this.game.creatures.length-1; j >= 0; j--){
					var creature = this.game.creatures[j];
					
					if (creature === this || creature.dead){
						continue;
					}
					
					if (circle.collideCircle(creature.hitCircle)){
						return creature;
					}
				}
			}
		}
		
		return false;
	}
	
	this.draw = function(ctx){
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
		ctx.lineWidth = 2;
		ctx.stroke();
	}
}
