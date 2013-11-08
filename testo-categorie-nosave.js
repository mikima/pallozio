var keywords = {
mente: [/realta/gi,/mente/gi,/alienazione/gi,/telepat./gi,/telecinetic./gi,/poter. paranormal./gi,/semi-vita/gi,/moratorium/gi,/cervello/gi,/identitˆ/gi,/memoria/gi,/cancellato/gi,/paranoia/gi,/sensitivi/gi,/follia/gi,/psiche/gi,/schizofrenia/gi,/autismo/gi,/entropia/gi],

potere: [/affar./gi,/guerr./gi,/esercit./gi,/govern./gi,/elezion./gi,/controllo/gi,/presidente/gi,/alleat./gi,/Casa Bianca/gi,/first lady/gi,/democrazia/gi,/CIA/gi,/propaganda/gi,/minacci./gi,/bomb./gi,/leader/gi,/agenzi./gi,/complott./gi,/dittatur./gi,/ideologi./gi,/nazist./gi,/imperialismo/gi,/difesa/gi,/polizia/gi,/razz./gi,/multinazional./gi,/sicurezza/gi],

spazio: [/astronaut./gi,/creatur./gi,/mond./gi,/coloni./gi,/astronav./gi,/marzian./gi,/spazio/gi,/viaggio nello spazio/gi,/alien./gi,/ufo/gi,/esplorator./gi,/umanoid./gi],

droga: [/drog[ahe]/gi,/tossicodipendent./gi,/allucinazion./gi,/acid./gi,/narcotic./gi,/effett. tossic./gi,/illegal./gi,/coscienza/gi],

spirito: [/cult. religios./gi,/cult./gi,/profet[a-z]+/gi,/prevedere/gi,/futuro/gi,/passato/gi,/tempo/gi,/rivelazione/gi,/teoria/gi,/simulacr./gi,/vision./gi,/medium/gi,/magi./gi,/poteri/gi,/resuscitare/gi,/morte/gi,/Dio/gi,/intelligenza divina/gi,/veritˆ/gi,/trasmigrazion./gi,/divin[a-z]+/gi],

tecno: [/robot/gi,/(an)?droid./gi,/nucleare/gi,/television./gi,/computer/gi,/hi-fi/gi,/macchina del tempo/gi,/scienziat./gi,/gioc[ohi]/gi,/cyborg/gi,/macchin./gi,/radioattiv[a-z]+/gi,/tecnologi./gi,/teletrasport[a-z+]/gi,/informazion./gi,/videotelefon./gi,/dati/gi,/telecamer./gi]
}

var components = {
    largh: { type: 'number', label: 'Largezza della colonna', value:46.6243, units:'millimeter' },
    dist: { type: 'number', label: 'Distanza tra le righe', value:2 },
    scala: { type: 'number', label: 'Scala (caratteri per pixel)', value:124.477418 },
    peso: { type: 'number', label: 'Spessore della linea', value:1 },
    none: { type: 'color', label: 'Nessuna cat.',     value:new CMYKColor(0.00, 0.00, 0.00, 0.20) },
    mente: { type: 'color', label: 'cat. Mente',      value:new CMYKColor(0.43, 0.00, 0.14, 0.21) },
	potere: { type: 'color', label: 'cat. Potere',    value:new CMYKColor(1.00, 0.62, 0.00, 0.52) },
	spazio: { type: 'color', label: 'cat. Spazio',    value:new CMYKColor(0.10, 0.00, 1.00, 0.11) },
	droga: { type: 'color', label: 'cat. Droga',      value:new CMYKColor(0.88, 0.24, 1.00, 0.11) },
	spirito: { type: 'color', label: 'cat. Spirito',  value:new CMYKColor(0.00, 0.42, 0.96, 0.00) },
	tecno: { type: 'color', label: 'cat. Tecnologia', value:new CMYKColor(0.00, 0.96, 0.29, 0.00) },
};

