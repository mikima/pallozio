include('underscore.js');
include('Utils/Link.js');




function StreamGraph(data){
	
	var map = {};
	var labels = {};
	var colors = {};
	var visuals = {};
	var hierarchy = {};
	var stepNumber = 0;
	this.sprite = new Group();
	
	
	map = {step:'', category:'', cluster:'', size:''};
	labels = {step:'Horizontal steps', category:'Categories', cluster:'Clusters', size:'Size'};

	this.sprite.name = 'StremGraph by category';
	
	//default values
	
	visuals = {
					x: 0,
					y: 0,
					width: 1000,
					height:500,
					barWidth:10,
					inPadding:5,
					outPadding:10,
					render:'stream',
					colorsBy:'category',
					blend:'multiply',
					minStroke:1,
					distance:60
	}
	
	/*
	 * initialize data and visualization
	 * 
	 */
	
	this.initialize = function(){
		
		//ora creo la gerarchia
		hierarchy.steps = {};
		hierarchy.total = 0;
		var step = {};
		var category = {};
		var cluster = {};
		
		for(var i in data){
			
			hierarchy.total += data[i][map.size];
			
			if(hierarchy.steps[data[i][map.step]] == null){
				
				hierarchy.steps[data[i][map.step]] = {categories:{},total:0};
			}
			
			step = hierarchy.steps[data[i][map.step]];
			step.total += data[i][map.size];
			
			if(step.categories[data[i][map.category]] == null){
				
				step.categories[data[i][map.category]] = {clusters:{},total:0};
			}
			
			category = step.categories[data[i][map.category]];
			category.total += data[i][map.size];
			
			if(category.clusters[data[i][map.cluster]] == null){
				
				category.clusters[data[i][map.cluster]] = data[i][map.size];
			}
		}
		
		//ora calcolo il numero di steps
		
		stepNumber = _.keys(hierarchy.steps).length;
		
		//calcolo i colori
		if(visuals.colorsBy == 'categories') {
			
			var uniqCategories = _.uniq(_.pluck(data,map.category));
			print(uniqCategories);
			
			for(var i=0; i<uniqCategories.length; i++){
				colors[uniqCategories[i]] = new CMYKColor(Math.random(),Math.random(),Math.random(),0);
			}
		}
		
		if(visuals.colorsBy == 'clusters') {
			
			var uniqClusters = _.uniq(_.pluck(data,map.cluster));
			print(uniqClusters);
			
			for(var i=0; i<uniqClusters.length; i++){
				colors[uniqClusters[i]] = new CMYKColor(Math.random(),Math.random(),Math.random(),0);
			}
		}
		
		print('hierarchy ');
		
		//calculate exact distance
		visuals.distance = (visuals.width - visuals.barWidth) / stepNumber;
		
		return this;
	}
	
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
		
		//parso i valori
		for(i in data){
			data[i][map.size] = parseFloat(data[i][map.size]);
		}
		
		return this;
	}
	
	/*
	 * Prompt a dialog asking the visual variables to the user.
	 */
	
	this.askVisuals = function(){
		var components = {
						x: { type:'number', label:'X position'},
						y: { type:'number', label:'Y position'},
						width: { type:'number', label:'Width'},
						height: { type:'number', label:'Height'},
						barWidth: { type:'number', label:'Bars width'},
						outPadding: { type:'number', label:'Padding between categories'},
						outPadding: { type:'number', label:'Padding inside categories'},
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
																		 'luminosity']},
						render: {type:'list',label:'Render Method', options:["line"]},
						colorsBy: {type:'list',label:'colorsBy', options:['categories','clusters']},
						minStroke: {type:'number',label:'Minimum stroke size'}
					  }
		
		visuals = Dialog.prompt('Set Visual Appaerences',components,visuals);
		
		return this;
	}
	
	this.askColors = function(){
		
		var components = {};
		
		for(var item in colors) {
			components[item] = { type:'color', label:item, value:colors[item]};
		}
		//var components = { color: { type: 'color', label: 'Color', value:new RGBColor(0,1,0)}}; 
		
		var values = Dialog.prompt('Set '+visuals.colorsBy+'Colors', components);
		
		for(var item in this.colors) {
			this.colors[item] = values[item];
		}
		
		return this;
	}
	
	this.draw = function(){
		
		
	}
}