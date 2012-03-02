(function(vizana, $, undefined){

// public
vizana.servelet = "http://172.27.183.11:8080/REtoServlet/ReHttpServlet";
vizana.SQL = "SELECT * FROM test_table WHERE Percentile=1 AND Rank >= 1 AND Rank <= 4;";
vizana.title = "EXTERNAL <big>IPs</big>";
vizana.quadrant = [0,100,300,4000,10000];
vizana.xvalue = "no. of events";
vizana.q1 = [0.00, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.2, 0.4000, 0.6040, 0.7080];
vizana.q2 = [0.8,0.5,0.3,0.5,0.44];
vizana.q3 = [0.8,0.5,0.3,0.5,0.44];
vizana.q4 = [0.8,0.5,0.3,0.5,0.44];


// private
var w = window.innerWidth,
h = window.innerHeight,
p = 10,
selected = "b4",
showFrom = 0,
currentbar = -1,
currentbarend = -1,
barsData = [],
pagesize = 10,
maxCount,
quadrantValues,
ranks,
graph,
getDataStack = 0,
dataStackCallback = function(){},
loaded = false;

// public methods
vizana.init = function()
{
	dataStackCallback = initData;

	// 2 inside getdata stack
	getDataStack = 4;
	
	var param = {"VOid":1, "Type":1, "Mode":0, "Param":"SELECT max(Count) FROM test_table;"};
	getData(param, function(data){maxCount=data[""][0]["max(Count)"];}).success(popDataStack);

	param = {"VOid":1, "Type":1, "Mode":0, "Param":"SELECT min(Rank),max(Rank) FROM test_table GROUP BY Percentile ORDER BY Percentile;"};
	getData(param, function(data){ranks=data[""];}).success(popDataStack);
		
	param = {"VOid":1, "Type":1, "Mode":0, "Param":"SELECT max(Count) FROM test_table GROUP BY Percentile ORDER BY Percentile;"};
	getData(param, function(data){quadrantValues=data[""];}).success(popDataStack);
		
	param = {"VOid":1, "Type":1, "Mode":0, "Param":"SELECT Count FROM test_table ORDER BY Rank;"};
	getData(param, function(data){graph=data["test_table"];}).success(popDataStack);	

};


// private methods
function initData()
{
	setupCSS();
	setupText();
	setupGraph();
	setupListener();
	setupSelect(selected);
	$(window).resize(resize);

	console.log(graph);
}

function resize()
{
	setupCSS();
	setupGraph();
	setupSelect(selected);
}

function popDataStack()
{
	getDataStack--;
	
	if (getDataStack == 0) dataStackCallback();
}

function setupText()
{
	$("#title span").html(vizana.title);
	$("#q0 span").html(0);
	$("#q1 span").html(quadrantValues[0]["max(Count)"]);
	$("#q2 span").html(quadrantValues[1]["max(Count)"]);
	$("#q3 span").html(quadrantValues[2]["max(Count)"]);
	$("#q4 span").html(quadrantValues[3]["max(Count)"]);
	$("#xvalue span").html(vizana.xvalue).css({"padding":2, "font-size": "18px"});
}

function setupListener()
{
	$(".quad").click(quadClick);
}

function quadClick(event)
{
	var id = this.id;

	$(".anim").hide("puff","fast");

	$(".anim").promise().done(function(){
		selected = id;
		setupSelect(id);
		$(".anim").show("puff","fast");
	}).promise().done(function(){
		$(".bar").show("slide","slow");
	});
}

function getBarsData(from)
{
	currentbar = from - pagesize;
	currentbarend = from + 4 + pagesize;

	var param = {"VOid":1, "Type":1, "Mode":0, "Param":vizana.SQL};
		//$.getJSON(vizana.servelet+"?&callback=?", param, refreshBars);

	getData(param, function(data, textStatus, jqXHR) {
			saveData(data, textStatus, jqXHR);
			refreshBars(data, textStatus, jqXHR);
		});
}

function getData(param, successFn)
{
	return $.ajax({
		url: vizana.servelet,
		data: param,
		dataType: "jsonp",
		jsonp: "callback",
		timeout: 10000,
		success: successFn,
		error: function(XHR, textStatus, errorThrown){
        alert("Failed to retrieve data: " + errorThrown);
		}
	});
}

function updateBarsData(dir)
{
	// redraw stuff before updating the data in memory
	refreshBars(data);
	currentbar += dir*pagesize;
	currentbarend += dir*pagesize;
	
	var param = {"VOid":1, "Type":1, "Mode":0, "Param":vizana.SQL};
	//$.getJSON(vizana.servelet+"?&callback=?", param, saveData);
		
	// update data
	getData(param, saveData);
	
}

function saveData(data, textStatus, jqXHR)
{
	barsData = data;
}

function refreshBars(data, textStatus, jqXHR)
{
	var y = h/2+100, barh = (h-y-p-18-7*10)/5;
	
	var code = "";
	for (var i=0, len = 5; i<len; i++)
	{	
		code += '<div class="bar" style="position:absolute;top:'+((barh+10)*i+10)+'px;left:10px;width:'+(Math.random()*w-5*p)+'px;height:'+barh+'px;"></div>';
	}
	
	$("#bars").html(code);
	
}

function setupBars(from)
{	
	showFrom = from;

	var left = currentbar - from,
	right = showFrom + 4 - currentbarend;

	// if outside the barsData, redo everything
	if (left > 0 || right > 0)
	{
		getBarsData(showFrom);
	}
	// if at the border region of barsData, show the bars then start retrieving a new set of data
	else if (left > - pagesize/2)
	{
		updateBarsData(-1);
	}
	else if (right > - pagesize/2)
	{
		updateBarsData(1);
	}
	else
	{
		refreshBars(barsData);
	}
	refreshBars(barsData);
}

function setupSelect(id)
{
	var x = $("#"+id).offset().left,
	y = $("#"+id).offset().top,
	qh = $("#"+id).height(),
	qw = $("#"+id).width(),
	x1,y1,x2,y2,xx,yy;

	var canvas = document.getElementById("selected");
	canvas.width = w;
	canvas.height = h;
	
	var ctx = canvas.getContext("2d");
	/*
	$("#contentselected").css({	
		"position":"absolute",
		"top": y, 
		"left": x,
		"width": qw-1,
		"height": qh+30+25+18
	});
	*/
	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = "rgba(154,83,75,0.3)";
	ctx.beginPath();
	xx = x;
	yy = y;
	ctx.moveTo(xx,yy);
	xx += qw;
	ctx.lineTo(xx,yy);
	yy += qh;
	ctx.lineTo(xx,yy);
	x1 = xx;
	y1 = yy + 50;
	xx = w-p;
	yy += 100;
	x2 = xx;
	y2 = y1;
	ctx.bezierCurveTo(x1,y1,x2,y2,xx,yy);  
	yy = h-p;
	ctx.lineTo(xx,yy);
	xx = p;
	ctx.lineTo(xx,yy);
	yy = y+qh+100;
	ctx.lineTo(xx,yy);
	x1 = xx;
	y1 = yy - 50;
	xx = x;
	yy = y+qh;
	x2 = xx;
	y2 = y1;
	ctx.bezierCurveTo(x1,y1,x2,y2,xx,yy);  
	xx= x;
	yy = y;
	ctx.lineTo(xx,yy);
	ctx.closePath();
	ctx.fill();
	
	setupBars(0);
}

function setupGraph()
{
	var bh = $("#graph").height();

	var canvas = document.getElementById("graph");
	canvas.width = w - p - p;
	canvas.height = bh;
	
	var ctx = canvas.getContext("2d"),
	quadWidth = canvas.width/4,
	qh = canvas.height; 

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "rgb(227,196,163)";  
	ctx.beginPath();
	ctx.moveTo(0,qh);
	drawGraph(0, canvas.width, qh, ctx, graph,"Count");
	//drawQ(0, quadWidth, qh, ctx, vizana.q1);
	//drawQ(quadWidth, quadWidth, qh, ctx, vizana.q2);
	//drawQ(quadWidth*2, quadWidth, qh, ctx, vizana.q3);
	//drawQ(quadWidth*3, quadWidth, qh, ctx, vizana.q4);
	ctx.lineTo(quadWidth*4,qh);
	ctx.lineTo(0,qh);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

function drawQ(startX, quadWidth, qh, ctx, q)
{
	var len = q.length,
	step = quadWidth/len;
	for (var i=0; i<len; i++)
	{
		ctx.lineTo(startX+(i+1)*step,(1-q[i])*qh);
	}
}

function drawGraph(startX, quadWidth, qh, ctx, q, index)
{
	var len = q.length,
	step = quadWidth/len;
	for (var i=0; i<len; i++)
	{
		ctx.lineTo(startX+(i+1)*step,(1-q[i][index]/maxCount)*qh);
	}
}

function setupCSS()
{
	w = window.innerWidth;
	h = window.innerHeight;
	
	var tmpx = p, tmpy = p, qw = (w-p-p)/4, bh = (h-60-18-p-p/2-p)/2 - 25, dh;
	
	$("#title").css({ 	"position":"absolute",
						"top": p, 
						"left": p,
						"width": w-p-p,
						"height": 60					
						});
						
	tmpy += 60+p/2;
	
	$("#q0").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw/2,
						"height": 18
						
						});
	
	tmpx+=qw/2;
	
	$("#q1").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"
						});
	tmpx+=qw;

						
	$("#q2").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"				
						});
	tmpx+=qw;

	$("#q3").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"				
						});
	tmpx+=qw;


	$("#q4").css({ 	"position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": qw/2+p,
						"height": 18,
						"text-align": "right"
						});
	tmpx=p;
	tmpy+=18;
		
	$("#graph").css({ "position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": w-p-p,
						"height": bh,
						});	
						
	$("#selected").css({ 
		"position":"absolute",
		"top": 0, 
		"right": 0,
		"width": w,
		"height": h,
	});	
	
	$("#b1").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw-p/2,
						"height": bh				
						});
	

	tmpx += qw+p/4;

	$("#b2").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw-p/2,
						"height": bh				
						});
	

	tmpx += qw+p/4;

	$("#b3").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw-p/2,
						"height": bh				
						});
	

	tmpx += qw+p/4;

	$("#b4").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw-p/2,
						"height": bh				
						});
	
	tmpx = p;
	tmpy += bh;

	$("#c0").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw/2,
						"height": 18
						
						});
	
	tmpx+=qw/2;
	
	$("#c1").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"
						});
	tmpx+=qw;

						
	$("#c2").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"				
						});
	tmpx+=qw;

	$("#c3").css({ 	"position":"absolute",
						"top": tmpy, 
						"left": tmpx,
						"width": qw,
						"height": 18,
						"text-align": "center"				
						});
	tmpx+=qw;

	$("#c4").css({ 	"position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": qw/2+p,
						"height": 18,
						"text-align": "right"
						});

	tmpx = p;
	tmpy += 18;
	

	$("#xvalue").css({ 	"position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": w-p-p,
						"height": 25,
						"text-align": "right"
						
						});
		
	tmpx = p;
	tmpy += 25 + 50;
	dh = h - tmpy - p - 18;
						
	$("#bars").css({ "position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": w-p-p,
						"height": dh+1,
						});
	
	tmpy += dh;
		
	$("#contentfooter").css({ "position":"absolute",
						"top": tmpy, 
						"right": p,
						"width": w-p-p,
						"height": 18,
						});
						
	

						
}




}( window.vizana = window.vizana || {}, jQuery) );