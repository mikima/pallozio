function Pendulum(data)
{
	var map = {};
	var colors = {};
	var props = {};
	var maxs = {};
	props.x = 0;
	props.y = 0;
	props.width = 1000;
	props.vpad = 20;
	
	//get dataset keys
	var keys = [];
	for(var i in data[0])
	{
		keys.push(i);
	}
	
	this.askMapping = function()
	{
		var components = {};		
		// check if all the variables are defined
		function checkValues(variableName, defaultValue)
		{
				components[variableName] = { type:'list', label:(variableName+' column index'), options: keys, value: keys[defaultValue]};
		}
		
		checkValues('names',0);
		checkValues('ranking_cat1',1);
		checkValues('ranking_cat2',2);
		checkValues('values_cat1',3);
		checkValues('values_cat2',4);
		
		map = Dialog.prompt('Map table', components);
		
		//initialize
		maxs.ranking_cat1 = -Infinity;
		maxs.ranking_cat2 = -Infinity;
		maxs.values_cat1 = -Infinity;
		maxs.values_cat2 = -Infinity;
		
		for(var i in data)
		{
			var item = data[i];
			
			var r1 = parseFloat(item[map.ranking_cat1]);
			var r2 = parseFloat(item[map.ranking_cat2]);
			var v1 = parseFloat(item[map.values_cat1]);
			var v2 = parseFloat(item[map.values_cat2]);
			
			maxs.ranking_cat1 = r1 > maxs.ranking_cat1 ? r1 : maxs.ranking_cat1;
			maxs.ranking_cat2 = r2 > maxs.ranking_cat2 ? r2 : maxs.ranking_cat2;
			maxs.values_cat1 = v1 > maxs.values_cat1 ? v1 : maxs.values_cat1;
			maxs.values_cat2 = v2 > maxs.values_cat2 ? v2 : maxs.values_cat2;
		}
		print(maxs.ranking_cat1);
		print(maxs.ranking_cat2);
		print(maxs.values_cat1);
		print(maxs.values_cat2);
		
		return this;
	}
	
	this.askSizes = function(){
		
		var components = {};
		components.x = { type:'number', label:'X position', value:props.x};
		components.y = { type:'number', label:'Y position', value:props.y};
		components.width = { type:'number', label:'Width', value: props.width};
		components.vpad = { type:'number', label:'Vertical Padding', value: props.vpad};
		
		props = Dialog.prompt('Set Sizes', components);
		
		return this;
	}
	
	this.draw = function()
	{
		var ypos = props.y;
		var middle = props.width/2;
		
		var middleline = new Path.Line(props.x + middle, props.y, props.x + middle, data.length*props.vpad);
		
		
		for(var i in data)
		{
			var item = data[i];
			var x1 = props.x + middle - (item[map.ranking_cat1] / maxs.ranking_cat1 * middle);
			var x2 = props.x + middle + (item[map.ranking_cat2] / maxs.ranking_cat2 * middle);
			
			var l = new Path.Line(x1,ypos,x2,ypos);
			var c1 = new Path.Circle(x1, ypos, item[map.values_cat1] / maxs.values_cat1 * props.vpad / 2);
			var c2 = new Path.Circle(x2, ypos, item[map.values_cat2] / maxs.values_cat2 * props.vpad / 2);
			
			ypos += props.vpad;
		}
	}
}