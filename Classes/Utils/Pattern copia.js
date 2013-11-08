//// LinePattern//function PatternLine(size,num,density,angle,color){		print('creo LinePAttern');	//path elements	var sprite = new Group();	var area = new Path.Rectangle(0,0,size,size);	sprite.appendBottom(area);		area.fillColor = null;	area.strokeColor = null;		var step = size/num;	var start = step/2;		for(var i=0; i<num; i++){				var l = new Path.Line(0,i*step+start,size,i*step+start);		l.strokeColor = color;		l.strokeWidth = (size/num)*density;		l.fillColor = null;		sprite.appendTop(l);	}		//create the pattern color	var pattern = new Pattern();		pattern.definition = sprite;		var baseMatrix = new Matrix(1,0,0,-1,0,0);	var matrix = baseMatrix.rotate(angle);	var pc = new PatternColor(pattern, matrix);		//sprite.remove();		return pc;	}//////function PatternSquare(size,num,density,angle,color){		var sprite = new Group();	var quadrolli = new Group();	var area = new Path.Rectangle(0,0,size*num,size*num);		area.fillColor = null;	area.strokeColor = null;		sprite.appendChild(quadrolli);	sprite.appendChild(area);		for(var i=0; i<num; i++){			for(var j=0; j<num; j++){					var quad = new Path.Rectangle(i*size,j*size,size,size);						quad.fillColor = color;			quad.strokeColor = null;						quad.scale(density);						quadrolli.appendChild(quad);		}	}		//create the pattern color	var pattern = new Pattern();		pattern.definition = sprite;		var baseMatrix = new Matrix(1,0,0,-1,0,0);	var matrix = baseMatrix.rotate(angle);	var pc = new PatternColor(pattern, matrix);		sprite.remove();		return pc;}////circles//function PatternCircle(size,num,density,angle,color){		var sprite = new Group();	var quadrolli = new Group();	var area = new Path.Rectangle(0,0,size*num,size*num);		area.fillColor = null;	area.strokeColor = null;		sprite.appendChild(quadrolli);	sprite.appendBottom(area);		for(var i=0; i<num; i++){			for(var j=0; j<num; j++){			var circ = new Path.Circle(i*size+size/2,j*size+size/2,size/Math.sqrt(2));						circ.scale(density);			circ.fillColor = color;			circ.strokeColor = null;			quadrolli.appendChild(circ);		}	}			//create the pattern color	var pattern = new Pattern();		pattern.definition = sprite;		var baseMatrix = new Matrix(1,0,0,-1,0,0);	var matrix = baseMatrix.rotate(angle);	var pc = new PatternColor(pattern, matrix);		sprite.remove();		return pc;}