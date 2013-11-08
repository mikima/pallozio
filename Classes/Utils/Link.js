/**
 * 
 * Creates a new Link.
 * @class The class Link creates a visual link between two objects.
 * It supports different render methods, using both lines and paths.
 * 
 * @version 0.1
 * @property {Path} r1 The starting path of the stream.
 * @property {Path} r2 The ending point of the stream.
 * @property {String} render if provided, The Link render method. It can be choose between "line", "path", "stream", "lineStream"</ br>
 * <b>"line"</b> render the link with a single line, the height is equal to the lowest one between the two elements</ br>
 * <b>"path"</b> render the link as a path, using 4 control points.</ br>
 * <b>"stream"</b> render the link as a path, the heights are proportional to the two objects</ br>
 * <b>"lineStream"</b> render the link as a gropu of lines, this way the heigths are proportional to the two object's ones.</ br>
 * If not provided, the link will be rendered as "line".
 * @property {Number} ease if provided, the handlers horizontal distance from the point.
 */

function Link(r1,r2,render,ease){
	
	this.version = "0.1";
	// check functions
	this.sprite = new Path();
	this.render = render==null ? 'line' : render;
	this.ease = ease==null ? 'auto' : ease;
	this.options = ["line", "path", "stream", "lineStream"];
	
	var r,l;
	var h, rh, lh;
	
	//get minimum height
	h = Math.min(r1.bounds.height,r2.bounds.height);
	//get object on the left
	if (r1.bounds.x > r2.bounds.x) {
		r = r1;
		l = r2;
	} else {
		l = r1;
		r = r2;
	}

	
	/**
	 * drawing method. if 'line' the link will be plotted as a two-point bezier.
	 * if 'path' as a 4-points path. default = line
	 */
	//this.render = 'stream';
	
	//this.ease = 'auto';
	
	if(this.ease = 'auto'){
		this.ease = (r.bounds.x - (l.bounds.x+l.bounds.width))/2;
	}
	
	/*
	 * Remove the link's graphic component (sprite).
	 */
	
	this.clear = function() {
		if(this.sprite) {
			this.sprite.remove();
		}
	}
	
	/**
	 * render the link, according to the render method declared.
	 */
	
	this.draw = function() {
	
		if(this.render=='path') {
			
			np = new Point(0,0);
			lp = new Point(this.ease,0);
			rp = new Point(-this.ease,0);
			bl = new Point(l.bounds.x+l.bounds.width,l.bounds.y+l.bounds.height);
			br = new Point(r.bounds.x,r.bounds.y+r.bounds.height);
			tl = new Point(bl.x,bl.y-h);
			tr = new Point(br.x,br.y-h);
			
			this.sprite.segments.push(new Segment(bl,np,lp));
			this.sprite.segments.push(new Segment(br,rp,np));
			this.sprite.segments.push(new Segment(tr,np,rp));
			this.sprite.segments.push(new Segment(tl,lp,np));
			this.sprite.closed = true;
			this.sprite.fillColor = l.fillColor;
		}
		if(this.render=='stream') {
			this.sprite = new Path();
			
			np = new Point(0,0);
			lp = new Point(this.ease,0);
			rp = new Point(-this.ease,0);
			bl = new Point(l.bounds.x+l.bounds.width,l.bounds.y+l.bounds.height);
			br = new Point(r.bounds.x,r.bounds.y+r.bounds.height);
			tl = new Point(bl.x,l.bounds.y);
			tr = new Point(br.x,r.bounds.y);
			
			this.sprite.segments.push(new Segment(bl,np,lp));
			this.sprite.segments.push(new Segment(br,rp,np));
			this.sprite.segments.push(new Segment(tr,np,rp));
			this.sprite.segments.push(new Segment(tl,lp,np));
			this.sprite.closed = true;
			this.sprite.fillColor = l.fillColor;
		}
		if(this.render =='line'){
			this.sprite = new Path();
			
			lp = new Point(l.bounds.x+l.bounds.width,l.bounds.y+l.bounds.height-h/2);
			rp = new Point(r.bounds.x,r.bounds.y+r.bounds.height-h/2);
			
			np = new Point(0,0);
			le = new Point(this.ease,0);
			re = new Point(-this.ease,0);
			
			this.sprite.segments.push(new Segment(lp,np,le));
			this.sprite.segments.push(new Segment(rp,re,np));
			this.sprite.fillColor = null;
			this.sprite.strokeColor = l.fillColor;
			this.sprite.strokeWidth = h;
		}
		
		if(this.render =='pathfromline'){
			this.sprite = new Path();
			
			lp = new Point(l.bounds.x+l.bounds.width,l.bounds.y+l.bounds.height-h/2);
			rp = new Point(r.bounds.x,r.bounds.y+r.bounds.height-h/2);
			
			np = new Point(0,0);
			le = new Point(this.ease,0);
			re = new Point(-this.ease,0);
			
			this.sprite.segments.push(new Segment(lp,np,le));
			this.sprite.segments.push(new Segment(rp,re,np));
			this.sprite.fillColor = null;
			this.sprite.strokeColor = l.fillColor;
			this.sprite.strokeWidth = h;
			this.sprite.expand('stroke');
		}
		
		if(this.render =='lineStream'){
			
			np = new Point(0,0);
			le = new Point(this.ease,0);
			re = new Point(-this.ease,0);
			
			function line(inx,iny,outx,outy){
				lp = new Point(inx,iny);
				rp = new Point(outx,outy);
				
				var nline = new Path();
				nline.segments.push(new Segment(lp,np,le));
				nline.segments.push(new Segment(rp,re,np));
				nline.fillColor = null;
				nline.strokeColor = l.fillColor;
				nline.strokeWidth = h;
				
				return nline;
			}
			
			this.sprite = new Group();
			
			var p = line(l.bounds.x+l.bounds.width,
							   l.bounds.y+l.bounds.height-h/2,
							   r.bounds.x,
							   r.bounds.y+r.bounds.height-h/2);
			
			this.sprite.appendTop(p);
			
			//calculate lines to fill
			var max = r.bounds.height>l.bounds.height ? r : l;
			var min = r.bounds.height<l.bounds.height ? r : l;
			
			lines = max.bounds.height / min.bounds.height - 1;
			
			lvar = l==max ? 1 : 0;
			rvar = r==max ? 1 : 0;
			
			for(var i=0; i<lines; i++){
				this.sprite.appendTop(line(l.bounds.x+l.bounds.width,
								   l.bounds.y+h/2+(i*h)*lvar,
								   r.bounds.x,
								   r.bounds.y+h/2+(i*h)*rvar));
			}
			
		}
	}
	this.draw();
}