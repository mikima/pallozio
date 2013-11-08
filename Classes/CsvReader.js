/**
 * 
 * @class Parse a text and returns a table as array of object.
 *
 * @author Michele Mauri
 * @version 0.1
 *
 */		

function CsvReader(){

	// dataString contains the text to parse
	var dataString = "";

	//the object returned by function {@createCollection}
	var data = [];
	
	//if the first line contains headers
	hasHeaders = true;
	
	//lines and cells default charachter dividers.	
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
						   hasHeaders: {type:'boolean', label:'Headers in first line'}
						 }
		
		var values = Dialog.prompt('Set Data Variables', components, values);
		
		lineDelimiter = new RegExp(values.lineDelimiter);
		cellDelimiter = new RegExp(values.cellDelimiter);
		hasHeaders = values.hasHeaders;
			
		// depending on values.source
		// the text is loaded from a selected textfield or from a file.
		if(values.source=='From File'){
			this.readFromFile();
		} else {
			this.readFromSel();
		}
		
		return this;
	}
	
	this.askParsing = function(){

		var keys = [];
		for(var i in data[0])
		{
			keys.push(i);
		}
		
		var components = {};
		
		for(var key in keys) {

			// we will add an underscore _ to each component's name
			// to avoid errors when keys starts with digits.
			components['_'+keys[key]] = { type:'boolean', label:keys[key], value:false};
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
	 * Read data from a selected textpath or textpoint.
	 */
	
	this.readFromSel = function(){
		
		//clear dataString
		dataString = '';
	
		// check if at least a text is selected
		if(document.selectedItems[0] == undefined || document.selectedItems[0].content == undefined) {
		
			Dialog.alert("no text selected");
		
		} else {

			// take the first text in selection
			dataString = document.selectedItems[0].content;
		}

		// call createCollection function to
		// parse the data
		return(this.createCollection());
	}
	
	/*
	 * Read data from external file
	 * 
	 * @param {string} [_path] file's path
	 * @param {string} [_name] filename and extension
	 */
	
	this.readFromFile = function(_path,_name){
		
		//Filename string
		var dataSource;
		
		//clear dataString
		dataString = '';
		
		// if readFromFile is called without specifying _path and _name variable,
		// prompt a windows asking for a file.
		
		if (_name==null){
			
			dataSource = Dialog.fileOpen('Select the source file');
			
		} else {
			
			dataSource = new File(_path,_name);
		}
		
		//open datasource
		dataSource.open();
		
		//read all the contained lines
		while(line = dataSource.readln()) {
			
			//add to dataString each line followed by lineDelimiter
			dataString += line + lineDelimiter.toString();
		}

		dataString = dataString.slice(0,-lineDelimiter.length);
		
		// call createCollection function to
		// parse the data
		return(this.createCollection());
	}
	
	/*
	 * Creates a collection (objects array) starting from dataString variable.
	 */
	
	this.createCollection = function() {
	
		// clear the data object
		data = [];
		
		var lines = dataString.split(lineDelimiter);
		var headers = [];
		
		// load headers from first line
		// if defined.
		if(hasHeaders){
		
			//create headers array
			headers = lines[0].split(cellDelimiter);

			//remove first line
			lines.splice(0,1);
			
		} else {
			// if first line doesn't contain headers,
			// count the number of cells in the first line.
			var numOfHeaders = lines[0].split(cellDelimiter).length;
			
			//create progressive numeric headers
			for(var i = 0; i < numOfHeaders; i++){
				headers[i] = i;
			}
		}
		
		//populate collection, contained in data array

		for(var line = 0; line < lines.length; line++){
			
			//create an object for each line
			var newItem = {};
			
			var values = lines[line].split(cellDelimiter);
			
			for(var i = 0; i < values.length; i++){
				
				newItem[(headers[i]).toString()] = values[i];
			}
		
			data.push(newItem);
		}
		return this;
	}
	
	/*
	 * convert a column from string to float.
	 * as table is represented by an array of objects,
	 * and columns as objects' properties,
	 * for each object is converted a selected property.
	 *
	 * @param {String} _propName Name (header) of the property to parse.
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
	 * Get parsed data
	 */
	 
	this.getData = function(){
		return data;
	}
}