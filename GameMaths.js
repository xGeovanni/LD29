function degrees(rads){
	return rads * (180 / Math.PI);
}

function radians(degs){
	return degs * (Math.PI / 180);
}

function fromRadians(rads){
	return new Vector2(-Math.cos(rads), Math.sin(rads));
}

function toRadians(vector){
    return Math.atan2(vector[0], vector[1]);
}
    
function fromDegrees(degs){
    return fromRadians(radians(degs));
}
    
function toDegrees(vector){
    return degrees(toRadians(vector));
}

function clamp(i, min, max){
	return Math.min(Math.max(i, min), max);
}

Vector2.UP    = new Vector2(0, -1);
Vector2.RIGHT = new Vector2(1,  0);
Vector2.ZERO  = new Vector2(0,  0);

function Vector2(x, y){
	Array.call(this);
	
	this[0] = x;
	this[1] = y;
	
	this.__defineGetter__("x", function(){
        return this[0];
    });
   
    this.__defineSetter__("x", function(val){
        this[0] = val;
    });
    
    this.__defineGetter__("y", function(){
        return this[1];
    });
   
    this.__defineSetter__("y", function(val){
        this[1] = val;
    });
    
    this.add = function(other){
		this[0] += other[0];
		this[1] += other[1];
        
        return this;
	};
	
	this.sub = function(other){
		this[0] -= other[0];
		this[1] -= other[1];
        
        return this;
	};
	
	this.mul = function(other){
		if (typeof other === "number"){
			this[0] *= other;
			this[1] *= other;
		}
		else if (other instanceof Vector2){
			this[0] *= other[0];
			this[1] *= other[1];
		}
        else if (other instanceof Matrix){
            if (other.width != 2){
                throw "Error: Matrix must be of width 2.";
            }
            
            var thisMatrix = this.toMatrix();
            thisMatrix.mul(other);
            
			this[0] = thisMatrix[0][0];
			this[1] = thisMatrix[1][0];
		}
        else{
            throw "Error: can only multiply Vector2 by scalar, Vector2 or Matrix";
        }
        
        return this;
	};
	
	this.div = function(other){
		if (typeof other === "number"){
			this[0] /= other;
			this[1] /= other;
		}
		else{
			this[0] /= other[0];
			this[1] /= other[1];
		}
        
        return this;
	};
	
	this.equals = function(other){
		return this[0] == other[0] && this[1] == other[1];
	}
	
	this.magnitude = function(){
		return Math.sqrt(this.magnitudeSquared());
	};
	
	this.magnitudeSquared = function(){
		return this[0] * this[0] + this[1] * this[1];
	};
	
	this.normalise = function(){
		var m = this.magnitude();
		
		if (m == 0){
			return;
		}
		
		this[0] /= m;
		this[1] /= m;
        
        return this;
	};
	
	this.angleTo = function(other){
		var dx = other[0] - this[0];
		var dy = other[1] - this[1];
	
		return Vector2(dy, dx).normalise();
	};
	
	this.distanceTo = function(other){
		var dx = other[0] - this[0];
		var dy = other[1] - this[1];
	
		return Math.sqrt(Math.abs(dx*dx + dy*dy));
	};
	
	this.dot = function(other){
		return (this[0] * other[0] + this[1] * other[1]);
	};
	
	this.cross = function(other){
		return (this[0] * other[1] - this[1] * other[0]);
	};
	
	this.scale = function(magnitude){
		var ratio = magnitude / this.magnitude();
		
		this.mul(ratio);
        
        return this;
	};
	
	this.lerp = function(other, t){
		this[0] += other[0] * t;
		this[1] += other[1] * t;
        
        return this;
	};
	
	this.rotate = function(rads){
		var sin = Math.sin(rads);
		var cos = Math.cos(rads);
		
		var x = this[0];
		
		this[0] = x * cos - this[1] * sin;
		this[1] = x * sin + this[1] * cos;
        
        return this;
	};
    
    this.toArray = function(){
        return [this[0], this[1]];
    }
    
    this.toMatrix = function(){
        return (new Matrix(this.toArray())).transpose();
    }
	
	this.copy = function(){
		return new Vector2(this[0], this[1]);
	};
}

Vector3.UP      = new Vector3(0, -1, 0);
Vector3.RIGHT   = new Vector3(1, 0, 0);
Vector3.FORWARD = new Vector3(0, 0, 1);
Vector3.ZERO    = new Vector3(0, 0, 0);

