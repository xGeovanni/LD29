function basicAttackAnimation(creature){
	this.creature = creature;
	this.angle = toRadians(this.creature.centre.angleTo(mousePos)) + Math.PI * .5;
	
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
			
		ctx.arc(this.creature.centre[0], this.creature.centre[1], this.creature.radius + 4 , this.angle - Math.PI * .25, this.angle + Math.PI * .25);
			
		ctx.strokeStyle = "#A00000"
		ctx.lineWidth = 3;
		ctx.globalAlpha = (this.timeLeft / this.time)
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}
