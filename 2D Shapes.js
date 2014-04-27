function Shape(){
	this.collide = function(other){
		if (other instanceof Circle)
			return this.collidecircle(other);
		else if (other instanceof Rect)
			return this.colliderect(other);
		else
			return this.collidepoint(other);
	}
}

function Rect(pos, size, colour){
	
	Shape.call(this);
	
	this.pos =  new Vector2(pos[0], pos[1]);
	this.size = new Vector2(size[0], size[1]);
	this.colour = colour;
	
	this.collideRect = function(other){
		if (this.pos[0] > (other.pos[0] + other.size[0]) || (this.pos[0] + this.size[0]) < other.pos[0]) return false;
		if (this.pos[1] > (other.pos[1] + other.size[1]) || (this.pos[1] + this.size[1]) < other.pos[1]) return false;
		return true;
	};
	
	this.collideCircle = function(circle){
		return circle.collideRect(this);
	};
	
	this.collidePoint = function(point){
		return (this.pos[0] < point[0] && point[0] < (this.pos[0] + this.size[0]) &&
			     this.pos[1] < point[1] && point[1] < (this.pos[1] + this.size[1]));
	};
	
	this.copy = function(){
		return new Rect(this.pos, this.size);
	};
	
	this.draw = function(ctx, width, colour){
		if (! width){
			ctx.fillStyle = colour ? colour : this.colour;
			ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
		}
		else{
			ctx.strokeStyle = colour ? colour : this.colour;
			ctx.lineWidth = width;
			ctx.strokeRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
		}
	};
}

function Circle(centre, radius, colour){
	
	Shape.call(this);
	
	this.centre = new Vector2(centre[0], centre[1]);
	this.radius = radius;
	this.colour = colour;
	
	this.collideRect = function(rect){
		// Find the closest point to the circle within the rectangle
        var closestX = clamp(this.centre[0], rect.pos[0], rect.pos[0] + rect.size[0]);
        var closestY = clamp(this.centre[1], rect.pos[1], rect.pos[1] + rect.size[1]);

        // Calculate the distance between the circle's center and this closest point
        var distanceX = this.centre[0] - closestX;
        var distanceY = this.centre[1] - closestY;
        
        // If the distance is less than the circle's radius, an intersection occurs
        var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (this.radius * this.radius);
	};
	
	this.collideCircle = function(other){
		var dx = (other.centre[0] - this.centre[0]);
		var dy = (other.centre[1] - this.centre[1]);
		var totalRadius = (this.radius + other.radius);
		
		return (dx * dx + dy * dy < totalRadius * totalRadius);
	};
	
	this.collidePoint = function(point){
		return self.centre.distanceTo(point) < self.radius;
	};
	
	this.copy = function(){
		return new Circle(this.centre, this.radius);
	};
	
	this.toRect = function(){
		return new Rect([this.centre[0] - this.radius, this.centre[1] - this.radius], [2 * this.radius, 2 * this.radius]);
	}
	
	this.draw = function(ctx, width, colour){
		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		
		if (! width){
			ctx.fillStyle = colour ? colour : this.colour;
			ctx.fill();
		}
		else{
			ctx.strokeStyle = colour ? colour : this.colour;
			ctx.lineWidth = width;
			ctx.stroke();
		}
	};
}
