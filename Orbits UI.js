include('Classes/CsvReader.js');
include('Classes/Orbits.js');

var data = new CsvReader().askProperties().getData();

var or = new Orbits(data);

or.askValues().askColors().draw();

var o = new Point(0,0);