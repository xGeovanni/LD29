function Player(game){
	Creature.call(this, game, [canvas.width / 2, canvas.height / 2], 14, "#EFBD94", 180, 100, .05);
	
	this.mouseDistScaleFactor = .8;
	
	this.specificUpdate = function(deltaTime){
		var speed = Math.min(this.centre.distanceTo(mousePos) * this.mouseDistScaleFactor, this.topSpeed);
		this.velocity = this.centre.angleTo(mousePos).mul(speed);
	};
	
	this.specificAttack = function(){
		this.game.attackAnimations.push(new basicAttackAnimation(this));
	}
}
