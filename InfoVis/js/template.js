(function(vizana, $, undefined){

// public
vizana.title = "EXTERNAL <big>IPs</big>";
vizana.quadrant = [0,100,300,4000,10000];
vizana.xvalue = "no. of events";
vizana.q1 = [0.00, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.2, 0.4000, 0.6040, 0.7080];
vizana.q2 = [0.8,0.5,0.3,0.5,0.44];
vizana.q3 = [0.8,0.5,0.3,0.5,0.44];
vizana.q4 = [0.8,0.5,0.3,0.5,0.44];

// public methods
vizana.init = function()
{
	setupCSS();
	setupText();
	setupGraph();
	setupListener();
	setupSelect(selected);
	
	$(window).resize(resize);
};

// private
var w = window.innerWidth,
h = window.innerHeight,
p = 10,
selected = "b4";

// private methods
function resize()
{
	setupCSS();
	setupGraph();
	setupSelect(selected)
}



function setupText()
{
	$("#title span").html(vizana.title);
	$("#q0 span").html(vizana.quadrant[0]);
	$("#q1 span").html(vizana.quadrant[1]);
	$("#q2 span").html(vizana.quadrant[2]);
	$("#q3 span").html(vizana.quadrant[3]);
	$("#q4 span").html(vizana.quadrant[4]);
	$("#xvalue span").html(vizana.xvalue).css({"padding":2, "font-size": "18px"});
}

function setupListener()
{
	$(".quad").click(quadClick);
}

function quadClick(event)
{
	var id = this.id;
	$(".anim").fadeOut("fast",function(){
		selected = id;
		setupSelect(id);
		$(".anim").fadeIn("fast");
	});

}

function setupSelect(id)
{
	var x = $("#"+id).offset().left,
	y = $("#"+id).offset().top,
	qh = $("#"+id).height(),
	qw = $("#"+id).width();

	$("#contentselected").css({	
		"position":"absolute",
		"top": y, 
		"left": x,
		"width": qw-1,
		"height": qh+30+25+18
	});
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
	drawQ(0, quadWidth, qh, ctx, vizana.q1);
	drawQ(quadWidth, quadWidth, qh, ctx, vizana.q2);
	drawQ(quadWidth*2, quadWidth, qh, ctx, vizana.q3);
	drawQ(quadWidth*3, quadWidth, qh, ctx, vizana.q4);
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
	tmpy += 25 + 30;
	dh = h - tmpy - p - 18;
						
	$("#content").css({ "position":"absolute",
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