//converts from alpha to patter
include('../Classes/Utils/Pattern.js');

//get selected objects

var values = {
					type: 'Lines Pattern',
					size: 5,
					rotation: 45,
					minSize: .75
		}

var components = {
	type: { type: 'list', label:'Pattern type', options:['Lines Pattern', 'Circles Pattern', 'Squares Pattern']},
	ruler1: { type: 'ruler'},
	size: { type: 'number', label: 'Width', units: 'point', steppers: true },
	rotation: { type: 'number', label: 'Rotation', units: 'degree' },
	minSize: { type: 'number', label: 'Minimum value'}
}

Dialog.prompt('New Pattern',components, values);


var paths = document.selectedItems;
var colors = [];

for(var i = 0; i< paths.length; i++){
	colors[i] = paths[i].fillColor;
}


//for each path
for(var i = 0; i< paths.length; i++){
	
	var path = paths[i];
	
	var alpha = (path.opacity - 0.3) / 0.7 + 0.1;
	
	alpha = alpha<values.minSize/values.size ? values.minSize/values.size : alpha;
	
	print(alpha);
	//get the color
	var color = colors[i];
	
	//remove colors
	path.fillColor = null;
	path.strokeColor = null;
	//document.currentStyle.fillColor = null;
	//document.currentStyle.strokeColor = null;
	
	//create a pattern
	
	var pattern = {};
	
	switch (values.type){
			case 'Lines Pattern':
				pattern = PatternLine(values.size,alpha,values.rotation,color);
				break;
			
			case 'Circles Pattern':
				pattern = PatternCircle(values.size,alpha,values.rotation,color);
				break;
			
			case 'Squares Pattern':
				pattern = PatternSquare(values.size,alpha,values.rotation,color);
				break;
			
			default:
				pattern = '#A7A9AC';
		}
	
	path.opacity = 1;
	path.fillColor = pattern;
	
}