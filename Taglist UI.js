include('Classes/CsvReader.js');
include('Classes/Taglist.js');

var data = new CsvReader().askProperties().getData();

var tl = new Taglist(data);

tl.askValues().askColors().draw();