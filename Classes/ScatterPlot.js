include('underscore.js');
include('Utils/ColorScale.js');
include('Utils/Scale.js');


function ScatterPlot(data){
	
	//la mappa fa da tramite tra l'oggetto data e l'oggetto visualizzazione
	var map = {name:'', size:'', color:'',xpos:'',ypos:''};
	var labels = {name:'Name',size:'Size', color:'Color', xpos:'X Position', ypos:'Y Position'};
	var max_size = 0;
	var max_x = 0;
	var max_y = 0;
	
	//object of Scale and ColorScale Objects
	var scales = {
		xpos: {},
		ypos: {},
		size: {},
		color: {}
		}
	
	this.sprite = new Group();
	this.sprite.name = 'Bubble Chart'
	
	/*
	 * Prompt a dialog asking the table mapping to the user.
	 */
	
	this.askMapping = function(){
		
		var components = {};
		
		//get the option list using Underscore.js
		var options = _.keys(data[0]);
		//options=['uno','due','tre'];
		

		//this cycle creates all the elements basing on the map
		var mapIndex = 0;
		for ( var i in map ){
			components[i] = { type:'list', label:(labels[i]+' column index'), options: options, value: options[mapIndex]}
			mapIndex++;
		}
		
		map = Dialog.prompt('Map table', components);
		
		//ora inizializzo
		return this;
	}
	
	//l'oggetto visuals contiene tutte le variabili visive
	var visuals = {
					x:0,
					y:0,
					width:600,
					height:400,
					maxSize:25,
					minSize:10,
					minColor:'#ff0000',
					maxColor:'#00ff00',
					legend:true,
					belnd:'multiply',
					axes:true
				  }
	
	this.askVisuals = function(){
		var components = {
						x: { type:'number', label:'X position'},
						y: { type:'number', label:'Y position'},
						width: { type:'number', label:'Width'},
						height: { type:'number', label:'Height'},
						maxSize: { type:'number', label:'Max Size (Radius)'},
						minSize: { type:'number', label:'Min Size (Radius)'},
						minColor: { type:'color', label:'Min Color'},
						maxColor: { type:'color', label:'Min Color'},
						legend: { type:'boolean', label:'Draw Legend'},
						axes: { type:'boolean', label:'Draw Axes'},
						blend: {type:'list',label:'Blend Mode', options:['normal', 
																		 'multiply', 
																		 'screen', 
																		 'overlay', 
																		 'soft-light', 
																		 'hard-light', 
																		 'color-dodge', 
																		 'color-burn', 
																		 'darken', 
																		 'lighten', 
																		 'difference', 
																		 'exclusion', 
																		 'hue', 
																		 'saturation', 
																		 'color', 
																		 'luminosity']}
					  }
		
		visuals = Dialog.prompt('Set Visual Appearances',components,visuals);
		
		return this;
	}
	
	//this method can be called only if the visuals and the map objects are setted.
	
	this.setScales = function(){
		
		//temporary function. just to make simpler the code.
		//not the best solution, but working.
		
		function getMax(field) {
			
			return _.max(data,function(obj){return obj[map[field]]})[map[field]];
		}
		function getMin(field) {
			
			return _.min(data,function(obj){return obj[map[field]]})[map[field]];
		}
		
		
		//y position must be inverted, due to the illustrator axis system.
		//so we start it from the visualization's height minust the maximum size (safe borders).
		scales.ypos = new Scale(getMin('ypos'),getMax('ypos'),visuals.height-visuals.maxSize,visuals.maxSize);
		//same of ypos, but without axis inversion
		scales.xpos = new Scale(getMin('xpos'),getMax('xpos'),visuals.maxSize,visuals.width-visuals.maxSize);
		scales.size = new SquareScale(getMin('size'),getMax('size'),visuals.minSize,visuals.maxSize);
		
		//colors must be converted in cmyk to work with ColorScale
		scales.color = new ColorScale([visuals.minColor.convert('cmyk'),visuals.maxColor.convert('cmyk')],[getMin('color'),getMax('color')]);
		
		return this;
	}
	
	//TODO: panel asking how to draw the axes
	
	this.draw = function(){
		
		var bg = new Path.Rectangle(0,0,visuals.width, visuals.height);
		bg.strokeColor = null;
		bg.fillColor = null;
		bg.name = 'background';
		
		bg.glyphs = new Group();
		bg.glyphs.name = 'Data Area';
		
		//visually nest the grups (in illustrator)
		this.sprite.appendChild(bg);
		this.sprite.appendChild(bg.glyphs);
		
		
		//creating all the data elements
		
		for(var i in data){
			
			//calculates graphic variables
			var cx = scales.xpos.get(data[i][map.xpos]);
			var cy = scales.ypos.get(data[i][map.ypos]);
			var cr = scales.size.get(data[i][map.size]);
			var cc = scales.color.getColor(data[i][map.color]);
			var cname = data[i][map.name]
			
			//draw the elements
			var c = new Path.Circle(cx,cy,cr);
			//setup the style
			c.fillColor = cc;
			c.blendMode = visuals.blend;
			c.strokeColor = null;
						
			//now creates the label on 0-0, we'll place it correctly later
			var t = new PointText(new Point(0,0));
			//style
			//align with the circle using the buonding box property (position).
			t.position = c.position;
			t.content = cname;
			t.paragraphStyle.justification = 'center';
			
			//names the elements and create a meaningless stucture
			t.name = 'label';
			c.name = 'circle';
			
			var container = new Group();
			container.name = cname;
			container.appendTop(c);
			container.appendTop(t);
			
			bg.glyphs.appendTop(container);
		}
		
		//creating the axes
		var xaxe = new Path.Line(scales.xpos.outMin,visuals.height,scales.xpos.outMax,visuals.height)
		var yaxe = new Path.Line(0,scales.ypos.outMin,0,scales.ypos.outMax)
		
	}
}
