function Taglist(data)
{
	var map = {};
	var colors = {};
	var props = {};
	props.minSize = 5;
	props.maxSize = 30;
	props.padding = 3;
	props.output = 'PointText'
	props.font = app.fonts['Roboto Condensed']['Regular'];
	var valueBounds = {min:Infinity, max: -Infinity};
	
	//get dataset keys
	var keys = [];
	for(var i in data[0])
	{
		keys.push(i);
	}
	
	this.askValues = function()
	{
		var components = {};		
		// check if all the variables are defined
		function checkValues(variableName, defaultValue)
		{
				components[variableName] = { type:'list', label:(variableName+' column index'), options: keys, value: keys[defaultValue]};
		}
		
		checkValues('names',0);
		checkValues('sizes',1);
		checkValues('colors',2);
		map = Dialog.prompt('Map table', components);
		
		//create colors, get min and maximum
		for(var i in data)
		{
			var item = data[i][map.colors];
			var size = parseFloat(data[i][map.sizes]);
			valueBounds.min = size < valueBounds.min ? size : valueBounds.min;
			valueBounds.max = size > valueBounds.max ? size : valueBounds.max;
			
			if(! colors.has(item))
			{
				colors[item] = new CMYKColor(Math.random(),Math.random(),Math.random(),0);
			}
		}
		
		return this;
	}
	
	this.askColors = function()
	{
		
		
		var components = {};
		for(var c in colors) {
			components[c] = { type:'color', label:c, value:colors[c]};
		}
		
		var values = Dialog.prompt('Set Colors', components);
		
		for(var item in colors) {
			colors[item] = values[item];
		}
		
		return this;
	}
	
	this.draw = function()
	{
		if(props.output == 'PointText')
		{
			var x = 0;
			var y = 0;
			for(var i in data)
			{
				var item = data[i];
				var size = (item[map.sizes] - valueBounds.min) / (valueBounds.max - valueBounds.min) * (props.maxSize - props.minSize) +props.minSize;
				y += size + props.padding;
				var t = new PointText(new Point(x,y));
				t.content = item[map.names];
				t.characterStyle.font = props.font;
				t.characterStyle.fontSize = size;
				t.characterStyle.fillColor = colors[item[map.colors]];
			} 
		}
		else if(props.output == 'AreaText')
		{
			var area = new AreaText(new Rectangle(0,0,300,1000));
			
			var cursor = 0;
			for(var i in data)
			{
				var item = data[i];
				var name = item[map.names];
				//add text
				area.content += name +"\r";
			}
			area.characterStyle.font = props.font;
			var p = 0;
			for(var i in data)
			{
				var item = data[i];
				var size = (item[map.sizes] - valueBounds.min) / (valueBounds.max - valueBounds.min) * (props.maxSize - props.minSize) +props.minSize;
				var subRange = area.range.paragraphs[p];
				//print(">"+subRange.content+"< "+size+" "+colors[item[map.colors]]);
				subRange.characterStyle.fontSize = size;
				subRange.characterStyle.fillColor = colors[item[map.colors]];
				p++;
			}
		}
	}
}