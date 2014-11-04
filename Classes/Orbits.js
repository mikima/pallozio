function Orbits(data)
{
	var map = {};
	var props = {};
	var colors = {};
	var angles = {};
	props.minOrb = 50;
	props.maxOrb = 200;
	props.minPlan = 5;
	props.maxPlan = 10;
	var catnumber = 0;
	
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
		checkValues('orbits',1);
		checkValues('sizes',2);
		checkValues('colors',3);
		map = Dialog.prompt('Map table', components);
		return this;
	}
	
	this.askColors = function()
	{
		for(var i in data)
		{
			var item = data[i][map.colors];
			if(! colors.has(item))
			{
				colors[item] = new CMYKColor(Math.random(),Math.random(),Math.random(),0);
				catnumber++;
			}
		}
		
		var components = {};
		for(var c in colors) {
			components[c] = { type:'color', label:c, value:colors[c]};
		}
		
		var values = Dialog.prompt('Set Colors', components);
		
		var count = 0;
		
		for(var item in colors) {
			colors[item] = values[item];
			angles[item] = count * (Math.PI*2/catnumber);
			print(count+ ' ' +item+": "+angles[item]);
			count++;
		}
		
		print(angles);
		
		return this;
	}
	
	this.draw = function()
	{
		var orbits_paths = new Group();
		for(var i in data)
		{
			var item = data[i];
			var name = item[map.names];
			var orbit_r = item[map.orbits];
			var circle_r = item[map.sizes];
			
			var orbit = new Path.Circle(0,0,orbit_r);
			var g = new Group();
			var angle = angles[item[map.colors]];//Math.random()*i;//Math.random()*Math.PI*2;
			var planet_x = Math.cos(angle)*orbit_r;
			var planet_y = Math.sin(angle)*orbit_r;
			var planet = new Path.Circle(planet_x,planet_y,circle_r);
			var text = new PointText(new Point(planet_x, planet_y));
			
			text.content = name;
			text.paragraphStyle.justification = 'center';
			g.appendTop(planet);
			g.appendTop(text);
			g.name = name;
			g.data.c_orbit = orbit_r;
			g.data.c_angle = angle;
			
			orbits_paths.appendTop(orbit);
			
			orbit.fillColor = null;
			orbit.strokeColor = '#aaa';
			planet.fillColor = colors[item[map.colors]];
			planet.strokeColor = null;
			text.fillColor = '#000';
			text.strokeColor = null;
		}
	}
}