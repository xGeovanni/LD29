function Player(game){
	Circle.call(this, [canvas.width / 2, canvas.height / 2], 15, "#EFBD94");
	
	this.game = game;
	
	this.veloctiy = new Vector2(0, 0);
	this.topSpeed = 150;
	this.mouseDistScaleFactor = .8;
	
	this.update = function(deltaTime){
		var speed = Math.min(this.centre.distanceTo(mousePos) * this.mouseDistScaleFactor, this.topSpeed);
		this.velocity = this.centre.angleTo(mousePos).mul(speed);
		
		this.game.pan(this.velocity.copy().mul(deltaTime * -1));
	};
	
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.fillStyle = this.colour;
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}
}
