/*
 * Creates a new ColorScale.
 * @ Scale Useful to remap data.
 *
 * @version 0.1
 * @param {Number} inMin the minimum value of the original data
 * @param {Number} inMax the maximum value of the original data
 * @param {Number} outMin the minimum value of the remapped data
 * @param {Number} outMax the maximum value of the remapped data
 */
 
function Scale(inMin, inMax, outMin, outMax){
	
	this.inMin = inMin
	this.outMin = outMin;
	this.inMax = inMax;
	this.outMax = outMax;
	//creates a value reusable each time the function @link map is called
	this.factor = (outMax - outMin) / (inMax - inMin);
	
	/*
	 * returns a remapped value
	 * @param value the original value
	 * @returns the remapped value
	 */
	
	this.get = function(value){
		return (value - inMin) * this.factor + outMin;
	}
}

function SquareScale(inMin, inMax, outMin, outMax){
	
	//creates a value reusable each time the function @link map is called
	this.factor = (outMax - outMin) / (Math.sqrt(inMax) - Math.sqrt(inMin));
	
	/*
	 * returns a remapped value
	 * @param value the original value
	 * @returns the remapped value
	 */
	
	this.get = function(value){
		return (Math.sqrt(value) - inMin) * this.factor + outMin;
	}
}