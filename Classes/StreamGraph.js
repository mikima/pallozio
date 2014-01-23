/**
 * 
 * @class Creates a streamgraph.
 *
 * @author Michele Mauri
 * @version 0.2
 * 
 * v 0.2
 * - added the vertical alignment option
 * - rewrote the sorting function for objects, now it supports ranking
 *
 * @param {Object[]} data a collection (an array of objects)
 */

include('Utils/Link.js');

function StreamGraph(data){
	
	
	this.data = data ? data : print('you must define a Collection (Array of Objects)');

	this.x = 0;
	this.y = 0;
	this.width = 1000;
	this.height = 500;
	this.barWidth = 10;
	this.barPadding = 5;
	this.barDistance = 80;
	this.scale = 1;
	this.colors = {};
	this.linkType = 'stream';
	this.valign = 'center';
	
	//default indexes for values, see @askMapping or @mapping
	this.stepsIndex = 0;
	this.clustersIndex = 1;
	this.valuesIndex = 2;
	this.rankIndex = 3;
	this.rankSpacing = 4;

	//variables used in @initialize function
	
	var steps = {};
	var stepsNumber = 0;
	var groupArray = {};

	
	/*
	 * sort the cluster inside a step
	 * @param {Object[]} aImput an array
	 */
	

	this.sortAssoc = function(aInput) {
		var aTemp = [];
		for (var sKey in aInput)
		aTemp.push([sKey, aInput[sKey]]);
		aTemp.sort(function () {return arguments[1][1] - arguments[0][1]});
		var aOutput = [];
		
		for (var nIndex = 0; nIndex < aTemp.length; nIndex++)
		aOutput[aTemp[nIndex][0]] = aTemp[nIndex][1];
	
		return aOutput;
	}
	
	/*
	 * sort the cluster inside a step according to a value
	 * @param {Object[]} aImput an array
	 */
	

	this.sortOn = function(aInput, rankValue, inverse) {
		var aTemp = [];
		for (var sKey in aInput)
		{
			aTemp.push({name: sKey, obj: aInput[sKey]});
		}
		if(inverse == true)
		{
			aTemp.sort(function (a,b) {return b.obj[rankValue] - a.obj[rankValue]});
		}
		else
		{
			aTemp.sort(function (a,b) {return a.obj[rankValue] - b.obj[rankValue]});
		}
		var aOutput = [];
		
		for (var i in aTemp)
		{
			aOutput[aTemp[i].name] = aTemp[i].obj;
		}
	
		return aOutput;
	}
	
	/*
	 * Get the scale according to the visualization size
	 */
	
	this.getScale = function() {
		var tempVals = {};
		for(var k in steps){
			tempVals[k] = {size:0, groups:0};
			
			for(var m in steps[k]){
				tempVals[k].size += parseFloat(steps[k][m].value);
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
		
		//get the option list
		var options = [];
		for(var i in data[0])
		{
			options.push(i);
		}
		
		
		// check if all the variables are defined
		function checkValues(variableName, variable, defaultValue, optional)
		{
				components[variableName] = { type:'list', label:(variableName+' column index'), options: options, value: options[defaultValue]};

				if(optional)
				{
					components[variableName].enabled =  false;
					components[variableName].value = 'lamerda';
					components[variableName+"check"] = { type: 'checkbox', label: 'Enable ' + variableName, onChange: function(value) {components[variableName].enabled = value}};
				}
		}
		
		checkValues('steps', this.stepsIndex, 0);
		checkValues('clusters', this.clustersIndex, 1);
		checkValues('values', this.valuesIndex, 2);
		checkValues('rank', this.rankIndex, 3, true);
		//checkValues('spacing', this.rankSpacing, undefined, true);
		
		var values = Dialog.prompt('Map table', components);
		this.stepsIndex = values.steps;
		this.clustersIndex = values.clusters;
		this.valuesIndex = values.values;
		this.rankIndex = values.rank;
		this.spaceIndex = values.spacing;
		//initialize it
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
		components.valign = {type:'list', label:'Vertical alignment', options:['top', 'center', 'bottom'], value:this.valign}
		
		var values = Dialog.prompt('Set Sizes', components);
		
		this.x = values.x;
		this.y = values.y;
		this.width = values.width;
		this.height = values.height;
		this.barPadding = values.barPadding;
		this.barWidth = values.barWidth;
		this.linkType = values.linkType;
		this.valign = values.valign;
		
		this.scale = this.getScale();
		this.barDistance = this.getDistances();
		
	}
	
	/*
	 * Prompt a dialog asking each category color
	 */
	
	this.askColors = function(){
		
		var components = {};
		for(var item in this.colors) {
			components[item] = { type:'color', label:item, value:this.colors[item]};
		}
		
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

			//computes the total size of steps
			var totSize = -yd;
			for(m in steps[k]){
				totSize+=steps[k][m].value*scale+yd;
			}
			
			if(this.valign == 'center')
			{
			y -= totSize/2;
			}
			else if (this.valign == 'bottom')
			{
			y = this.height - totSize;
			}
			else if (this.valign == 'top')
			{
			y = 0;
			}
	
			var stepName = new PointText(new Point(x+l/2,y-yd*2));
			stepName.content = k;
			stepName.paragraphStyle.justification = 'center';
			stepName.characterStyle.fontSize = 16;
			stepName.characterStyle.font = app.fonts['Myriad Pro']['bold'];
			
			var i = 0;
			
			for(m in steps[k]) {
				if (streams[m]){
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m].value*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				} else {
					streams[m] = new Array();
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m].value*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				}
				streams[m][streams[m].length-1].fillColor = this.colors[m];
				
				var rett = streams[m][streams[m].length-1];
				var textItem = new PointText(new Point(rett.bounds.x, rett.bounds.y+rett.bounds.height/2));
				textItem.content = m;
				textItem.paragraphStyle.justification = 'right';

				y += steps[k][m].value*scale + yd;
			}
			x += xd+l;
			y = this.y + this.height/2;
		}
		
		//draw links
		
		for ( s in streams) {
			for(var i=1;i<streams[s].length;i++){
				//1.1 is ugly but sometimes the distance is for unknown reason slightly bigger than the variable.
				//maybe it is due to accuracy level of illustrator drawing. maaybe we fix it with toFixed() function
				if((streams[s][i].bounds.x - streams[s][i-1].bounds.x- l*1.1) <= xd){
					var link = new Link(streams[s][i-1],streams[s][i],this.linkType);
					groupArray[s].appendTop(link.sprite);
					link.sprite.opacity = 0.5;
					link.sprite.blendMode = 'multiply';
				}
			}
		}
	}
	

	/*
	 *	Starting from the data, creates all the needed variables to draw the visualization.
	 *	
	 */
		
	this.initialize = function(){
	
		var step = this.stepsIndex;
		var path = this.clustersIndex;
		var value = this.valuesIndex;
		var rank = this.valuesIndex;
		
		//creates the step/categories map
		
		for(var i in this.data)
		{
			if (!steps[this.data[i][step]])
			{
				steps[this.data[i][step]] = new Array();
				stepsNumber++;
			}
			//create an empty object
			steps[this.data[i][step]][this.data[i][path]] = {};
			steps[this.data[i][step]][this.data[i][path]].value = parseFloat(this.data[i][value]);
			steps[this.data[i][step]][this.data[i][path]].rank = parseFloat(this.data[i][rank]);
		}
		
		//sort and create a color for each category
		
		var i = 0;
		
		for ( k in steps ) {

			//sort each step elements
			
			if(rank != value)
			{
				steps[k] = this.sortOn(steps[k],'rank', false);
			}
			else
			{
				steps[k] = this.sortOn(steps[k],'value', true);
			}
			
			for(m in steps[k]) {
				if(!this.colors[m]){

					// create a random color for each step
					this.colors[m] = new RGBColor(Math.random(),Math.random(),Math.random())
					groupArray[m] = new Group();
					groupArray[m].name = m;
					i++;
				}
			}
		}
	}
}