function Vector3(x, y, z){
	Array.call(this);
	
	this[0] = x;
	this[1] = y;
    this[2] = z
	
	this.__defineGetter__("x", function(){
        return this[0];
    });
   
    this.__defineSetter__("x", function(val){
        this[0] = val;
    });
    
    this.__defineGetter__("y", function(){
        return this[1];
    });
   
    this.__defineSetter__("y", function(val){
        this[1] = val;
    });
    
    this.__defineGetter__("z", function(){
        return this[2];
    });
   
    this.__defineSetter__("z", function(val){
        this[2] = val;
    });
    
    this.add = function(other){
		this[0] += other[0];
		this[1] += other[1];
		this[2] += other[2];
        
        return this;
	};
	
	this.sub = function(other){
		this[0] -= other[0];
		this[1] -= other[1];
		this[2] -= other[2];
        
        return this;
	};
	
	this.mul = function(other){
		if (typeof other === "number"){
			this[0] *= other;
			this[1] *= other;
			this[2] *= other;
		}
		else if (other instanceof Vector3){
			this[0] *= other[0];
			this[1] *= other[1];
			this[2] *= other[2];
		}
        else if (other instanceof Matrix){
            var result = other.copy().mul(this);
            
            this[0] = result[0][0];
            this[1] = result[1][0];
            this[2] = result[2][0];
		}
        else{
            throw "Error: can only multiply Vector3 by scalar, Vector3 or Matrix";
        }
        
        return this;
	};
	
	this.div = function(other){
		if (typeof other === "number"){
			this[0] /= other;
			this[1] /= other;
			this[2] /= other;
		}
		else{
			this[0] /= other[0];
			this[1] /= other[1];
			this[2] /= other[2];
		}
        
        return this;
	};
	
	this.equals = function(other){
		return this[0] == other[0] && this[1] == other[1] && this[2] == other[2];
	}
	
	this.magnitude = function(){
		return Math.sqrt(this.magnitudeSquared());
	};
	
	this.magnitudeSquared = function(){
		return this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
	};
	
	this.normalise = function(){
		var m = this.magnitude();
		
		if (m == 0){
			return;
		}
		
		this[0] /= m;
		this[1] /= m;
		this[2] /= m;
        
        return this;
	};
	
	this.angleTo = function(other){
		var dx = other[0] - this[0];
		var dy = other[1] - this[1];
		var dz = other[2] - this[2];
	
		return Vector3(dx, dy, dz).normalise();
	};
	
	this.distanceTo = function(other){
		var dx = other[0] - this[0];
		var dy = other[1] - this[1];
		var dz = other[2] - this[2];
	
		return Math.sqrt(Math.abs(dx*dx + dy*dy + dz*dz));
	};
	
	this.dot = function(other){
		return (this[0] * other[0] + this[1] * other[1] + this[2] * other[2]);
	};
	
	this.cross = function(other){
		return Vector3(this[1] * other[2] - other[2] * this[1],
                        this[2] * other[0] - other[0] * this[2],
                        this[1] * other[0] - other[0] * this[1]);
	};
	
	this.scale = function(magnitude){
		var ratio = magnitude / this.magnitude();
		
		this.mul(ratio);
        
        return this;
	};
	
	this.lerp = function(other, t){
		this[0] += other[0] * t;
		this[1] += other[1] * t;
		this[2] += other[2] * t;
        
        return this;
	};
	
	this.rotate = function(yaw, pitch, roll){
        var rotationMatrix;
        
        if (typeof pitch === "object"){
            rotationMatrix = pitch.copy();
        }
        else{
            rotationMatrix = Matrix.rotationMatrix(yaw, pitch, roll);
        }
        
        this.mul(rotationMatrix);
        
        return this;
	};
    
    this.toArray = function(){
        return [this[0], this[1], this[2]];
    }
    
    this.toMatrix = function(){
        return (new Matrix([this[0]], [this[1]], [this[2]])).transpose();
    }
    
    this.to4x1Matrix = function(){
        return (new Matrix([this[0]], [this[1]], [this[2]], [0])).transpose();
    }
	
	this.copy = function(){
		return new Vector3(this[0], this[1], this[2]);
	};
}

Vector3.fromMatrix = function(matrix){
    if (matrix.length != 3){
        throw "Error: Matrix must be of length 3.";
    }
    
    return new Vector3(matrix[0][0], matrix[1][0], matrix[2][0]);
}

