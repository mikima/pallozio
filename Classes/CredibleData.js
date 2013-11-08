/*
 * credible data generator.
 * @class useful class when you need a dataset to test a visualization.
 * yes, we love infosthetic!
 
    @ example
	var cd = new CredibleData().addInt('year', 2000, 2010)
							   .addFloat('weight',60,100)
							   .addList('name',['paolo','michele','luca','giorgio','donato'])
							   .addBoolean('foreign')
							   .population(100)
							   .generate();
						   
	print(Json.encode(cd));
 
 *
 * @version 0.1
 *
 */

function CredibleData(){
	
	//the fields of the dataset.
	var fields = {};
	
	//number of elements, default = 10;
	var entries = 10;
	
	/*
	 * add a new integer field
	 * @param {String} _name the field's name.
	 * @param {Number} _min minimum value.
	 * @param {Number} _max maximum value.
	 * @returns the CredibleData object, so you can chain other function.
	 */
	
	this.addInt = function(_name, _min, _max){
		fields[_name] = {type:'integer', min:_min, max:_max};
		return this;
	}
	
	/*
	 * add a new float field
	 * @param {String} _name the field's name.
	 * @param {Number} _min minimum value.
	 * @param {Number} _max maximum value.
	 * @returns the CredibleData object, so you can chain other function.
	 */
	
	this.addFloat = function(_name, _min, _max){
		fields[_name] = {type:'float', min:_min, max:_max};
		return this;
	}
	
	/*
	 * add a new list field
	 * @param {String} _name the field's name.
	 * @param {Array} _list an array of values.
	 * @returns the CredibleData object, so you can chain other function.
	 */
	
	this.addList = function(_name, _list){
		fields[_name] = {type:'list', list:_list};
		return this;
	}
	
	/*
	 * add a new boolean field
	 * @param {String} _name the field's name.
	 * @returns the CredibleData object, so you can chain other function.
	 */
	
	this.addBoolean = function(_name){
		fields[_name] = {type:'boolean'};
		return this;
	}
	
	/*
	 * set entries numbers
	 * @param {Number} _num the number of elements you want to generate
	 * @returns the CredibleData object, so you can chain other function.
	 */
	
	this.population = function(_num){
		entries = _num;
		return this;
	}
	
	/*
	 * Generate the collection
	 * @returns an array of objects (Collection).
	 */
	
	this.generate = function(){
	
		//the Collection (array of objects) tht will be populated
		var data = [];
		
		//each cycle generates an object of the colelction
		for(var i = 0; i < entries; i++){
			
			data[i] = {};
			
			//for each field, according to his type, it generates a value
			for(var j in fields){
			
				var field = fields[j];
				
				if(field.type == 'boolean'){
					data[i][j] = Boolean(Math.round(Math.random()));
				}
				
				if(field.type == 'list'){
					
					var index = Math.round(Math.random()*(field.list.length-1));
					data[i][j] = field.list[index];
				}
				
				if(fields[j].type == 'integer'){
				
					data[i][j] = Math.round(Math.random()*(field.max - field.min)) + field.min;
				}
				
				if(fields[j].type == 'float'){
					
					data[i][j] = Math.random()*(field.max - field.min) + field.min;
				}
			}
		}
		
		return data;
	}
}