function Creature(game, pos, radius, colour, topSpeed, maxHealth, attackCooldown){
	Circle.call(this, pos, radius, colour);
	
	this.game = game;
	this.game.creatures.push(this);
	
	this.dead = false;
	
	this.veloctiy = new Vector2(0, 0);
	this.topSpeed = topSpeed;
	
	this.hitCircle = this.copy();
	this.hitCircle.radius = Math.floor(this.radius * .8);
	
	this.attackCooldown = attackCooldown;
	this.timeUntilAttack = 0;
	
	this.maxHealth = maxHealth;
	this.health = this.maxHealth;
	
	this.impassableTiles = [0,];
	
	this.specificUpdate = function(){
	}
	this.specificAttack = function(){
	}
	
	this.attack = function(){
		if (this.dead){
			return;
		}
		
		if (this.timeUntilAttack <= 0){
			this.specificAttack();
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
		
		this.game.pan(delta.mul(-1));
		
		this.timeUntilAttack -= deltaTime;
	};
	
	this.checkMove = function(delta){
		var canMove = [1, 1];
		
		var testX = this.hitCircle.toRect();
		var testY = this.hitCircle.toRect();
		
		testX.pos.add(delta);
		testY.pos.add(delta);
		
		if (this.checkCollision(testX)){
			canMove[0] = 0;
		}
		if (this.checkCollision(testY)){
			canMove[1] = 0;
		}
		
		return canMove;
	}
	
	this.checkCollision = function(rect){
		corners = [rect.pos, new Vector2(rect.pos[0] + rect.size[0], rect.pos[1]), new Vector2(rect.pos[0], rect.pos[1] + rect.size[1]), rect.pos.copy().add(rect.size)];
		
		for (var i=corners.length-1; i >= 0; i--){
			var tile = this.game.grid.pxToTileCoords(corners[i]);
			
			if (tile[0] < 0 || tile[1] < 0 ||tile[0] > this.game.grid.size[0]-1 || tile[1] > this.game.grid.size[1]-1){
				return true;
			}
			
			if (this.impassableTiles.indexOf(this.game.grid.tileTypes[tile[0]][tile[1]]) !== -1){
				return true;
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