function Matrix(){
    Array.call(this);
    
    this.length = arguments.length;
    
    for (var i=0; i < arguments.length; i++){
        this[i] = arguments[i]
    }
    
    if(this.length == 0){
        this.width = 0;
    }
    else{
        this.width = this[0].length;
    }
    
    this.toArray = function(){
        var a = [];
        
        for (var i=0; i < this.length; i++){
            a.push(this[i].slice(0));
        }
        
        return a;
    }
    
    this.add = function(other){
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                this[i][j] += other[i][j];
            }
        }
        
        return this;
    }
    
    this.sub = function(other){
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                this[i][j] -= other[i][j];
            }
        }
        
        return this;
    }
    
    this.mul = function(other){
        if (typeof other === "number"){
			this.mulScalar(other);
		}
		else if (other instanceof Matrix){
            this.dot(other);
		}
		else if (other instanceof Vector2){
            if (! (this.width == 2)){
                throw "Error: Can only multiply matrix of width 2 by Vector2.";
            }
            
            this.dot(other.toMatrix());
		}
        else if (other instanceof Vector3){
            if (! (this.width == 3 || this.width == 4)){
                throw "Error: Can only multiply matrix of width 3 or 4 by Vector3.";
            }
            
            if (this.width == 3){
                this.dot(other.toMatrix());
            }
            
            else if (this.width == 4){
                this.dot(other.to4x1Matrix());
            }
        }
        
        return this; 
    }
    
    this.div = function(other){
        if (typeof other === "number"){
			this.divScalar(other);
		}
		else{
            this.dot(other.copy().invert());
		}
        return this; 
    }
    
    this.equals = function(other){
        if (this.length != other.length){
            return false;
        }
        
        if (this[0].length != other[0].length){
            return false;
        }
        
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                if (this[i][j] != other[i][j]){
                    return false;
                }
            }
        }
        
        return true;
    }
    
    this.elementMul = function(other){
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                this[i][j] *= other[i][j];
            }
        }
        
        return this;
    }
    
    this.dot = function(other){
        if (this.width != other.length) {
            throw "error: incompatible sizes";
        }
     
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result[i] = [];
            for (var j = 0; j < other.width; j++) {
                var sum = 0;
                for (var k = 0; k < this.width; k++) {
                    sum += this[i][k] * other[k][j];
                }
                result[i][j] = sum;
            }
        }
        
        for (var i=0; i < this.length; i++){
            this[i] = result[i];
        }
        
        return this;
    }
    
    this.mulScalar = function(scalar){
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                this[i][j] *= scalar;
            }
        }
        
        return this;
    }
    
    this.divScalar = function(scalar){
        for (var i=0; i < this.length; i++){
            for (var j=0; j < this[i].length; j++){
                this[i][j] /= scalar;
            }
        }
        
        return this;
    }
    
    this.transpose = function(){
        if(this.length === 0 || this[0].length === 0) { return []; }
        
        var i, j, t = [];

        for(i=0; i < this[0].length; i++) {

            t[i] = [];
            
            for(j=0; j < this.length; j++) {
                t[i][j] = this[j][i];
            }
        }
        
        for (var i=0; i < t.length; i++){
            this[i] = t[i];
        }
        
        return this;
    }
    
    this.invert = function(){
        // Nope. Too Hard.
        
        return this;
    }
    
    this.toString = function(){
        var s = "";
        
        for (var i=0; i < this.length; i++){
            for(var j=0; j < this.width; j++){
                s += this[i][j] + " ";
            }
            
            s += "\n";
        }
        
        return s;
    }
    
    this.copy = function(){
        var copy = new Matrix();
        Matrix.apply(copy, this.toArray());
        return copy;
    }
}

Matrix.zero = function(length, width){
    zeros = [];
    
    for (var i=0; i < length; i++){
        zeros.push([]);
        for (var j=0; j < width; j++){
            zeros[i].push(0);
        }
    }
    
    var m = new Matrix();
    Matrix.apply(m, zeros);
    return m;
}

Matrix.identity = function(n){
    var identity = Matrix.zero(n, n);
    
    for (var i=0; i < n; i++){
        identity[i][i] = 1;
    }
    
    return identity;
}

Matrix.rotationMatrixX = function(theta){
    sin = Math.sin(theta);
    cos = Math.cos(theta);
    
    return new Matrix([1, 0, 0],
                      [0, cos, -sin],
                      [0, sin, cos]);
}
Matrix.rotationMatrixY = function(theta){
    sin = Math.sin(theta);
    cos = Math.cos(theta);
    
    return new Matrix([cos, 0, sin],
                      [0, 1, 0],
                      [-sin, 0, cos]);
}
Matrix.rotationMatrixZ = function(theta){
    sin = Math.sin(theta);
    cos = Math.cos(theta);
    
    return new Matrix([cos, -sin, 0],
                      [sin, cos, 0],
                      [0, 0, 1]);
}

Matrix.rotationMatrix = function(yaw, pitch, roll){
    var x = Matrix.rotationMatrixX(roll);
    var y = Matrix.rotationMatrixY(pitch);
    var z = Matrix.rotationMatrixZ(yaw);
    
    return x.mul(y).mul(z);
}
