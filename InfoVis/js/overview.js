/**
 * @author eterna2
 */
var myX, myY;
var colorStart = "rgba(10,10,10,0.3)";
var colorEnd = "rgba(10,50,10,0.3)";

var color_xh = "rgba(120,20,10,1)";
var color_h = "rgba(100,50,10,1)";
var color_m = "rgba(30,60,10,1)";
var color_l = "rgba(10,50,10,1)";

var icolor_xh = "rgba(255,80,50,0.9)";
var icolor_h = "rgba(250,150,10,0.8)";
var icolor_m = "rgba(100,200,100,0.8)";
var icolor_l = "rgba(80,200,80,0.8)";


var tcount_grp = [500,2000,5000,20000];


execute();

function execute()
{
	doTooltip();
	
	//$("body").css(getStyleBackgroundGradient(30,100,40,1,10,80,30,1));
	$(".metroBox").css(getStyleBackgroundGradient2(colorStart,colorEnd));

	//setMetroBox("xhi",color_xh,color_h,icolor_xh,1242,241,123,324,34543);
	setMetroBox("hi",color_h,color_m,icolor_h,152,133,3466,345,345);
	setMetroBox("mi",color_m,color_l,icolor_m,13363,24333,34545,345,34545);
	setMetroBox("li",color_l,colorEnd,icolor_l,13,2433,345,345,3545);

	setMetroBox("xhw",color_xh,color_h,icolor_xh,1223442,2434241,3324423,1344424,3432543);
	//setMetroBox("hw",color_h,color_m,icolor_h,15322,13233,3466,345,345);
	setMetroBox("mw",color_m,color_l,icolor_m,1336,2433,3445,3345,3445);
	setMetroBox("lw",color_l,colorEnd,icolor_l,134,2443,345,345,345);

	//setMetroBox("xhg",color_xh,color_h,icolor_xh,12,241,132,334,343);
	//setMetroBox("hg",color_h,color_m,icolor_h,15322,1333,3466,345,345);
	setMetroBox("mg",color_m,color_l,icolor_m,1336,2433,345,345,3445);
	//setMetroBox("lg",color_l,colorEnd,icolor_l,1343,2343,3345,3345,3345);

	setMetroBox("xhb",color_xh,color_h,icolor_xh,12242,2432,13243,334,343243);
	setMetroBox("hb",color_h,color_m,icolor_h,153,132,346,35,345);
	//setMetroBox("mb",color_m,color_l,icolor_m,136,233,345,35,3445);
	setMetroBox("lb",color_l,colorEnd,icolor_l,13,24,34,35,45);

	//$(".metroBox").css("-webkit-animation-play-state","paused")
	//$("#hi").css(setMetroBoxActive(color_h,color_m));
	//$("#mi").css(setMetroBoxActive(color_m,color_l));
	//$("#li").css(setMetroBoxActive(color_l,colorEnd));

	//drawOnCanvas("xhi",color_xh,"1.00","1.00",0.5,0.6,0.3,0.2);

}

function setMetroBox(id, color1, color2, color3, inValue, outValue, h1, h2, h3)
{
	$("#"+id).css(setMetroBoxActive(color1,color2));
	drawOnCanvas(id,color3,inValue,outValue,h1,h2,h3);
	
}

function doTooltip()
{
	
	$("#tooltip").click(
		function()
		{
			$("#tooltip").css("visibility","hidden");
		}
	);
	
	$(".metroBox").mouseenter(
		function(event)
		{
			
			var id1 = event.target.id[event.target.id.length-1];
			$("#"+id1).css("opacity",1);
			$("#"+id1).css("font-variant","small-caps");

			var id2 = event.target.id.replace(id1,"");
			$("#"+id2).css("opacity",1);
			$("#"+id2).css("font-variant","small-caps");
			//alert(id2);

			//$(this).css("z-index",100);
			//$("div.fadeout").css("visibility","visible");
			
			//alert("");
			//$("#tooltip").css("visibility","visible");
			//$("#tooltip").css("left",$(this).position().left);
			//$("#tooltip").css("top",$(this).position().top);
			//$("#tooltip").text("ASASASASS");
		}
	).mouseleave(
		function(event)
		{
			//$(this).removeClass("animation");

			var id1 = event.target.id[event.target.id.length-1];
			$("#"+id1).css("opacity",0.5);
			$("#"+id1).css("font-variant","normal");

			var id2 = event.target.id.replace(id1,"");
			$("#"+id2).css("opacity",0.5);
			$("#"+id2).css("font-variant","normal");

			//$(this).css("z-index",0);
			//$("div.fadeout").css("visibility","hidden");
		}
	).click(
		function (event) 
		{
			  window.qml.openVO("VoMap",event.pageX,event.pageY,"","#ffffff");
		}
	);
	

}

