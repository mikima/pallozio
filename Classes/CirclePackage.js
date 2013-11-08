/**
 * Create a new circle
 * @class This class creates a new Circle
 * @param {Number} x Circle's horizontal position
 * @param {Number} y Circle's vertical position
 * @param {Number} r Circle's radius
 * @param {String} [label] Circle displayed label
 *
 * @property {Number} x Circle's horizontal position
 * @property {Number} y Circle's vertical position
 * @property {Number} radius Circle's radius
 * @property {String} label Circle displayed label
 * @property {Group} sprite Circle's visual paths
 */

function Circle(x,y,r,label, color){
	this.x = x;
	this.y = y;
	this.radius = r;
	this.label = label;
	
	/**
	 * Returns the distance from a given point
	 * @param {Point} point Point to get distance from
	 * @returns {Number} the distance in points
	 */
	this.getOffset = function(point){
		return distance(this.x, this.y, point.x, point.y)
	}
	
	/**
	 * Check if the circle contains a given point
	 * @param {Point} point Point to check
	 * @returns {Boolean} True if the point is contained, false if not.
	 */
	this.contains = function(point){
		return (distance(this.x,this.y,point.x,point.y) <= this.radius);
	}
	
	/**
	 * Check if the circle intersect with another
	 * @param {Circle} other The other Circle
	 * @returns {Boolean} True if circles overlap, false if not.
	 */
	this.intersect = function(other){
		var d = distance(this.x,this.y,other.x,other.y)
		return (d < (this.radius+other.radius));
	}
	
	/**
	 * Draw the cirlce and its label, if defined
	 */
	
	this.draw = function() {
		this.sprite = new Group();
		this.sprite.circle = new Path.Circle(this.x,this.y,this.radius)
		this.sprite.circle.strokeColor = null;
		
		var stupida = Math.random();
		this.sprite.circle.fillColor = new CMYKColor(0,stupida,1,0);
		//this.sprite.circle.opacity = Math.random();
		
		this.sprite.appendTop(this.sprite.circle);
		
		if(this.label) {
			this.sprite.label = new PointText(new Point(this.x,this.y));
			this.sprite.label.paragraphStyle.justification = 'center';
			this.sprite.label.content = this.label;
			this.sprite.label.position = this.sprite.circle.position;
			
			this.sprite.appendTop(this.sprite.label);
		}
	}
	
	/**
	 * Update circle's position
	 */
	this.update = function() {
		this.sprite.x = this.x;
		this.sprite.y = this.y;
	}
}


function distance(x0,y0,x1,y1) {
	return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
}

