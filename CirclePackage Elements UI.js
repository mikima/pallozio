include('../Classes/CsvReader.js');
include('../Classes/CirclePackage.js');
include('../Classes/underscore.js');

var data = new CsvReader().askProperties().askParsing().getData();


//REMOVE
include('../Classes/CredibleData.js')

/*
var data = new CredibleData().addFloat('weight',10,200)
							 .addList('name',['paolo','michele','luca','giorgio','donato','mario'])
							 .population(50)
							 .generate();
*/

//ion questo caso, si itera nei dati per crteare la visualizzazione

var cp = new CirclePackage();

cp.askProperties();

//ask mapping
var components = {};
var map = {label:'', size:'', color:'',alpha:''};
var labels = {label:'Circles Label', size:'Circles size', color:'Circles colors', alpha:'Circles opacity'};
		
//get the option list using Underscore.js
var options = _.keys(data[0]);
		

//this cycle creates all the elements basing on the map
var mapIndex = 0;
for ( var i in map ){
	components[i] = { type:'list', label:(labels[i]+' column index'), options: options, value: options[mapIndex]}
	mapIndex++;
}

map = Dialog.prompt('Map table', components);

for(var i in data){
	
	var diameter = Math.sqrt((4*data[i][map.size])/Math.PI);
	
	cp.addCircle(data[i][map.size],data[i][map.label]);
	
}

cp.update().draw();