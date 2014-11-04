include('Classes/CsvReader.js');
include('Classes/GlyphRepeater.js');

var data = new CsvReader().askProperties().getData();

var gp = new GlyphRepeater(data);

gp.askLabels().askColors().draw();