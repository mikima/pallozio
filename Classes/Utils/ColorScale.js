/*
 * Creates a new ColorScale.
 * @ ColorScale The ColorScale class associates a gradient of colors to a range of values.
 *
 * @version 0.1
 * @param {Color[]} color The array of colors to use. They can be CMYKColor() or RGBColor().
 * @param {Number[]} values Optional, you can associate the value of each color. The arary must have the same number of items as colors.
 * If no value is given, ColorScale creates the scale betwenn 0 and 1.
 */
 
function ColorScale(colors,values){
	
	this.colors = colors;
	this.customValues = false;
	
	this.updateValues = function(){
		this.values = [];
		for(var i=0; i<this.colors.length; i++){
			this.values.push(i/(this.colors.length-1));
		}
	}
	
	if(!values){
		this.updateValues();
	} else {
		this.values = values;
	}
	
	this.askColorsNumber = function(){
		var components = {};
		components.setvalues = {type: 'boolean', label: 'Set values',value: this.customValues};
		components.number = {type: 'number', label:'Number of colors',value: 2};
		var values = Dialog.prompt('Number of colors',components);
		
		for(var i=0; i<values.number; i++){
			if(this.colors[i] == undefined){
				this.colors[i] = new RGBColor(Math.random(),Math.random(),Math.random());
			}
		}
		for(var i=values.number; i<this.colors.length; i++){
			this.colors.pop();
			i--
		}
		this.updateValues();
		this.customValues = values.setvalues;
	}
	
	this.askColors = function(){

		var components = {};
		for(var i=0; i<this.colors.length; i++){
			
			if(this.customValues){
				components['color'+i] = {type: 'color', value: this.colors[i]};
				components['value'+i] = {type: 'number', value: this.values[i]};
			} else {
				components['color'+i] = {type: 'color', label: this.values[i], value: this.colors[i]};
			}
		}
		inputs = Dialog.prompt('Colors',components);
	}
	
	/*
	 * Get the corresponding color to a given number
	 */
	
	this.getColor = function(number){
	
		var index = this.values.lenght;
	
		for(var i in this.values){
			
			if(this.values[i] > number){
				index=i;
				break;
				} else {
					index = this.values.length - 1;
				}
			
		}
		
		if(index==0) { return this.colors[0] };		
		if( index==this.values.length) { return this.colors[this.colors.length-1] };
		
		var diff = (number - this.values[index-1]) / (this.values[index] - this.values[index-1]);
		
		return getComponents(this.colors[index-1],this.colors[index],diff);
		
	}
	
	function getComponents(color1,color2,value){
		
		if(color1.type != 'cmyk'){
			//print('"'+color1.type+'" is not supported by ColorScale Class');
			color1 = color1.convert('cmyk');
			color2 = color2.convert('cmyk');
		}
		
		if(color1.type == 'cmyk'){
			
			var c=color2.cyan-color1.cyan;
			var m=color2.magenta-color1.magenta;
			var y=color2.yellow-color1.yellow;
			var k=color2.black-color1.black;
			
			// creo moltiplicatore valore colore
			var componenti = new CMYKColor(
				color1.cyan+c*value,
				color1.magenta+m*value,
				color1.yellow+y*value,
				color1.black+k*value);
		}
		
		if(color1.type == 'rgb'){
			
			var r=color2.red-color1.red;
			var g=color2.green-color1.green;
			var b=color2.blue-color1.blue;
			
			// creo moltiplicatore valore colore
			var componenti = new RGBColor(
				color1.red+r*value,
				color1.green+g*value,
				color1.blue+b*value);
		}
			
		return componenti;
	}
}