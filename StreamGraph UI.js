include('../Classes/CsvReader.js');
include('../Classes/StreamGraph.js');


var data = new CsvReader().askProperties().askParsing().getData();

var sg = new StreamGraph(data);

sg.askAll();
sg.draw();