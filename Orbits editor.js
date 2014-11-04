
function onMouseDrag(event) {
	print(event.point.angle);
	var selected = document.getItems({
	    selected: true
	});
	var item = selected[0];
    var newangle = event.point.angle;
    var new_x = Math.cos(newangle/360*Math.PI*2)*item.data.c_orbit;
	var new_y = Math.sin(newangle/360*Math.PI*2)*item.data.c_orbit;
    item.position = new Point(new_x, new_y);
}