(function(vizana, $, undefined){

// private

var ajaxArray = [],
queryStack = 0,
queryCallback;

function popQueryStack()
{
	queryStack--;
	
	if (queryStack <= 0) 
	{
		queryCallback();
		$(".loading").hide("fade","slow");
	}
}


// public

vizana.servelet = "http://172.27.183.11:8080/REtoServlet/ReHttpServlet";

vizana.Query = function(successFn, showLoading)
{
	if (showLoading) $(".loading").show("fade","slow");
	
	queryCallback = successFn;
	queryStack = ajaxArray.length;
	
	for (var i=0, len=ajaxArray.length; i<len; i++)
	{
		$.ajax({
			url: vizana.servelet,
			data: ajaxArray[i].data,
			dataType: "jsonp",
			jsonp: "callback",
			timeout: ajaxArray[i].timeout,
			success: ajaxArray[i].success,
			error: function(XHR, textStatus, errorThrown){alert("Failed to retrieve data: " + errorThrown);	}
		}).success(popQueryStack);
	}

	ajaxArray.length = 0;
}

vizana.addQuery = function(param, successFn, timeoutMS)
{
	if (!timeoutMS) timeoutMS = 10000;
	ajaxArray.push({data:param, success:successFn, timeout:timeoutMS }); 
}

vizana.jsonP = function(param, successFn, timeoutMS)
{
	if (!timeoutMS) timeoutMS = 10000;

	return $.ajax({
		url: vizana.servelet,
		data: param,
		dataType: "jsonp",
		jsonp: "callback",
		timeout: timeoutMS,
		success: successFn,
		error: function(XHR, textStatus, errorThrown){
        alert("Failed to retrieve data: " + errorThrown);
		}
	});
};

vizana.DIV = function(id, classname)
{
	var codes = '<DIV id="';
	codes += id;
	codes += '"';
	if (classname)
	{
		codes += ' class="';
		codes += classname;
		codes += '"';
	}	
	codes += '></div>';
	
	return codes;
};

vizana.DIVwithSPAN = function(id, classname)
{
	var codes = '<DIV id="';
	codes += id;
	codes += '"';
	if (classname)
	{
		codes += ' class="';
		codes += classname;
		codes += '"';
	}	
	codes += '><span></span></div>';
	
	return codes;
};

vizana.CANVAS = function(id, classname)
{
	var codes = '<CANVAS id="';
	codes += id;
	codes += '"';
	if (classname)
	{
		codes += ' class="';
		codes += classname;
		codes += '"';
	}	
	codes += '>Sorry, HTML5 Canvas is not supported by your browser!</CANVAS>';
	
	return codes;
};



}( window.vizana = window.vizana || {}, jQuery) );