var varbs = Dialog.prompt('Variabili',components);

var larghezza = varbs.largh;
var distanza = varbs.dist;
var scala = varbs.scala;
var xpos = 0;
var ypos = 0;
var res = 0;

var colors ={
	none:varbs.none,
	mente:varbs.mente,
	potere:varbs.potere,
	spazio:varbs.spazio,
	droga:varbs.droga,
	spirito:varbs.spirito,
	tecno:varbs.tecno
}

var textOut = ""

var dataSource = Dialog.fileOpen('Select the source file');
var dataString = "";

dataSource.open();

while(line = dataSource.readln()) {
			//dataString += line+" ";
			analisi(line);
			xpos = 0;
			ypos += distanza*3;
}


function analisi(capitolo){
	
	var frasi = capitolo.split(".");
	
	for(var i in frasi){
		
		var cat = false;
		
		var totali = {};
		
		for(var tema in keywords){
			//faccio il totale epr ogni frase
			var tot = 0;
			
			for(var j in keywords[tema]){
				var results = frasi[i].match(keywords[tema][j]);
				
				if(results != null){
					
					tot += results.length;
					print(results.length+": "+results);
				}
			}
			totali[tema] = tot;
		}
		
		var max = 0;
		var maxName = "none";
		
		var lineaout = "";
		
		for(var tema in totali){
		
			lineaout += totali[tema]+"\t";
			
			if(totali[tema]>max){
				
				max = totali[tema];
				maxName = tema;
			}
		}
		print('frase '+i+": "+lineaout);
		textOut += i+"\t"+lineaout+"\r";
		addChars(frasi[i].length,colors[maxName],i);
	}
}
//salvo il file

var file = new File(script.file.parent, 'results.tsv');
print(file);
// If file exists, we need to remove it first in order to overwrite its content.
if (file.exists())
    file.remove();
file.open();
file.write(textOut);
file.close();
print('salvato');


function addChars(chars, color,ciclo){
	
	//con arrotondamento
	var totLarg = Math.round(chars/scala);
	//no round
	//var totLarg = chars/scala;
	
	print('totLarg: '+totLarg);
	
	if(totLarg<res){
			
		//print('xpos: '+xpos);
		
		var l = Path.Line(xpos, ypos, xpos+totLarg, ypos);
		l.strokeColor = color;
		l.fillColor = null;
		l.strokeWidth = 1;
		
		l.name = ciclo;
		
		xpos += totLarg;
		res -= totLarg;
		//print('res: '+res);
		if(res == 0){
			ypos += distanza;
		}
	} else {
		
		if(res >0){
			//print('riempio la differenza di '+res+', resta '+(totLarg-res));
			//print('xpos: '+xpos);
			var l = Path.Line(xpos, ypos, larghezza, ypos);
			l.strokeColor = color;
			l.fillColor = null;
			l.strokeWidth = 1;
			
			l.name = ciclo;
			
			totLarg -= res;
			res = 0;
			ypos += distanza;
			xpos = 0;
			
		}

	
		var lines = Math.floor(totLarg/larghezza);
		
		print('disegno righe: '+lines);
		
		for(var i=0; i<lines; i++){
			
			//print('disegno riga '+i+"/"+lines)
			var l = Path.Line(xpos, ypos, larghezza, ypos);
			l.strokeColor = color;
			l.fillColor = null;
			l.strokeWidth = 1;
			
			l.name = ciclo;
			
			ypos += distanza;
			xpos = 0;
		}
		
		//controllo residuo
		var remain = totLarg - lines*larghezza;
		//print('remains: '+remain)
		
		if(remain>0){
			var l = Path.Line(xpos, ypos, remain, ypos);
			l.strokeColor = color;
			l.fillColor = null;
			l.strokeWidth = 1;
			
			l.name = ciclo;
			
			xpos = remain;
			
			res = larghezza - remain;
			//print('res: '+res);
		}
	}
	//l.name = ciclo;
}
