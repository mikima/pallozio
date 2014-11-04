var values = {resize: false};

var components = {
    resize: { type: 'boolean', label: 'Resize symbol?' },
	keep: { type: 'boolean', label: 'Keep appaerence?' }
    // Define the hello button which when clicked says hello:
};

var values = Dialog.prompt('Options',components);

findAndReplace(values.resize, values.keep);

function findAndReplace(_resize,_keep)
{
	var selected = document.getItems({
	    selected: true
	});

	var symbol = selected[0];
	
	var dimension = symbol.bounds.width > symbol.bounds.height ? symbol.bounds.width : symbol.bounds.height;

	for(var i = 1; i < selected.length; i++)
	{
		var item = selected[i];
		var size = item.bounds.width < item.bounds.height ? item.bounds.width : item.bounds.height;
		var pos = item.position;
		var newitem = symbol.clone();
		newitem.position = pos;
		
		if(_resize)
		{
			var ratio = size/dimension;
			print(ratio);
			newitem.scale(ratio);
		}
		if(_keep)
		{
			newitem.fillColor = item.fillColor;
		}
		item.remove();
	}

	symbol.remove();
}