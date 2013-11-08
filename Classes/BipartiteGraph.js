include('Utils/Link.js');
include('underscore.js');
//visualises bipartite grpah (http://en.wikipedia.org/wiki/Bipartite_graph) using the fineo visual model (http://www.densitydesign.org/research/fineo/)

function BipartiteGraph(data){
	
	//la mappa fa da tramite tra l'oggetto data e l'oggetto visualizzazione
	var map = {set1:'', set2:'', size:''};
	var labels = {set1:'First set of elements', set2:'First set of elements', size:'Edge width'};
	
	this.sprite = new Group();
	this.sprite.name = 'Bipartite Graph';
	this.customOrder = {set1:{},set2:{}};
	
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
					width:2000,
					height:2000,
					barwidth:10,
					barpadding:5,
					blend:'multiply',
					render:'Line',
					minStroke:1
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
						barwidth: { type:'number', label:'Bars width'},
						barpadding: { type:'number', label:'Padding between bars'},
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
						minStroke: {type:'number',label:'Minimum stroke size'}
					  }
		
		visuals = Dialog.prompt('Set Visual Appaerences',components,visuals);
		
		this.initialize();
		
		return this;
	}
	
	//variabili utili
	var set1 = {};
	var set2 = {};
	var set1names = [];
	var set2names = [];
	var links = [];
	var total = 0;
	var set1colors = {};
	var set2colors = {};
	var pixels = 0;
	var scale = 0;
	
	this.askOrder = function(){
		//creo liste di esempio
		var set1list = '';
		for(var i = 0; i<set1names.length; i++){
			set1list += '"'+set1names[i]+'": '+(i+1)+', '
		}
		var set2list = '';
		for(var i = 0; i<set2names.length; i++){
			set2list += '"'+set2names[i]+'": '+(i+1)+', '
		}
		
		var components = {
						set1:{ type:'string', label:'Set1 order', value:set1list},
						set2:{ type:'string', label:'Set2 order', value:set2list}
		}
		
		
		var results = Dialog.prompt('set custom orders',components);
		//eval pu˜ essere utilizzato solo a inizio linea
		eval("var customset1 = {"+results.set1+"};");
		eval("var customset2 = {"+results.set2+"};");
		
		set1names = _.sortBy(set1names,function(name){return customset1[name]});
		set2names = _.sortBy(set2names,function(name){return customset2[name]});
		
		links = _.sortBy(links,function(link){return customset2[link.target]});
		links = _.sortBy(links,function(link){return customset1[link.source]});
		
		return this;
	}
	
	//funzioni matematiche creazione colori ecc per la inizializzazione
	this.initialize = function() {
		
		for(var i in data){
			
			var source = data[i][map.set1];
			var target = data[i][map.set2];
			var size = data[i][map.size];
			
			//add to total populetion (useful to set the scale)
			
			total += size;
			
			//creates or increases the first set element
			
			if (set1[source] == null) {
				set1[source] = size;
			} else {
				set1[source] += size;
			}
			
			//creates or increases the second set element
			
			if (set2[target] == null) {
				set2[target] = size;
			} else {
				set2[target] += size;
			}
			
			//saves the link. names overlapping, hope it works anyway
			
			var link = {source:source, target:target, size:size}
			
			links.push(link);
		}
		
		//now using _ get the names list, and sort them.
		
		//ora creo collection
		var set1tuple = [];
		
		for(var i in set1){
			var obj = {key:i, value:set1[i]}
			set1tuple.push(obj);
		}
		
		var set2tuple = [];
		
		for(var i in set2){
			var obj = {key:i, value:set2[i]}
			set2tuple.push(obj);
		}
		
		set1tuple = _.sortBy(set1tuple,function(obj){return -obj.value});
		set2tuple = _.sortBy(set2tuple,function(obj){return -obj.value});
		
		set1names = _.map(set1tuple, function(obj){return obj.key});
		set2names = _.map(set2tuple, function(obj){return obj.key});
		
		links = _.sortBy(links,function(link){return -set2[link.target]});
		links = _.sortBy(links,function(link){return -set1[link.source]});
		
		//now, in theory, we must define the scales
		//we must identify the set with more elements
		
		if(set1names.length > set2names.length) {
			
			pixels = (visuals.height - (set1names.length-1) * visuals.barpadding);
			
		} else {
		
			pixels = (visuals.height - (set1names.length-1) * visuals.barpadding);
			
		}
				
		scale = pixels / total;
		
		//creo colori
		for(var i in set1){
			set1colors[i] = new CMYKColor(Math.random(),Math.random(),Math.random(), 0);
		}
		for(var i in set2){
			set2colors[i] = new CMYKColor(Math.random(),Math.random(),Math.random(), 0);
		}
	}
	
	/*
	 * Prompt a dialog asking each category color
	 */
	
	this.askColors = function(){
		
		var components = {};
		for(var item in set1colors) {
			//mi sa che va convertito in rgb
			//var hexvalue = '#'+this.colors[item].red.toString(16)+this.colors[item].green.toString(16)+this.colors[item].blue.toString(16);
			components[item] = { type:'color', label:item, value:set1colors[item]};
		}
		components.ruler = {type:'ruler'};
		for(var item in set2colors) {
			//mi sa che va convertito in rgb
			//var hexvalue = '#'+this.colors[item].red.toString(16)+this.colors[item].green.toString(16)+this.colors[item].blue.toString(16);
			components[item] = { type:'color', label:item, value:set2colors[item]};
		}
		//var components = { color: { type: 'color', label: 'Color', value:new RGBColor(0,1,0)}}; 
		
		var values = Dialog.prompt('Set Colors', components);
		
		for(var item in this.colors) {
			this.colors[item] = values[item];
		}
		
		return this;
	}
	
	this.draw = function(){
		
		// populates the three variables according to the data.
		// maybe there's a better way to do it.
		
		//wow, that was easy. now let's draw it.
		
		var graphics = {set1:{},set2:{}};
		
		var start = (visuals.height - (pixels + set1names.length * visuals.barpadding))/2;
		
		for (var i = 0; i < set1names.length; i++){
		
			graphics.set1[set1names[i]] = {start:0, sprite:{}};

			var p = graphics.set1[set1names[i]].sprite = new Path.Rectangle(0,start,visuals.barwidth,set1[set1names[i]] * scale);
			p.name = set1names[i];
			p.fillColor = set1colors[p.name];
			p.strokeColor = null;
			
			var t = new PointText(new Point(-5,start + set1[set1names[i]] * scale / 2));
			t.content = set1names[i];
			
			start += set1[set1names[i]] * scale + visuals.barpadding;
		}
		
		//second set
		
		var start = (visuals.height - (pixels + set2names.length * visuals.barpadding))/2;
		
		for (var i = 0; i < set2names.length; i++){
			
			graphics.set2[set2names[i]] = {start:0, sprite:{}};
			
			var p = graphics.set2[set2names[i]].sprite = new Path.Rectangle(visuals.width-visuals.barwidth,start,visuals.barwidth,set2[set2names[i]] * scale);
			p.name = set2names[i];
			p.fillColor = set2colors[p.name];
			p.strokeColor = null;
			
			var t = new PointText(new Point(visuals.width + 5,start + set2[set2names[i]] * scale / 2));
			t.content = set2names[i];
			
			start += set2[set2names[i]] * scale + visuals.barpadding;
		}
		
		//now draw links
		for(var i in links) {
			
			var s = graphics.set1[links[i].source];
			var t = graphics.set2[links[i].target];
			print(s.sprite.position.x);
			print(t.sprite.position.x);
			var ts = new Path.Rectangle(s.sprite.bounds.x, s.sprite.bounds.y + s.start, s.sprite.bounds.width, links[i].size * scale);
			var tt = new Path.Rectangle(t.sprite.bounds.x, t.sprite.bounds.y + t.start, t.sprite.bounds.width, links[i].size * scale);
			ts.fillColor = set1colors[links[i].source];
			tt.fillColor = set2colors[links[i].target];
			ts.strokeColor = null;
			tt.strokeColor = null;
			s.start += links[i].size * scale;
			t.start += links[i].size * scale;
			
			var i = new Link(ts,tt,visuals.render);
			i.sprite.blendMode = visuals.blend;
			
			
			if(i.sprite.strokeWidth < visuals.minStroke){
				i.sprite.strokeWidth = visuals.minStroke;
			}
			
			ts.remove();
			tt.remove();
		}
	}
}