function fast_distance(x0,y0,x1,y1) {
	return ((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
}

/**
 * Create a new CirclePackage
 * @class This class crete a circlepackage
 * @param {Number} w The bounds width, in points.
 * @param {Number} h The bounds height, in points.
 * @param {Number} padding The distance between circles.
 * @property {Number} width The bounds width, in points.
 * @property {Number} height The bounds height, in points.
 * @property {Number} padding The distance between circles.
 * @property {Array} array of Circle objects
 * @property {Point} center The converging point of CirclePackage
 * @property {Number} damping=0.999 Attraction force to visualization's center
 */

function CirclePackage() {
	
	this.width = 500;
	this.height = 400;
	this.padding = 0;
	this.circles = [];
	this.center = new Point(this.width/2,this.height/2);
	this.damping = 0.999;
	this.iterations = 100;
	this.minSize = 1;
	this.maxSize = 25;
	
	/**
	 * Open a dialog asking parameters to user
	 */
	
	this.askProperties = function(){
		
		var components = {
			w: {type:'number',label:'Width',value:100},
			h: {type:'number',label:'Height',value:100},
			pd: {type:'number',label:'Padding',value:10},
			dp: {type:'number',label:'Attraction',value:1},
			i: {type:'number',label:'Number of iteration',value:100},
			min_size: {type:'number',label:'Minimum radius',value:1},
			max_size: {type:'number',label:'Maximum radius',value:25}
		}
		var values = Dialog.prompt('Circle Package properties',components);
		this.width = values.w;
		this.height = values.h;
		this.padding = values.pd;
		this.dumping = values.dp;
		this.iterations = values.i;
		this.minSize = values.min_size;
		this.maxSize = values.max_size;
		
		return this;
	}
	
	/**
	 * Open a dialog asking parameters about generation
	 */
	 
	this.askGeneration = function(){
		
		var components = {
			num: {type:'number',label:'Number of circles',value:100}
		}
		
		var values = Dialog.prompt('Generate random circles',components);
		
		this.generate(values.num,values.max_size,values.min_size);
		
		return this;
	} 
	
	/**
	 * Add a Circle to circlePackage
	 * @param {Number} size The diameter of Circle, in points
	 * @param {String} label The circle Label
	 */
	
	this.addCircle = function(size, label, color){
		this.circles.push(new Circle(Math.random()*this.width,Math.random()*this.height,size,label));
	}
	
	/**
	 * Generate random Circles.
	 * @param {Number} circleNum Circles number
	 * @param {Number} max_size The maximum Circle size
	 * @param {Number} min_size The minimum Circle size
	 */
	
	this.generate = function(cicleNum,max_size,min_size){
		for(var init=0; init<cicleNum; init++){
			this.circles[init] = new Circle(Math.random()*this.width,Math.random()*this.height,(Math.random()*(max_size-min_size)+min_size));
		}
	}
	
	/**
	 * Main function. chenge the Circles position according to attraction force (dumping)
	 * and tries to avoid overlapping.
	 * @param {Point} center The attraction point
	 * @param {Circles[]} circles An array containg circles to pack
	 * @param {Number} damping the attraction value. Max value allowed is 0.999.
	 * @param {Number} padding The optimal distance between circles.
	 * @param {Circles[]} exclusion list
	 */
	
	var pack = function(center,circles,damping,padding,exclude){
	
		for(var i=0; i<circles.length-1; i++){
		
			var circle1 = circles[i];
			
			for(var j=i+1; j<circles.length; j++){
				
				var circle2 = circles[j];
				var d = fast_distance(circle1.x,circle1.y,circle2.x,circle2.y);
				var r = circle1.radius+circle2.radius+padding;
				
				if(d<Math.pow(r,2)-0.001) {
					
					var dx = circle2.x - circle1.x;
					var dy = circle2.y - circle1.y;
					
					//ora normalizzo d
					droot = Math.sqrt(d);
					
					var vx = (dx/droot) * (r-droot) * 0.5;
					var vy = (dy/droot) * (r-droot) * 0.5;
					
					//TODO: implement exclusion list
					
					circle1.x -= vx;
					circle1.y -= vy;
					
					circle2.x += vx;
					circle2.y += vy;
				}
			}
		}
	
		//Attractive force: all circles move to center.
		for(var c in circles){
			var circle = circles[c];
			
			vx = (circle.x - center.x) * damping;
			vy = (circle.y - center.y) * damping;
			circle.x -= vx;
			circle.y -= vy;
		}
	}
	
	/**
	 * Repack circles for a given iterations number. Higher is the iteration number, more accurate is the result.
	 * @param {Number} [iterations] Iterations number. More are the iterations, more accurate is the result. If no value is given it is set to default.
	 */
	
	this.update = function(iterations) {
		if(!iterations){
			print('no iterations given');
			iterations = this.iterations
		};
		print(iterations);
		for(var w=1; w<iterations; w++){
			pack(this.center,this.circles,this.damping/w,this.padding);
		}
		
		return this;
	}
	/**
	 * Draw all the circles
	 */
	
	this.draw = function(){
		for(var c in this.circles){
			this.circles[c].draw();
		}
	}
}



