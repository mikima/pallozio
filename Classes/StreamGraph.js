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
	this.proportional = false;
	this.ranked = false;
	this.barDistance = 80;
	this.scale = 1;
	this.hscale = 1;
	this.colors = {};
	this.linkType = 'stream';
	this.valign = 'center';
	
	//default indexes for values, see @askMapping or @mapping
	this.stepsIndex = 0;
	this.clustersIndex = 1;
	this.valuesIndex = 2;
	this.rankIndex = 3;
	this.spaceIndex = 4;

	//variables used in @initialize function
	
	var steps = {};
	var stepPositions = {};
	var stepsNumber = 0;
	var groupArray = {};
	
	//variable used for horizontal scaling
	var minDist = Infinity;
	var maxDist = -Infinity;
	
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
					components[variableName+"_check"] = { type: 'checkbox', label: 'Enable ' + variableName, onChange: function(value) {components[variableName].enabled = value; this.proportional = value}};
				}
		}
		
		checkValues('steps', this.stepsIndex, 0);
		checkValues('clusters', this.clustersIndex, 1);
		checkValues('values', this.valuesIndex, 2);
		checkValues('rank', this.rankIndex, 3, true);
		checkValues('space', this.spaceIndex, 4, true);
		
		var values = Dialog.prompt('Map table', components);
		this.stepsIndex = values.steps;
		this.clustersIndex = values.clusters;
		this.valuesIndex = values.values;
		this.rankIndex = values.rank;
		this.spaceIndex = values.space;
		this.proportional = values.space_check;
		this.ranked = values.rank_check;
		
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
		
		// horizontal scale. note that if the width is less than the space needed by all the bars, 
		// bars width will be set to 0.
		if(stepsNumber * this.barWidth > this.width)
		{
			this.barWidth = 0;
			Dialog.prompt('Warning', 'Visualization width is too small to contain all bars. Bars width will be set to 0');
		}
		
		//if user set a variable for distance, we compute the horizontal scale
		if (this.proportional == true)
		{
			// ok we can calculate
			// since the 'horizontal spacing' variable is meant to be incremental
			// (describing the distance from the origin and not from the previous step)
			// the total space is the visualization width minus last bar.
			var flowsSpace = this.width - this.barWidth;
			
			//get the maximum and minimum value
			for(var i in data)
			{
				data[i][this.spaceIndex] = parseFloat(data[i][this.spaceIndex]);
				if(data[i][this.spaceIndex] > maxDist)
				{
					maxDist = data[i][this.spaceIndex];
				}
				if(data[i][this.spaceIndex] < minDist)
				{
					minDist = data[i][this.spaceIndex];
				}
			}
			//get scale
			this.hscale = flowsSpace / (maxDist - minDist);
		}
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
		
		//ranking
		var steprank = 0;
		//draw all rectangles
		for ( k in steps ) {

			//not a nice solution.
			steprank ++;
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
			
			//var i = 0; //probably not used
			
			for(m in steps[k]) {
				
				//
				if(this.proportional == true)
				{
					x = (stepPositions[k] - minDist) * this.hscale;
				}
			
				if (streams[m]){
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m].value*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				} else {
					streams[m] = new Array();
					streams[m].push(Path.Rectangle(x,y,l,steps[k][m].value*scale));
					groupArray[m].appendTop(streams[m][streams[m].length-1]);
				}
				streams[m][streams[m].length-1].fillColor = this.colors[m];
				streams[m][streams[m].length-1].steprank = steprank;
				
				var rett = streams[m][streams[m].length-1];
				var textItem = new PointText(new Point(rett.bounds.x, rett.bounds.y+rett.bounds.height/2));
				textItem.content = m;
				textItem.paragraphStyle.justification = 'right';

				y += steps[k][m].value*scale + yd;
			}
			if(this.proportional == false)
			{
				x += xd+l;
			}
			y = this.y + this.height/2;
		}
		
		//draw links
		
		for ( s in streams) {
			for(var i=1;i<streams[s].length;i++){
				//each rectangle has its own 'steprank' variable.
				//the variable define the step each rectangle belongs to.
				//it is cremental, so we can check if two rectangles are consequential
				//and draw a link between them
				if(streams[s][i].steprank - streams[s][i-1].steprank == 1)
				{
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
		var rank = this.rankIndex;
		var space = this.spaceIndex;
		
		//creates the step/categories map
		
		for(var i in this.data)
		{
			if (!steps[this.data[i][step]])
			{
				stepPositions[this.data[i][step]] = parseFloat(this.data[i][space]);
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
			
			if(this.ranked == true)
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