(function(vizana, $, undefined){

// public
vizana.servelet = "http://172.27.183.11:8080/REtoServlet/ReHttpServlet";
vizana.title = "NETWORK <big>O</big>VERVIEW";
vizana.xvalue = "no. of events";


// private
var w = window.innerWidth,
h = window.innerHeight,
p = 10,
selected = "b4",
showFrom = 0,
currentbar = -1,
currentbarend = -1,
overviewData = [],
pagesize = 10,
maxCount,
quadrantValues,
ranks,
graph,
getDataStack = 0,
dataStackCallback = function(){},
loaded = false,
xlist = ["I","W","G","B"],
ylist = ["xH","H","M","L","U"];

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
	setupPage();
	setupCSS();
	setupText();
	setupOverview();
	$(window).resize(resize);
	$(".loading").hide("fade","slow");
	$(".overviewbox").css("display","none");
	$(".overviewbox").show("scale",{from:{height:0,width:0}, percent:100},"slow");


}

function resize()
{
	setupCSS();
	setupOverview();
}

function popDataStack()
{
	getDataStack--;
	if (getDataStack == 0) dataStackCallback();
}

function setupText()
{
	$("#title span").html(vizana.title);
	for (var i=0; i<4; i++)
		$("#"+xlist[i]+" span").html(xlist[i]).css({"padding":2, "font-size": "20px"});

	for (var j=0; j<5; j++)
		$("#"+ylist[j]+" span").html(ylist[j]).css({"padding":2, "font-size": "20px"});
}

function getData(param, successFn)
{
	$("#spinner").show("fade","slow");

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

function setupOverview(data)
{
	var codes = "",
	bw = $("#0_0").width(),
	bh = $("#0_0").height(),
	sizew = (bw-4)/2,
	sizeh = (bh-4)/2,
	tmpx = (bw-sizew)/2,
	tmpy = (bh-sizeh)/2;
	
	codes = '<span>i:123123<br />O:123213</span>'
	codes += '<div class="overviewbox" style="position:absolute;left:'+tmpx+'px;top:'+tmpy+'px;width:'+sizew+'px;height:'+sizeh+'px;"></div>';
	$("#0_0").html(codes);
	
}

function setupPage()
{
	var codes = '<div id="title"><span></span></div>';
	
	for (var i=0; i<4; i++)
	{
		codes += '<div id="'+xlist[i]+'" class="footer"><span></span></div>';
		for (var j=0; j<5; j++)
		{
			codes += '<div id="'+(i+"_"+j)+'" class="quad"><span></span></div>';
		}
	}

	for (var j=0; j<5; j++)
		codes += '<div id="'+ylist[j]+'" class="footer"><span></span></div>';

	$("body").append(codes);	
}

function setupCSS()
{
	w = window.innerWidth;
	h = window.innerHeight;
	
	var codes = "", bw = (w-6*p-50)/4, bh = (h-8*p-60-50)/5, tmpy=0;
			
	$("#title").css({ 	
		"position":"absolute",
		"top": p, 
		"left": p,
		"width": w-p-p,
		"height": 60					
	});		
						
	tmpy += p + 60;
	
	for (var i=0; i<4; i++)
	{
		$("#"+xlist[i]).css({ 	
			"position":"absolute",
			"top": (5*(bh+p)+p+tmpy), 
			"left": (i*(bw+p)+p),
			"width": bw,
			"height": 50,
			"text-align":"center",			
			"line-height":"50px"
		});	
		
		for (var j=0; j<5; j++)
		{
			$("#"+i+"_"+j).css({ 	
				"position":"absolute",
				"top": (j*(bh+p)+p+tmpy), 
				"left": (i*(bw+p)+p),
				"width": bw,
				"height": bh,	
				"text-align":"right"
			});	
		}	
	}

	for (var j=0; j<5; j++)
	{	
		$("#"+ylist[j]).css({ 	
			"position":"absolute",
			"top": (j*(bh+p)+p+tmpy), 
			"left": (4*(bw+p)+p),
			"width": 50,
			"height": bh,			
			"text-align":"center",
			"line-height":bh+"px"
		});	
	}
	tmpx = bw*4+5*p;
	

}




}( window.vizana = window.vizana || {}, jQuery) );