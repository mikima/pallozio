include('../Classes/CsvReader.js');
include('../Classes/PseudoClash-Bipallozzo.js');

var data = new CsvReader().askProperties().askParsing().getData();

var pc = new PseudoClash(data).askDimension().askMapping().draw();