function drawOnCanvas(canvasId, color, inValue, outValue, h1, h2, h3)
{
	var c_canvas = document.getElementById(canvasId);
	var context = c_canvas.getContext("2d");

	var tcount = inValue + outValue;
	var bsize = getTcountSize(tcount)/2;
	var o = 0.5*bsize*2/4+0.5;
	//var colorlvl = getTcountSize(tcount)*200/4 + 50;
	//var bcolor = "rgba("+colorlvl*0+","+colorlvl+","+colorlvl*0+",0.3)";
	var bcolor = color;
	//var bcolor = "#ff0000";
	var h4 = tcount;
	var ww = 80;
	var max = Math.max(h1,h2,h3,h4) * 2.25;
	
	h1 = h1/max;
	h2 = h2/max;
	h3 = h3/max;
	h4 = h4/max;

	var w = (c_canvas.width - 20 - ww)/3;
	var x1 = 10;
	var x2 = x1 + w;
	var x3 = x2+w;
	var x4 = x3+w;

	var y0 = c_canvas.height - 10;
	var y1 = Math.floor(c_canvas.height * (1-h1))- 10;
	var y2 = Math.floor(c_canvas.height * (1-h2))- 10;
	var y3 = Math.floor(c_canvas.height * (1-h3))- 10;
	var y4 = Math.floor(c_canvas.height * (1-h4))- 10;

	var h = c_canvas.height - y4 - 10;
	if (h<=0) h=0;
	
	var hi = h * inValue/(inValue + outValue);
	var ho = h * outValue/(inValue + outValue);


	context.font = "12px Segoe UI Light";
	context.textAlign ="left";
	context.textBaseline = "bottom";
	context.fillStyle = color;
	//context.textAlign ="left";
	
	context.fillText(">> "+inValue, x4+5, y4-2,ww);

	//context.textAlign ="right";
	context.fillText("<< "+outValue, x4+5, y4-18,ww);

	//context.textAlign ="center";

	context.textAlign ="right";
	//context.textBaseline = "bottom";
	context.fillStyle = color;
	context.font = "30px Segoe UI Light";
	//context.fillText(tcount, c_canvas.width - 45, c_canvas.height-50);
	context.fillText(addCommas(tcount), x4+ww, y4-32, ww);
	
	context.fillStyle = "rgba(10,10,10,0.2)";
	context.fillRect(x4+5,y4,ww-5,h);
	context.fillStyle = "rgba(10,10,10,0.2)";
	context.fillRect(10,10,w*3,y0-10);

	//context.lineJoin = "miter";
	//context.lineWidth = bsize*2;
	//context.strokeStyle = bcolor;
	//context.moveTo(bsize,bsize);
	//context.lineTo(bsize,c_canvas.height-bsize);
	//context.lineTo(c_canvas.width-bsize,c_canvas.height-bsize);
	//context.lineTo(c_canvas.width-bsize,bsize);
	//context.lineTo(bsize,bsize);
	//context.lineTo(bsize,c_canvas.height-bsize);
	//context.stroke();


	context.beginPath();
	context.fillStyle = "rgba(10,10,10,0.2)";
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineTo(x3,y3);
	context.lineTo(x4,y4);

	context.lineTo(x4,10);
	context.lineTo(x1,10);
	context.lineTo(x1,y1);

	context.closePath();
	context.fill();	


	$("#"+canvasId).css("-webkit-box-shadow","0 0 "+bsize*5+"px "+color)
	$("#"+canvasId).css("border-color",color)
	$("#"+canvasId).css("opacity",o)

    
}

function getTcountSize(tcount)
{
	if (tcount >= tcount_grp[3]) return 4;
	else if (tcount >= tcount_grp[2]) return 3;
	else if (tcount >= tcount_grp[1]) return 2;
	else return 1;
}

function executeFunctions()
{
	$(".profile").click(
		function()
		{	
			window.qml.openVO("DatePicker",myX,myY,"","#ffffff");
		}	
	);

}

function drawMetroBox()
{
	var List = ["Internal","WhiteList","GrayList","BlackList"];
	var Severity = ["xHigh","High","Moderate","Low"];
	
  	var html = "";
  	for (var i=0; i<Severity.length; i++)
  	{
	  	for (var j=0; j<List.length; j++)
		{
			html += getMetroBoxHTML(i*18,j*20,Severity[i]+"-"+List[j],Severity[i]+"-"+List[j]);
		}
  	}
  
  	document.getElementById('metro-container').innerHTML = html;
}

function getMetroBoxHTML(x, y, title, id)
{
	//var html = "<div class='metroBox' id='"+id+"' style='position:absolute;left:"+x+"%;top:"+y+"%;'>"+title+"</div>";
	var html = "<div class='metroBox' id='"+id+"'>"+title+"<canvas height=200 width=200></canvas></div>";

	return html;
}


function trackMousePosition()
{
	$(document).mousemove(
		function(e)
		{ 
			myX = e.pageX; 
			myY = e.pageY; 			
			//document.title = e.pageX +', '+ e.pageY+" = "+dy;

		}); 
}


function generateMetroStyleBox(div_id, x, y, size, in_size, out_size)
{
	var string;
	$("#metroBox").css(getStyleBackgroundGradient(200,255,200,1,220,255,220,1));
	$("#metroBox").css("height","600");
	$("#metroBox").css("width","600");
	$("#metroBox").css("z-index","150");
}

