include('../Classes/CsvReader.js');
include('../Classes/BipartiteGraph.js');


var data = new CsvReader().askProperties().askParsing().getData();

//REMOVE test lines, to be removed

include('../Classes/CredibleData.js');
/*var data = new CredibleData().addList('social',['facebook','linkedin','badoo','google+','friendfeed'])
							 .addList('states',['italy','portugal','spain','taiwan','us','uk'])
							 .addInt('users', 0, 100000000)
							 .population(30)
							 .generate();
print(Json.encode(data));
*/
//END REMOVE

var bg = new BipartiteGraph(data).askMapping().askVisuals().askOrder().askColors().draw();