include("DataTable.js");
include("Utils/ColorScale.js");
include("Bipallozzo.js");

function PseudoClash(_data){
	
	this.data = _data;
	this.width = 400;
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
	}
	
	this.askMapping = function() {
		var components = {};
		
		var options = [];
		for(var i in this.data.headers){
			options.push(i);
		}
		components.names = { type:'list', label:'Items names', options: options, value: options[0]};
		components.attractor1 = { type:'list', label:'First attractor value', options: options, value: options[1]};
		components.attractor2 = { type:'list', label:'Second attractor value', options: options, value: options[2]};
		
		var values = Dialog.prompt('map the data columns',components);
		
		this.map.names = data.headers[values.names];
		this.map.a1 = data.headers[values.attractor1];
		this.map.a2 = data.headers[values.attractor2];
		this.data.parseCol(this.map.a1);
		this.data.parseCol(this.map.a2);
	}
	
	this.draw = function(){
		for(var i=0;i<data.lines;i++){
			var a1 = data[i][this.map.a1];
			var a2 = data[i][this.map.a2];
			var size = Math.sqrt((a1+a2) / this.scale);
			var x = a2/(a1+a2) * this.width;
			var y = Math.random()*(this.height);
			
			
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
			this.sprite.appendTop(g);
		}
	}
	this.askAll = function(){
		this.askDimension();
		this.askMapping();
		this.colorScale.askColors();
	}
}


/*
var data = new DataTable();
data.readFromSel("\t");
var components = {
	larg:{value:200,label:"larghezza"},
	altez:{value:400,label:"altezza"},
	scala:{value:1,label:"scala"},
}

var valori = Dialog.prompt("appallozziamoci zio bello!", components);






var larg = valori.larg;
var altez = valori.altez;
var scala = valori.scala;

var bound = new Path.Rectangle(0,0,larg,altez);
bound.fillColor = null;
bound.strokeColor = null;

*/

/*
//Colori di partenza
var c1 = Dialog.chooseColor().convert('cmyk');
//c1=c1.convert('cmyk');
print (c1);
var c2 = Dialog.chooseColor ();
c2=c2.convert('cmyk');
print (c2);

//c1 = new CMYKColor (1,0,0,0);
//c2 = new CMYKColor (0,1,0,0);

var cs = new ColorScale(c1,c2);
//print(data[0][0]);
//Dialog.alert(data[0][1]);

for(var i=0;i<data.rows;i++){
	
	//var per pallozzo
	var x = Math.random()*larg;
	var sbunna = (parseFloat(data[i][2]))/100;
	//var y = sbunna*altez;
	if(sbunna<0.01){
		var y=-100;
	} else if(sbunna>0.99){
		var y=altez+100;
	} else {
		var y = sbunna*altez;
	}

	
	
	
	var yy = y/altez;
	//print(yy);
	var r = Math.sqrt(parseFloat(data[i][0])*scala);
	var testo = new PointText(new Point(x,y));


	//creo pallozzo
	var pallozzo = new Path.Circle(x,y,r);
	//var colore CMYK
	//var component = cs.getColor(yy);
	//print (cs.getColor(yy));
	//belnding mode
	pallozzo.blendMode = 'multiply';
	
	pallozzo.fillColor = cs.getColor(yy);
	testo.content = data[i][1];
	testo.paragraphStyle.justification = 'center';

	//creo gruppi
	var gruppozzi = new Group();
	gruppozzi.name = data[i][1]+" "+Math.round(parseFloat(data[i][2]));
	gruppozzi.appendTop(pallozzo);
	gruppozzi.appendTop(testo);
	}
	*/