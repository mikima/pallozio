include('../Classes/CsvReader.js');
include('../Classes/StreamGraphCategories.js');


var data = new CsvReader().askProperties().getData();

var sg = new StreamGraph(data).askMapping().askVisuals().initialize().askColors();