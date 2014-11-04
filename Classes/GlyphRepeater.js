function GlyphRepeater(data)
{
	//local variables
	var colors = {};
	var labelIndex = '';
	var width = 2;
	var height = 10;
	var padding = 1;
	var vpadding = 5;
	var showGroups = true;
	
	//get dataset keys
	var keys = [];
	for(var i in data[0])
	{
		keys.push(i);
	}
	
	//ask labels
	this.askLabels = function()
	{
		var components = {};		
		// check if all the variables are defined
		function checkValues(variableName, defaultValue, optional)
		{
				components[variableName] = { type:'list', label:(variableName+' column index'), options: keys, value: keys[defaultValue]};
				if(optional)
				{
					components[variableName].enabled =  false;
					components[variableName+"_check"] = { type: 'checkbox', label: 'Enable ' + variableName, onChange: function(value) {components[variableName].enabled = value; this.proportional = value}};
				}
		}
		
		checkValues('labels',0,false);
		components['showGroups'] = { type:'checkbox', label:'Show groups names', value: true};
		var values = Dialog.prompt('Map table', components);
		labelIndex = values.labels;
		showGroups = values.showGroups;
		return this;
	}
	
	//ask colors
	this.askColors = function()
	{
		var components = {};
		for(var k in keys)
		{
			var item = keys[k];
			if(item != labelIndex)
			{
				print(item);
				components[item] = { type:'color', label:item, value:new CMYKColor(Math.random(),Math.random(),Math.random(),0)};
			}
		}
		
		var values = Dialog.prompt('Set Colors', components);
		
		for(var item in values) {
			colors[item] = values[item];
		}
		return this;
	}
	
	this.draw = function()
	{
		var ypos = 0;
		for(var i in data)
		{
			var g = new Group();
			
			var xpos = 0;
			var item = data[i];
			
			var text = new PointText(new Point(0,ypos+height));
			text.content = item[labelIndex];
			text.paragraphStyle.justification = 'right';
			
			var address = item[labelIndex].match(/ ([0-9]+),/)[1];
			var text_address = new PointText(new Point(padding,ypos+height-1.811));
			text_address.characterStyle.font = app.fonts['Alegreya SC']['Regular'];
			text_address.characterStyle.fontSize = 10;
			text_address.content = address;
			
			var ar = new Path.Rectangle(0,ypos,text_address.bounds.width+padding*2, height);
			ar.fillColor = null;
			ar.strokeWidth = .5;
			ar.strokeColor = '#000';
			
			g.appendTop(ar);
			g.appendTop(text_address);
			
			xpos = ar.bounds.width + padding;
			
			for(var category in colors)
			{
				var numberItems = parseFloat(item[category]);
				if(numberItems > 0)
				{
					for(var n = 0; n <numberItems; n++)
					{
						var r = new Path.Rectangle(xpos,ypos,width,height);
						xpos+= width + padding;
						r.strokeColor = null;
						r.fillColor = colors[category];
						g.appendTop(r);
					}
					if(showGroups)
					{
						var groupName = new PointText(new Point(xpos,ypos+height-1.811));
						groupName.characterStyle.fillColor = colors[category];
						groupName.characterStyle.font = app.fonts['Alegreya SC']['Regular'];
						groupName.characterStyle.fontSize = 12;
						groupName.content = category[0];
						g.appendTop(groupName);
						xpos += groupName.bounds.width + padding;
					}
				}
			}
			ypos += height + vpadding;
			g.name = item[labelIndex];
		}
	}
	
}