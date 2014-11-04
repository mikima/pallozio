include('Classes/CsvReader.js');
include('Classes/Pendulum.js');

var data = new CsvReader().askProperties().getData();

var pl = new Pendulum(data);

pl.askMapping().askSizes().draw();