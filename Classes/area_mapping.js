include('Utils/Link.js');
include('underscore.js');

function AreaMapping(data){
	
	var map = {name:'', size:''};
	var labels = {name:'Element Name', size:'Element Size'};
	
	var scale = 1;
	var min = 0;
	var max = 0;
		
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
	
	var visuals = {
					x:0,
					y:0,
					padding:20,
					maxsize:50,
					minsize:5,
					shape:'Circle'
				  }
	
	
	/*
	 * Prompt a dialog asking the visual variables to the user.
	 */
	
	this.askVisuals = function(){
		var components = {
						x: { type:'number', label:'X starting position'},
						y: { type:'number', label:'Y starting position'},
						maxsize: { type:'number', label:'Maximum Size'},
						minsize: { type:'number', label:'Minimum Size'},
						padding: { type:'number', label:'Padding between elements'},
						shape: {type:'list',label:'Blend Mode', options:['Circle', 
																		 'Square']}
					  }
		
		visuals = Dialog.prompt('Set Visual Appaerences',components,visuals);
		
		this.initialize();
		
		return this;
	}
	
	//initializes values
	
	this.initialize = function(){
		
		min = _.min(data,function(line){return line[map.size]});
		max = _.max(data,function(line){return line[map.size]});
	}
	
	this.draw = function(){
		
		var vis = new Group();
		var shape = new Path();
		vis.name = "Area Mapping";
		
		for(var i in data){
			
			if(visuals.shape == 'Square'){
			
				var 
				
			} else
			if(visuals.shape == 'Circle'){
				
				
			}
		}
	}
	
}