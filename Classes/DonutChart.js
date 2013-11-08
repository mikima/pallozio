function DonutChart(_values, _names, _colors, _maxSize, _offset, _maxValue, _title){
	
	this.values = _values;
	this.colors = _colors;
	this.names = _names;
	this.totalValue = 0;
	this.sprite = new Group();
	//labels
	this.labelsPadding = 5;
	this.labelSize = 7;
	//title
	this.titlePadding = 10;
	this.titleSize = 14;
	
	//
	for(var i=0; i<this.values.length; i++){
		this.totalValue += this.values[i];
	}
	//
	this.outerRadius = 0;
	if(_maxValue == undefined) {
		this.outerRadius = _maxSize;
	} else {
		this.outerRadius = _maxSize * (this.totalValue/_maxValue);
	}
	//
	this.offset = _offset;
	this.innerRadius = 0;
	
	if(this.offset > this.outerRadius){
		this.offset = this.outerRadius;
	} else {
		this.innerRadius = this.outerRadius - this.offset;
	}
	
	this.render = function(){
		
		
		//get angles
		var angles = [0];
		
		for(var i = 0; i<this.values.length; i++){
		
			angles.push(angles[angles.length-1] + this.values[i]/this.totalValue*Math.PI*2);
		}
		
		print("Angles: "+angles);
		
		for(var i=1; i<angles.length; i++){
			var section;
			//if(i==0){
			//	section = this.drawSection(angles[angles.length-1], angles[i],i);
			//} else {
				section = this.drawSection(angles[i-1], angles[i]);
			//}
			section.name = this.names[i-1];
			section.fillColor = this.getColor(i-1);
			this.sprite.appendTop(section);
			
			//draw the label
			var lx = Math.cos((angles[i] - angles[i-1])/2+angles[i-1])*(this.outerRadius+this.labelsPadding);
			var ly = Math.sin((angles[i] - angles[i-1])/2+angles[i-1])*(this.outerRadius+this.labelsPadding);
			
			ly += ly>0? this.labelSize : 0;
			var label = new PointText(new Point(lx,ly));
			label.content = this.names[i-1];
			//label.carachterStyle.fontSize = 7;
			label.paragraphStyle.justification = lx<0? 'right' : 'left';
			this.sprite.appendTop(label);
		}
		
		this.sprite.title = new PointText(new Point(0, this.outerRadius+this.titlePadding+this.titleSize));
		
		this.sprite.title.paragraphStyle.justification = 'center';
		this.sprite.title.content = _title;
		//this.sprite.title.carachterStyle.size = 14;
		this.sprite.appendTop(this.sprite.title);
	}
	
	this.getColor = function(index){
		print('color '+this.colors[index]);
		if(this.colors[index] == undefined) {
			print("genero colore indice "+index)
			return new CMYKColor(Math.random(),Math.random(),Math.random(),0);
		} else {
			return this.colors[index];
		}
	}
	
	this.drawSection = function(startAngle,endAngle){
		//
		var middle = (endAngle-startAngle)/2 + startAngle;
		var p = new Path();
		//p.moveTo(Math.cos(startAngle)*this.outerRadius, Math.sin(startAngle)*this.outerRadius);
		p.moveTo(a2p(startAngle,this.outerRadius));
		p.arcTo(a2p(middle,this.outerRadius),a2p(endAngle,this.outerRadius));
		//p.arcTo(Math.cos(middle)*this.outerRadius, Math.sin(middle)*this.outerRadius, Math.cos(endAngle)*this.outerRadius, Math.sin(endAngle)*this.outerRadius);
		p.lineTo(Math.cos(endAngle)*this.innerRadius, Math.sin(endAngle)*this.innerRadius);
		p.arcTo(Math.cos(middle)*this.innerRadius, Math.sin(middle)*this.innerRadius, Math.cos(startAngle)*this.innerRadius, Math.sin(startAngle)*this.innerRadius);
		
		p.closePath();
		return p;
	}
	//
	function a2p(angle,radius){
		return new Point(Math.cos(angle)*radius,Math.sin(angle)*radius);
	}
	//
	this.render();
}