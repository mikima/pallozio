include('underscore.js');
include('Utils/Link.js');




function StreamGraph(data){
	
	
	this.data = data ? data : print('you must define a Collection (Array of Objects)');

	this.x = 0;
	this.y = 0;
	this.width = 600;
	this.height = 200;
	this.barWidth = 10;
	this.barPadding = 5;
	this.barDistance = 80;
	this.scale = 1;
	this.colors = {};
	this.linkType = 'stream';
	
	//default indexes for values, see @askMapping or @mapping
	this.stepsIndex = 0;
	this.clustersIndex = 1;
	this.valuesIndex = 2;
	
	/*
	 * sort the cluster inside a step
	 */
	

	this.sortAssoc = function(aInput) {
		var aTemp = [];
		for (var sKey in aInput)
		aTemp.push([sKey, aInput[sKey]]);
		aTemp.sort(function () {return arguments[1][1] - arguments[0][1]});
		var aOutput = [];
		
		//for (var nIndex = aTemp.length-1; nIndex >=0; nIndex--)
		//aOutput[aTemp[nIndex][0]] = aTemp[nIndex][1];
		
		//riscrivo la funzione in modo da non invertire l'ordine
		
		for (var nIndex = 0; nIndex < aTemp.length; nIndex++)
		aOutput[aTemp[nIndex][0]] = aTemp[nIndex][1];
	
		
		return aOutput;
	}
	
	/*
	 * get the scale according the visualization size
	 */
	
	this.getScale = function() {
		var tempVals = {};
		for(var k in steps){
			tempVals[k] = {size:0, groups:0};
			
			for(var m in steps[k]){
				tempVals[k].size += parseFloat(steps[k][m]);
				tempVals[k].groups++
			}
		}
		
		var scale = 100;
		
		for(var i in tempVals){
			var leftSize = this.height - this.barPadding * (tempVals[i].groups - 1);
			var tempScale = leftSize / tempVals[i].size;
			if(tempScale < scale) {
				scale = tempScale;
			}
		}
		return scale;
	}
	
	this.getDistances = function() {
		var result = (this.width - this.barWidth * stepsNumber) / (stepsNumber-1);
		return result;
	}
	
	
	/*
	 * Prompt a dialog asking the table mapping to the user.
	 */
	
	this.askMapping = function(){
		
		var components = {};
		
		//get the option list using Underscore.js
		var options = _.keys(data[0]);
		//options=['uno','due','tre'];
		
		
		// check if variables are defined
		function checkValues(variableName, variable, defaultValue){
				components[variableName] = { type:'list', label:(variableName+' column index'), options: options, value: options[defaultValue]}
		}
		
		checkValues('steps', this.stepsIndex, 0);
		checkValues('clusters', this.clustersIndex, 1);
		checkValues('values', this.valuesIndex, 2);
		
		var values = Dialog.prompt('Map table', components);
		this.stepsIndex = values.steps;
		this.clustersIndex = values.clusters;
		this.valuesIndex = values.values;
		
		//ora inizializzo
		this.initialize();
	}
	
	/*
	 * define by code the properties to use
	 */
	
	
	this.mapping = function(steps,clusters,values){
		this.stepsIndex = steps;
		this.clustersIndex = clusters;
		this.valuesIndex = values;
		
		//ora inizializzo
		this.initialize();
		
	}
	
	/*
	 * Prompt a dialog asking the visualization sizes to the user.
	 */
	
	this.askSizes = function(){
		
		var components = {};
		components.x = { type:'number', label:'X position', value:this.x};
		components.y = { type:'number', label:'Y position', value:this.y};
		components.width = { type:'number', label:'Width', value:this.width};
		components.height = { type:'number', label:'Height', value:this.height};
		components.barPadding = { type:'number', label:'Bars vertical padding', value:this.barPadding};
		components.barWidth = { type:'number', label:'Bars width', value:this.barWidth};
		components.linkType = { type:'list', label:'Streams Render Method', options:["line", "path", "stream", "lineStream"], value:this.linkType}
		
		var values = Dialog.prompt('Set Sizes', components);
		
		this.x = values.x;
		this.y = values.y;
		this.width = values.width;
		this.height = values.height;
		this.barPadding = values.barPadding;
		this.barWidth = values.barWidth;
		this.linkType = values.linkType;
		
		this.scale = this.getScale();
		this.barDistance = this.getDistances();
		
	}
	
	/*
	 * Prompt a dialog asking each category color
	 */
	
	this.askColors = function(){
		
		var components = {};
		for(var item in this.colors) {
			//mi sa che va convertito in rgb
			//var hexvalue = '#'+this.colors[item].red.toString(16)+this.colors[item].green.toString(16)+this.colors[item].blue.toString(16);
			components[item] = { type:'color', label:item, value:this.colors[item]};
		}
		//var components = { color: { type: 'color', label: 'Color', value:new RGBColor(0,1,0)}}; 
		
		var values = Dialog.prompt('Set Colors', components);
		
		for(var item in this.colors) {
			this.colors[item] = values[item];
		}
	}
	
	/*
	 * Prompt a dialog asking all parameters to user
	 */
	
	this.askAll = function() {
		this.askMapping();
		this.askSizes();
		this.askColors();
	}
	
	/*
	 * Draw the visualization
	 */
	
	this.draw = function(){
		var x = this.x;
		var y = this.y + this.height/2;
		var l = this.barWidth;
		var xd = this.barDistance;
		var yd = this.barPadding;
		var scale = this.scale;
		var streams = {};
		
		//draw all rectangles
		
		for ( k in steps ) {
			//calcolo la dimensione dello step
			var totSize = -yd;
			for(m in steps[k]){
				totSize+=steps[k][m]*scale+yd;
			}
			y -= totSize/2;
	
			var stepName = new PointText(new Point(x+l/2,y-yd*2));
			stepName.content = k;
			stepName.paragraphStyle.justification = 'center';
			stepName.characterStyle.fontSize = 16;
			stepName.characterStyle.font = app.fonts['Myriad Pro']['bold'];
			
			var i = 0;
			
			for(m in steps[k]) {
				if (streams[m]){
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m]*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				} else {
					streams[m] = new Array();
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m]*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				}
				streams[m][streams[m].length-1].fillColor = this.colors[m];
				//prendo il rettangolo di riferimento
				var rett = streams[m][streams[m].length-1];
				var textItem = new PointText(new Point(rett.bounds.x, rett.bounds.y+rett.bounds.height/2));
				textItem.content = m;
				textItem.paragraphStyle.justification = 'right';
				//print("coloro "+m+" in "+k+" di: "+this.colors[m]);
				//Path.Rectangle(x,y,l,steps[k][m]/scale);
				y += steps[k][m]*scale + yd;
			}
			x += xd+l;
			y = this.y + this.height/2;
		}
		
		//draw links
		
		for ( s in streams) {
			for(var i=1;i<streams[s].length;i++){
				if((streams[s][i].bounds.x - streams[s][i-1].bounds.x - xd/2) <= xd){
					var link = new Link(streams[s][i-1],streams[s][i],this.linkType);
					groupArray[s].appendTop(link.sprite);
					link.sprite.opacity = 0.5;
					link.sprite.blendMode = 'multiply';
				}
			}
		}
	}
	
	//prepeare the data
	
	var steps = {};
	var stepsNumber = 0;
	var groupArray = {};
	//var categories = {};
	
	this.initialize = function(){
	
		var step = this.stepsIndex;
		var path = this.clustersIndex;
		var value = this.valuesIndex;
		
		//creates the step/categories map
		
		for(var i in this.data){
			if (!steps[this.data[i][step]]){
				steps[this.data[i][step]] = new Array();
				stepsNumber++;
			}
			steps[this.data[i][step]][this.data[i][path]] = parseFloat(this.data[i][value]);
		}
		
		//sort and create a color for each category
		
		
		
		var i = 0;
		
		for ( k in steps ) {
			//print('key: '+k);
			
			//attivo/disattivo il sorting
			steps[k] = this.sortAssoc(steps[k]);
			
			for(m in steps[k]) {
				if(this.colors[m]){
					//print('\t '+m+" valore: "+steps[k][m]);
				} else {
					this.colors[m] = new RGBColor(Math.random(),Math.random(),Math.random())
					//print('\t '+i+"\t"+m+" valore: "+steps[k][m]+ "\tcolore: "+this.colors[m]);
					groupArray[m] = new Group();
					groupArray[m].name = m;
					i++;
				}
			}
		}
	}
}