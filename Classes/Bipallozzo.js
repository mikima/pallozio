function Bipallozzo(name, area1, area2, angle)
{
    var alpha = angle;
    var name = name;

    var fill1 = new CMYKColor(1, 0, 0, 0);
    var fill2 = new CMYKColor(0, 0, 1, 0);

    var areaMin;
    var areaMax;
    var dir;
    var g = new Group();
    g.name = name;

    //identifica l'area minore
    if (area1 < area2)
    {
        areaMin = area1;
        areaMax = area2;
        dir = 1;
    }
    else
    {
        areaMin = area2;
        areaMax = area1;
        dir = -1;
    }

	if(areaMin == 0)
	{
		//disegna solo un cerchio
		var r = Math.sqrt(areaMax / Math.PI);
		var c = new Path.Circle(new Point(0, 0), r);
		c.fillColor = dir>0?fill2:fill1;
		g.appendTop(c);
	}
	else
	{
    var r1 = Math.sqrt(areaMin / Math.PI);
    var r2 = Math.sqrt(areaMax / Math.PI);

    var beta = Math.asin(Math.sin(alpha) * r1 / r2);



    var offset1 = Math.cos(alpha) * r1;
    var offset2 = Math.cos(beta) * r2;

    var c1 = new Path.Circle(new Point(0, 0), r1);
    c1.position.x = dir * offset1;

    var c2 = new Path.Circle(new Point(0, 0), r2);
    c2.position.x = -dir * offset2;


    var mask1 = new Path.Rectangle(dir > 0 ? 0 : -r1 * 2, -r1, r1 * 2, r1 * 2);
    var mask2 = new Path.Rectangle(dir < 0 ? 0 : -r2 * 2, -r2, r2 * 2, r2 * 2);

    var p1 = Pathfinder.intersect([c1, mask1]);
    var p2 = Pathfinder.intersect([c2, mask2]);
    p1.fillColor = dir>0?fill1:fill2;
    p2.fillColor = dir>0?fill2:fill1;

    g.appendTop(p1);
    g.appendTop(p2);
    }
    var t = new PointText(new Point(0,0));
    t.content = name.replace(/ /g,"\r");
    t.paragraphStyle.justification = 'center';
    
    //stile del testo
    t.characterStyle.leading = 9;
    t.characterStyle.fontSize = 11;
    t.characterStyle.font = app.fonts['Brera']['Light'];
    t.characterStyle.capitalization = 'small';
    
    //t.position.x = t.bounds.width/2;
    t.position.x = 0;
    t.position.y = 0;
    g.appendTop(t);
    return g;
}