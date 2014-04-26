var SCREENSIZE;

function init3D(canvas, ctx){
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    SCREENSIZE = new Vector2(canvas.width, canvas.height);
    Camera.orthographicMatrix = Camera.calcProjectionMatrix(SCREENSIZE.x, SCREENSIZE.y);
}

var Camera = {
    pos : new Vector3(0, 0, -100),
    rotation : new Vector3(0, 0, 0), //Radians
    
    nearClipping : 0,
    farClipping : 1000,
    layerMask : null,
    
    mode : "perspective",
    
    objects : [],
    
    render : function(ctx){
        
        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        
        for (var i=0; i < this.objects.length; i++){
            var obj = this.objects[i];
            
            obj.draw(ctx, this);
        }
    },
    
    calcProjectionMatrix : function(width, height){
        return new Matrix([2 / width, 0, 0, 0],
                          [0, 2 / height, 0, 0],
                          [0, 0, -2 / (this.farClipping - this.nearClipping), -((this.farClipping + this.nearClipping) / (this.farClipping - this.nearClipping))],
                          [0, 0, 0, 1]);
    },
    
    projectNodes : function(nodes){
        var projected = [];
        var node;
        
        for (var i=0; i < nodes.length; i++){
            node = nodes[i].copy();  
                
            if (this.mode === "perspective"){
                projected.push(this.perspectiveProject(node));
            }
            
            else if (this.mode === "orthographic"){
                var m = node.copy().mul(this.orthographicMatrix);
                
                projected.push(new Vector2(m.x * (SCREENSIZE.x / 2), m.y * (SCREENSIZE.y / 2)));
            }
        }
        
        return projected;
    },
    
    perspectiveProject : function(node){
        var relative = node.copy().sub(this.pos);
        
        if ((relative.z) < this.nearClipping || (relative.z) > this.farClipping){
            return null;
        }
        
        var e = new Vector3(0, 0, -100);
        var d = new Vector3(0, 0, 0);
        
        var x = (node.x - this.pos.x);
        var y = (node.y - this.pos.y);
        var z = (node.z - this.pos.z);
        
        var x_sin = Math.sin(this.rotation.x);
        var y_sin = Math.sin(this.rotation.y);
        var z_sin = Math.sin(this.rotation.z);
        
        var x_cos = Math.cos(this.rotation.x);
        var y_cos = Math.cos(this.rotation.y);
        var z_cos = Math.cos(this.rotation.z);
        
        d.x = y_cos * (z_sin * y + z_cos * x) - y_sin * z;
        d.y = x_sin * (y_cos * z + y_sin * (z_sin * y + z_cos * x)) + x_cos * (z_cos * y - z_sin * x);
        d.z = x_cos * (y_cos * z + y_sin * (z_sin * y + z_cos * x)) - x_sin * (z_cos * y - z_sin * x);
        
        return new Vector2((e.z / d.z) * d.x - e.x, (e.z / d.z) * d.y - e.y);
    }
}

function Shape(pos, nodes, edges, colour, layer){
    Camera.objects.push(this);
    
    this.nodes = nodes;
    this.edges = edges;
    this.colour = colour ? colour : "#000000";
    this.layer = layer ? layer : 1;
    
    this.pos = pos;
    
    this.drawEdges = true;
    this.drawNodes = true;
    
    this.centre = function(){
        var total_x = 0;
        var total_y = 0;
        var total_z = 0;
        
        for (i in this.nodes){
            total_x += this.nodes[i].x;
            total_y += this.nodes[i].y;
            total_z += this.nodes[i].z;
        }
        
        return new Vector3(total_x / this.nodes.length, total_y / this.nodes.length, total_z / this.nodes.length);
    }
    
    this.translate = function(vector){
        for (i in this.nodes){
            this.nodes[i].add(vector);
        }
    }
    
    this.scale = function(scale, centre){
        centre = centre ? centre : this.centre();
        
        for (i in this.nodes){
            this.nodes[i].x = centre.x + scale * (this.nodes[i].x - centre.x);
            this.nodes[i].y = centre.y + scale * (this.nodes[i].y - centre.y);
            this.nodes[i].z = centre.z + scale * (this.nodes[i].z - centre.z);
        }
    }
    
    this.rotate = function(theta, axis){
        ctx.save();
        ctx.translate(SCREENSIZE.x - this.pos.x, SCREENSIZE.y - this.pos.y);
        
        var sin_t = Math.sin(theta);
        var cos_t = Math.cos(theta);
        
        var j = (axis + 1) % 3;
        var k = (axis + 2) % 3;
        
        for (var n=0; n<this.nodes.length; n++) {
            var node = this.nodes[n];
            var y = node[j];
            var z = node[k];
            node[j] = y * cos_t - z * sin_t;
            node[k] = z * cos_t + y * sin_t;
        }
        
        ctx.restore();
    }
    
    this.matrixTransform = function(matrix){
        for (i in this.nodes){
            this.nodes[i].mul(matrix);
        }
    }
    
    this.draw = function(ctx, camera){
        
        var projectedNodes = camera.projectNodes(this.nodes);
        
        var start;
        var end;
        
        ctx.strokeStyle = this.colour;
        ctx.fillStyle = this.colour;
        
        if (this.drawEdges){
            for (i in this.edges){
                start = projectedNodes[this.edges[i][0]];
                end   = projectedNodes[this.edges[i][1]];
                
                if (! start || ! end){
                    continue;
                }
                
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }
        }
        
        if (this.drawNodes){
            for (i in projectedNodes){
                
                if (! projectedNodes[i]){
                    continue;
                }
                
                ctx.beginPath();
                ctx.arc(projectedNodes[i].x, projectedNodes[i].y, 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

function Cuboid(pos, size){
    pos = pos;
    this.size = size;
    
    var nodes = [];
    nodes.push(pos.copy().sub(this.size).div(2));
    nodes.push(pos.copy().add([this.size[0] / 2, -this.size[1] / 2, -this.size[2] / 2]));
    nodes.push(pos.copy().add([-this.size[0] / 2, this.size[1] / 2, -this.size[2] / 2]));
    nodes.push(pos.copy().add([-this.size[0] / 2, -this.size[1] / 2, this.size[2] / 2]));
    nodes.push(pos.copy().add([this.size[0] / 2, this.size[1] / 2, -this.size[2] / 2]));
    nodes.push(pos.copy().add([-this.size[0] / 2, this.size[1] / 2, this.size[2] / 2]));
    nodes.push(pos.copy().add([this.size[0] / 2, -this.size[1] / 2, this.size[2] / 2]));
    nodes.push(pos.copy().add(this.size).div(2));
    
    var edges = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 6], [2, 4], [2, 5], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
    
    Shape.call(this, pos, nodes, edges);
}