function setMetroBoxActive(color1, color2)
{	
	var code2 = "-moz-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code3 = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,"+color1+"), color-stop(100%,"+color2+"))";
	var code4 = "-ms-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code5 = "-o-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code6 = "-webkit-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	//var code7 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='rgba("+r0+","+g0+","+b0+","+a0+")', endColorstr='rgba("+r1+","+g1+","+b1+","+a1+")')";

	var cssList = {"opacity":1, "background-color" : color1,"background" : code2, "background" : code3, "background" : code4, "background" : code5, "background" : code6};
	return cssList;
}

function getStyleBackgroundGradient2(color1, color2)
{

	var code2 = "-moz-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code3 = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,"+color1+"), color-stop(100%,"+color2+"))";
	var code4 = "-ms-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code5 = "-o-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	var code6 = "-webkit-linear-gradient(left top, "+color1+" 0%, "+color2+" 100%)";
	//var code7 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='rgba("+r0+","+g0+","+b0+","+a0+")', endColorstr='rgba("+r1+","+g1+","+b1+","+a1+")')";

	var cssList = { "background-color" : color1,"background" : code2, "background" : code3, "background" : code4, "background" : code5, "background" : code6};
	//var cssList = { "background-color" : "#000000"};
	//var cssList = { "background" : code3 };
	
	return cssList;
}

function getStyleBackgroundGradient(r0,g0,b0,a0,r1,g1,b1,a1)
{
	var code1 = "rgba("+r0+","+g0+","+b0+","+a0+")";
	var code2 = "-moz-linear-gradient(left top, rgba("+r0+","+g0+","+b0+","+a0+") 0%, rgba("+r1+","+g1+","+b1+","+a1+") 100%)";
	var code3 = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba("+r1+","+g1+","+b1+","+a1+")), color-stop(100%,rgba("+r1+","+g1+","+b1+","+a1+")))";
	var code4 = "-ms-linear-gradient(left top, rgba("+r0+","+g0+","+b0+","+a0+") 0%, rgba("+r1+","+g1+","+b1+","+a1+") 100%)";
	var code5 = "-o-linear-gradient(left top, rgba("+r0+","+g0+","+b0+","+a0+") 0%, rgba("+r1+","+g1+","+b1+","+a1+") 100%)";
	var code6 = "-webkit-linear-gradient(left top, rgba("+r0+","+g0+","+b0+","+a0+") 0%, rgba("+r1+","+g1+","+b1+","+a1+") 100%)";
	//var code7 = "progid:DXImageTransform.Microsoft.gradient(startColorstr='rgba("+r0+","+g0+","+b0+","+a0+")', endColorstr='rgba("+r1+","+g1+","+b1+","+a1+")')";

	var cssList = { "background-color" : code1,"background" : code2, "background" : code3, "background" : code4, "background" : code5, "background" : code6};
	//var cssList = { "background" : code3 };
	
	return cssList;
}

function examineOverviewBox(groupRisk, groupRiskname)	
{
	if(groupRisk.active)
	{
		var box = document.getElementById(String(groupRiskname));
 
		box.style.visibility = "visible";
		
		box.style.width = groupRisk.size*22+"%";
		box.style.height = groupRisk.size*20+"%";
		
		var box1 = box.getElementsByClassName("bar"); 
		
		for (var i = 0; i < groupRisk.in; i++){
	  		box1[4-i].style.backgroundColor="gold";
	  		box1[4-i].style.opacity=0.8;
	  		box1[4-i].style.borderColor="gray";
		};

		for (var i = 0; i < groupRisk.out; i++){
	  		box1[4+i].style.backgroundColor="orange";
	  		box1[4+i].style.opacity=0.8;
	  		box1[4+i].style.borderColor="gray";
		};
	}
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
	
	
//jQuery.getJSON("overviewData.txt", 
	//function(json) 
	//{
   		//alert("JSON Data: " + json.blacklist_xhigh.id);

		//examineOverviewBox(json.internal_xhigh,"internal_xhigh");
		//examineOverviewBox(json.internal_high,"internal_high");
		//examineOverviewBox(json.internal_med,"internal_med");
		//examineOverviewBox(json.internal_low,"internal_low");
		
		//examineOverviewBox(json.whitelist_xhigh,"whitelist_xhigh");
		//examineOverviewBox(json.whitelist_high,"whitelist_high");
		//examineOverviewBox(json.whitelist_med,"whitelist_med");
		//examineOverviewBox(json.whitelist_low,"whitelist_low");

		//examineOverviewBox(json.graylist_xhigh,"graylist_xhigh");
		//examineOverviewBox(json.graylist_high,"graylist_high");
		//examineOverviewBox(json.graylist_med,"graylist_med");
		//examineOverviewBox(json.graylist_low,"graylist_low");
//
		//examineOverviewBox(json.blacklist_xhigh,"blacklist_xhigh");
		//examineOverviewBox(json.blacklist_high,"blacklist_high");
		//examineOverviewBox(json.blacklist_med,"blacklist_med");
		//examineOverviewBox(json.blacklist_low,"blacklist_low");
 	//}
 //);