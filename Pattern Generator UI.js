include('../Classes/Utils/Pattern.js');

var values = {
					type: 'Lines Pattern',
					size: 5,
					rotation: 45,
					density: 50,
					color: '#ff0000'
		}


var preview = new Path.Rectangle(0,0,100,100);
preview.strokeColor = null;
preview.fillColor = PatternLine(values.size,values.density/100,values.rotation,values.color);

var rectNum = 1;



var components = {
	type: { type: 'list', label:'Pattern type', options:['Lines Pattern', 'Circles Pattern', 'Squares Pattern']},
	ruler1: { type: 'ruler'},
	size: { type: 'number', label: 'Width', units: 'point', steppers: true },
	rotation: { type: 'number', label: 'Rotation', units: 'degree' },
	density: { type: 'number', label: 'Density', units: 'percent' },
	color: { type: 'color', label: 'Color' },
	newPreview: { type:'button', value:'Create New' ,fullSize: true, onClick:function(){
		preview = new Path.Rectangle(0+rectNum*100,0,100,100);
		rectNum++; 
		preview.strokeColor = null;
		preview.fillColor = '#A7A9AC'
		} }
}

var palette = new Palette('New Pattern',components, values);

palette.onChange = function(comp){
		switch (values.type){
			case 'Lines Pattern':
				preview.fillColor = PatternLine(values.size,values.density/100,values.rotation,values.color);
				break;
			
			case 'Circles Pattern':
				preview.fillColor = PatternCircle(values.size,values.density/100,values.rotation,values.color);
				break;
			
			case 'Squares Pattern':
				preview.fillColor = PatternSquare(values.size,values.density/100,values.rotation,values.color);
				break;
			
			default:
				preview.fillColor = '#A7A9AC';
		}
	}