//include('underscore.js');
// questa è una versione completamente nuova.
// l'idea è quella di creare semplicemente un parser che restituisce un oggetto.

function CsvReader(){
	
	//datastring contiene il testo da parsare
	var dataString = "";
	//data è l'oggetto creato e restituito dalla funzione createCollection
	var data = [];
	
	hasHeaders = true;
	
	lineDelimiter = '\r';
	cellDelimiter = '\t';
	
	this.hasHeaders = function(_value){
		hasHeaders = _value;
		return this;
	}
	
	this.lineDelimiter = function(_delimiter){
		lineDelimiter = _delimiter;
		return this;
	}
	
	this.cellDelimiter = function(_delimiter){
		cellDelimiter = _delimiter;
		return this;
	}
	
	
	this.askProperties = function(){
		var values = {
						source: 'From Selected Text',
						lineDelimiter: '\\r',
						cellDelimiter: '\\t',
						hasHeaders: true
					 };
		
		var components = { source: {type: 'list', label: 'Data Source', options: ['From File', 'From Selected Text']},
						   lineDelimiter: {type:'string', label:'Line Delimiter'},
						   cellDelimiter: {type:'string', label:'Cell Delimiter'},
						   hasHeaders: {type:'boolean', label:'First Line is header'}
						 }
		
		var values = Dialog.prompt('Set Data Variables', components, values);
		
		lineDelimiter = new RegExp(values.lineDelimiter);
		cellDelimiter = new RegExp(values.cellDelimiter);
		hasHeaders = values.hasHeaders;
			
		// a seconda del valore di values.source (definito dall'utente)
		// carico da file o da selezione
		if(values.source=='From File'){
			this.readFromFile();
		} else {
			this.readFromSel();
		}
		
		return this;
	}
	
	this.askParsing = function(){
		//non voglio utilizzare underscore
		//var keys = _.keys(data[0]);
		var keys = [];
		for(var i in data[0])
		{
			keys.push(i);
		}
		
		var components = {};
		
		for(var key in keys) {
			//probably due the way scriptographer handles components, we cannot give them a
			//name starting with a number.
			//we will add an underscore _ to each component's name.
			components['_'+keys[key]] = { type:'boolean', label:keys[key], value:false};
			print('comp '+keys[key]+': '+components['_'+keys[key]].label)
		}
		
		var values = Dialog.prompt('Select columns containing numbers',components);
		
		for(var i in values){
			if (values[i] == true){
				this.parseProperty(i.replace('_',''));
			}
		}
		
		return this;
	}
	
	/*
	 * Metodo per chiedere tramite palette tutte le variabili necessarie.
	 * Al momento presenta un sacco di problemi, perchè non è ancora stato identificato
	 * il modo migliore per gestire gli eventi associati alla mdoifica dei valori.
	 * In sintesi, meglio non usarla.
	 */
	/*
	this.askAll = function(){
		
		var values = {
						source: 'From Selected Text',
						lineDelimiter: '\\r',
						cellDelimiter: '\\t',
						hasHeaders: true
					 };
		
		var components = { source: {type: 'list', label: 'Data Source', options: ['From File', 'From Selected Text']},
						   lineDelimiter: {type:'string', label:'Line Delimiter'},
						   cellDelimiter: {type:'string', label:'Cell Delimiter'},
						   hasHeaders: {type:'boolean', label:'First Line is header'},
						   update: {type:'button', value:'Update'}
						 }
		
		var palette = new Palette('Data Loader', components, values);
		
		
		// tutta la funzione è parecchio ritorta su se stessa, in attesa di applicaer il modello MVC
		
		// TODO: far tutto questo in modo sensato
		// aggiungo tutto l'oggetto CSV come proprietà di palette.components,
		// così ci posso accedere internamente dal onClick.
		// tutto questo perchè non so come raccogliere gli eventi, bisognerà capirlo
		
		palette.components.update.myCsv = this;
		
		palette.components.update.onClick = function(){
			//passo i valori della palette (values) all'oggetto csv
			this.myCsv.lineDelimiter = new RegExp(values.lineDelimiter);
			this.myCsv.cellDelimiter = new RegExp(values.cellDelimiter);
			this.myCsv.hasHeaders = values.hasHeaders;
			
			// a seconda del valore di values.source (definito dall'utente)
			// carico da file o da selezione
			if(values.source=='From File'){
				this.myCsv.readFromFile();
			} else {
				this.myCsv.readFromSel();
			}
		}
	}
	*/
	
	/*
	 * Metodo per leggere da una selezione di testo.
	 * La funzione crea la variabile datastring, dopodichè
	 * chiama la funzione @creteCollection, popola l'oggetto data
	 * e restituisce sé stesso in modo da impostare una monade (si dice impostare?)
	 */
	
	this.readFromSel = function(){
		
		//svuoto la datastring
		dataString='';
	
		// controllo se c'è una selezione
		// e se nella selezione c'è un testo
		if(document.selectedItems[0] == undefined || document.selectedItems[0].content == undefined) {
		
			Dialog.alert("no text selected");
		
		} else {
			dataString = document.selectedItems[0].content;
		}
		//read the data
		return(this.createCollection());
	}
	
	/*
	 * Metodo per leggere da un file di testo esterno.
	 * La funzione crea la variabile datastring, dopodichè
	 * chiama la funzione @creteCollection, popola l'oggetto data
	 * e restituisce sé stesso in modo da impostare una monade (si dice impostare?)
	 */
	
	this.readFromFile = function(_path,_name){
		
		//variabile che descrive il file da aprire
		var dataSource;
		
		//svuoto la datastring
		dataString='';
		
		// se non è stato specificato il file o la path, apre una finestra di dialogo
		
		if (_name==null){
			
			dataSource = Dialog.fileOpen('Select the source file');
			
		} else {
			
			dataSource = new File(_path,_name);
		}
		
		//open datasource
		dataSource.open();
		
		//read all lines contained
		while(line = dataSource.readln()) {
			// TODO: fare questo in maniera sensata
			// siccome quando il delimiter viene inserito dall'utente javascript lo interpreta come oggetto regexp,
			// lo devo convertire in stringa per a) unire le righe correttamente,
			
			lineDelimiter = lineDelimiter.toString();
			dataString += line+lineDelimiter;
		}
		dataString = dataString.slice(0,-lineDelimiter.length);
		//read the data
		return(this.createCollection());
	}
	
	/*
	 * Metodo per creare una collezione (Array di Oggetti) a partire da una stringa.
	 * Restituisce l'oggetto stesso in modo da impostare una monade.
	 */
	
	this.createCollection = function() {
	
		//clear the data object
		data = [];
		
		var lines = dataString.split(lineDelimiter);
		var headers = [];
		
		//controllo se esistono headers, altrimenti li creo
		if(hasHeaders){
		
			//creo un array dalla prima linea
			headers = lines[0].split(cellDelimiter);
			//rimuovo la prima linea dai dati
			lines.splice(0,1);
			
		} else {
			//controllo il numero di singoli valori nella prima riga
			var numOfHeaders = lines[0].split(cellDelimiter).length;
			
			//popolo l'array con valore apri all'indice
			for(var i = 0; i < numOfHeaders; i++){
				headers[i] = i;
			}
		}
		
		//a questo punto comincio a creare la collezione
		for(var line = 0; line < lines.length; line++){
			
			//creo un oggetto con le caratteristiche volute
			var newItem = {};
			
			var values = lines[line].split(cellDelimiter);
			
			for(var i = 0; i < values.length; i++){
				
				newItem[(headers[i]).toString()] = values[i];
				//CHECK: e se nel file ci sono più valori degli headers? devo dare un alert?
			}
		
			data.push(newItem);
		}
		return this;
	}
	
	/*
	 * Metodo per convertire una proprietà condivisa da ogni oggetto della collezione
	 * da String a Float.
	 * Restituisce l'oggetto stesso in modo da impostare una monade.
	 */
	
	this.parseProperty = function(_propName){
		for(var i in data){
			if(data[i][_propName] == null){
				print('property '+_propName+' not found in element #'+i);
			} else {
				data[i][_propName] = parseFloat((data[i][_propName]).replace(',','.'));
			}
		}
		return this;
	}
	
	/*
	 * Metodo per ottenere la collezione (Array di Oggetti) 
	 * creata dalla funzione createCollection a partire dalla datastring.
	 */
	 
	this.getData = function(){
		return data;
	}
}