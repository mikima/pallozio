/**
 * 
 * Create the interface to generate patterns.
 * 
 * @author Michele Mauri
 * @version 0.1.1
 *
 */

include('Classes/Utils/Pattern.js');



/**
 *	get all the paths and updates their fill with the new pattern.
 *
 */

function updatePatterns(_pattern)
{
	var selectedPaths = document.getItems({
    type: Path,
    selected: true
	});
	
	for(p in selectedPaths)
	{
		selectedPaths[p].fillColor = _pattern;
	}
}

//creates the interface: components, values, an then palette.

var components = {
	type: { type: 'list', label:'Pattern type', options:['Lines Pattern', 'Circles Pattern', 'Squares Pattern']},
	ruler1: { type: 'ruler'},
	size: { type: 'number', label: 'Width', units: 'point', steppers: true },
	rotation: { type: 'number', label: 'Rotation', units: 'degree' },
	density: { type: 'number', label: 'Density', units: 'percent' },
	color: { type: 'color', label: 'Color' }
}

var values = {
					type: 'Lines Pattern',
					size: 5,
					rotation: 45,
					density: 50,
					color: '#ff0000'
		}

var palette = new Palette('New Pattern',components, values);

//updatePatterns(PatternLine(values.size,values.density/100,values.rotation,values.color));

palette.onChange = function(comp){
		switch (values.type){
			case 'Lines Pattern':
				updatePatterns(PatternLine(values.size,values.density/100,values.rotation,values.color));
				break;
			
			case 'Circles Pattern':
				updatePatterns(PatternCircle(values.size,values.density/100,values.rotation,values.color));
				break;
			
			case 'Squares Pattern':
				updatePatterns(PatternSquare(values.size,values.density/100,values.rotation,values.color));
				break;
			
			default:
				preview.fillColor = '#A7A9AC';
		}
	}