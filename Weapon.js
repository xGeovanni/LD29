function Weapon(game, cooldown, image, instructions){
	this.game = game;
	this.cooldown = cooldown;
	this.cooldownRemaining = 0;
	this.image = image;
	this.instructions = instructions;
	
	this.specificUse = function(){
		
	}
	
	this.specificUpdate = function(){
		
	}
	
	this.use = function(){
		if (this.cooldownRemaining <= 0){
			this.specificUse();
			this.cooldownRemaining = this.cooldown;
		}
	}
	
	this.update = function(){
		this.cooldownRemaining -= deltaTime;
		
		this.specificUpdate();
	}
	
	this.displayInstructions = function(){
		ctx.font = "36pt Verdana";
		
		var pos = [0, canvas.height * .2];
		
		for (var i=0; i < instructions.length; i++){
			canvas.fillText(instructions[i], pos[0], pos[1]);
			pos[1] += 36;
		}
	}
}

function WeaponPickup(pos, weaponClass, noRaft){
	var weapons = [Blaster, SoulGun, ShotGun, Bomb];
	if (! noRaft){
		weapons.push(Raft);
	}
	
	this.weaponClass = weaponClass !== undefined ? weaponClass : Random.choice(weapons);
	
	Circle.call(this, [pos[0] + 24, pos[1] + 24], 20);
	
	this.timeMoving = 1;
	this.timeLeft = this.timeMoving;
	this.speed = 80;
	this.velocity = GameRandom.normalVector2().mul(this.speed);
	
	this.instructionTime = 8;
	this.instructionTimeRemaining = this.instructionTime;
	
	this.update = function(){
		if (this.dead){
			this.instructionTimeRemaining -= deltaTime;
			
			return;
		}
		
		if (this.timeLeft > 0){
			this.centre.add(this.velocity.copy().mul(this.timeLeft / this.timeMoving * deltaTime));
			
			this.timeLeft -= deltaTime;
		}
	}
	
	this.draw = function(ctx){
		if (this.dead){
			if (this.instructionTimeRemaining > 0){
				this.drawInstructions();
			}
			
			return;
		}
		
		ctx.drawImage(this.weaponClass.image, this.centre[0], this.centre[1]);
	}
	
	this.drawInstructions = function(){
		var size = 32;
		
		ctx.font = size + "pt Verdana";
		
		var pos = [0, 32];
		
		ctx.fillStyle = "#E8FFD8";
		ctx.globalAlpha = (this.instructionTimeRemaining / this.instructionTime);
		
		for (var i=0; i < this.weaponClass.instructions.length; i++){
			ctx.fillText(this.weaponClass.instructions[i], pos[0], pos[1]);
			pos[1] += size;
		}
		
		ctx.globalAlpha = 1;
	}
}

Blaster.instructions = ["Blaster:", "WASD To fire"];
function Blaster(game){
	Weapon.call(this, game, .6, Blaster.image, Blaster.instructions);
	
	this.shootSound = document.getElementById("shoot");
	
	this.bulletSpeed = 400;
	this.bulletDamage = 20;
	
	this.fireDir = Vector2.UP;
	
	this.specificUse = function(){
		this.shootSound.play();
		
		this.game.attackAnimations.push(new Bullet(this.game.player.centre.copy(), this.fireDir.copy().mul(this.bulletSpeed),
												   "#A00000", 3, this.bulletDamage, [this.game.player,]));
	}
	
	this.specificUpdate = function(){
		if (Key.isDown(Key.W)){
			this.fireDir = Vector2.UP;
			this.use();
		}
		else if (Key.isDown(Key.A)){
			this.fireDir = Vector2.RIGHT.copy().mul(-1);
			this.use();
		}
		else if (Key.isDown(Key.S)){
			this.fireDir = Vector2.UP.copy().mul(-1);
			this.use();
		}
		else if (Key.isDown(Key.D)){
			this.fireDir = Vector2.RIGHT;
			this.use();
		}
	}
}

SoulGun.instructions = ["Soul Gun:", "WASD To fire", "Each use costs 1 health"];

function SoulGun(game){
	Blaster.call(this, game);
	this.cooldown = .3;
	this.image = SoulGun.image;
	this.bulletDamage = 20;

	this.selfDamage = .7;
	
	this.specificUse = function(){
		this.shootSound.play();
		
		this.game.attackAnimations.push(new Bullet(this.game.player.centre.copy(), this.fireDir.copy().mul(this.bulletSpeed),
												   "#E0E0E0", 3, this.bulletDamage, [this.game.player,]));
												   
		this.game.player.damage(this.selfDamage);
	}
}

ShotGun.instructions = ["Shotgun:", "Right click to fire"];

function ShotGun(game){
	Weapon.call(this, game, 1, ShotGun.image, ShotGun.instructions);
	
	this.fireSound = document.getElementById("shotgun");
	
	this.damage = 50;
	
	this.specificUse = function(){
		this.fireSound.play();
		
		this.game.attackAnimations.push(new ShotgunAttackAnimation(this.game.player, mousePos));
		
		var angle = this.game.player.centre.angleTo(mousePos);
		var point = this.game.player.centre.copy().add(angle.mul(this.game.player.radius * 2));
		var circle = new Circle(point, this.game.player.radius * 1.99);
		
		for (var j=this.game.creatures.length-1; j >= 0; j--){
			var creature = this.game.creatures[j];
			
			if (creature === this.game.player || creature.dead){
				continue;
			}
			
			if (circle.collideCircle(creature)){
				creature.damage(this.damage, creature.centre.copy());
			}
		}
	}
}

Bomb.instructions = ["Bombs:", "Right click to drop a bomb", "Bombs explode 2 seconds", "after being dropped.", "Makes sure to get", "out of the way!"];
function Bomb(game){
	Weapon.call(this, game, 1.5, Bomb.image, Bomb.instructions);
	
	this.specificUse = function(){
		this.game.attackAnimations.push(new BombAttackAnimation(this.game.player.centre, 2, 96));
	}
}

Raft.instructions = ["Raft:", "Allows you to cross water"];
function Raft(game){
	Weapon.call(this, game, 0, Raft.image, Raft.instructions);
}
