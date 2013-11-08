include('../Classes/CsvReader.js');
include('../Classes/ScatterPlot.js');


var data = new CsvReader().askProperties().askParsing().getData();


//test lines, to be removed
//include('../Classes/CredibleData.js');

//var data = new CredibleData().addFloat('the_x',0,1).addFloat('the_y',0,400).addFloat('the_size',50,600).addFloat('the_color',30,40).population(100).generate();
print(Json.encode(data));

var sp = new ScatterPlot(data).askMapping().askVisuals().setScales().draw();