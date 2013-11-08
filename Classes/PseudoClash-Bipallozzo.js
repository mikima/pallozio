include("Utils/ColorScale.js");
include("Bipallozzo.js");
include('underscore.js');

function PseudoClash(_data){
	
	this.data = _data;
	this.width = 456.377;
	this.height = 400;
	this.x = 0;
	this.y = 0;
	this.scale = 1;
	this.colorScale = new ColorScale([new CMYKColor(1,0,0,0), new CMYKColor(0,0,1,0)],[0,1]);
	this.map = {names:0,a1:1,a2:2};
	this.sprite = new Group();
	
	this.getBounds = function() {
		return new Rectangle(this.x,this.y,this.width,this.height);
	}
	
	
	this.askDimension = function(){
		var components = {
			x:{value:this.x,label:"x"},
			y:{value:this.y,label:"y"},
			width:{value:this.width,label:"Width"},
			height:{value:this.height,label:"Height"},
			scale:{value:this.scale,label:"Scale, units per point"}
		}
		
		var values = Dialog.prompt('Visualization sizes',components);
		
		if(values.scale == 0){
			Dialog.alert('scale cannot be 0, it will be set to 1');
			values.scale = 1;
		}
		
		for(var val in values){
			this[val] = values[val];
		}
		return this;
	}
	
	
	this.askMapping = function()
	{
		var components = {};
		
		var options = _.keys(data[0]);
		
				// check if variables are defined
		function checkValues(variableName, variable, defaultValue){
				components[variableName] = { type:'list', label:(variableName+' column index'), options: options, value: options[defaultValue]}
		}
		
		checkValues('names', this.stepsIndex, 0);
		checkValues('attractor1', this.clustersIndex, 1);
		checkValues('attractor2', this.valuesIndex, 2);
		
		var values = Dialog.prompt('Map table', components);

		this.map.names = values.names;
		this.map.a1 = values.attractor1;
		this.map.a2 = values.attractor2;
		
		print("mappa | names: "+this.map.names+" | a1: "+this.map.a1+" | a2: "+this.map.a1);
		
		return this;
	}
	
	this.draw = function()
	{	
		var y = 0;
		
		for(var i in this.data){
			var a1 = data[i][this.map.a1];
			var a2 = data[i][this.map.a2];
			var name = data[i][this.map.names];
			
			print("Disegno "+a1+"-"+a2);
			
			var bp = new Bipallozzo(name,a2,a1,Math.PI/4);
			
			var x = a2/(a1+a2) * this.width;
			bp.position = new Point(x,y);
			y+=bp.bounds.height+5;
			
			/*
			var c = new Path.Circle(x,y,size);
			c.blendMode = 'multiply';
			c.strokeColor = null;
			c.fillColor = this.colorScale.getColor(a2/(a1+a2));
			
			var t = new PointText(new Point(x,y));
			t.content = this.data[i][this.map.names];
			t.paragraphStyle.justification = 'center';
			var g = new Group();
			g.appendTop(c);
			g.appendTop(t);
			g.name = this.data[i][this.map.names];
			*/
			
			this.sprite.appendTop(bp);
		}
	}
	this.askAll = function(){
		this.askDimension();
		this.askMapping();
		this.colorScale.askColors();
	}
}