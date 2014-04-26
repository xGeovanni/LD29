var Random = {
	random : Math.random,
	
	uniform : function(min, max){
		if (max === undefined){
			max = min;
			min = 0;
		}
		
		return Math.random() * (max - min) + min;
	},
	
	range : function(min, max){
		return Math.floor(this.uniform(min, max));
	},
	
	chance : function(prob){
		return Math.random() < prob;
	},
	
	choice : function(array){
		return array[Math.floor(Math.random() * array.length)];
	},
	
	angle : function(){
		return Math.PI * 2 * Math.random();
	},
	
    binomial : function(){
        return Math.random() - Math.random();
    },
    
    shuffle : function(array){
        //https://github.com/coolaj86/knuth-shuffle/blob/master/index.js
        
        var currentIndex = array.length
          , temporaryValue
          , randomIndex
          ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
    },
};

var GameRandom = {
	//The functions herein require access to the GameMaths code.
	
	normalVector2 : function(){
		return Vector2(Math.random(), Math.random()).normalise();
	},
	
	normalVector3 : function(){
		return Vector3(Math.random(), Math.random(), Math.random()).normalise();
	},
	
	colour : function(){
		return "rgb(" + Math.random() + "," + Math.random() + "," + Math.random() + ")";
	}
};
