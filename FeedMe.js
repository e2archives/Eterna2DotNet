(function() {

var anim = 0, pig = [], dollars, f = 0, fd = 1, fa = 0.5, x = 0, y = 0, tx = 0, ty = 0, v = 0.5, iw = 64, ih = 64, t = false, food = [], w, h, ran = true;

var Start = function(){
    var canvas = document.getElementById('feedmeCanvas'),
	ctx = canvas.getContext('2d');
    w = canvas.width,
    h = canvas.height; 
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	x = (w-iw)/2;
	y = (h-ih)/2;
	
	
	pig.push(new Image());
	pig[0].onload = function(){
        ctx.drawImage(pig[0], x, y, iw, ih);
    };
    pig[0].src = "pig.png";

	pig.push(new Image());
    pig[1].src = "pig2.png";

	
	dollars = new Image();
    dollars.src = "dollars.png";
		
	canvas.addEventListener( 'touchstart', TouchStart, false );
	canvas.addEventListener( 'touchmove', TouchMove, false );
	canvas.addEventListener( 'touchend', TouchEnd, false );
	canvas.addEventListener( 'mousemove', MouseMove, false );
	canvas.addEventListener( 'mouseup', MouseUp, false );
	
    window.setInterval(Update, 30);
};


var MouseUp = function(event) {

    var canvas = document.getElementById('feedmeCanvas'),
	ctx = canvas.getContext('2d'),	
	mx = event.offsetX,
	my = event.offsetY;
	food.push(mx);
	food.push(my);

}

var MouseMove = function(event) {

}

var TouchStart = function(event) {

	console.log(event);
	if ( event.touches.length > 1 ) {

		event.preventDefault();
		t = true;
		//mouseX = event.touches[ 0 ].pageX - halfWidth;
		//mouseY = event.touches[ 0 ].pageY - halfHeight;
		var mx = event.touches[ 0 ].pageX,
		my = event.touches[ 0 ].pageY;
		
		ctx.drawImage(pig, mx, my, iw, ih);

	}

}

var TouchMove = function(event) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		var mx = event.touches[ 0 ].pageX,
		my = event.touches[ 0 ].pageY;
		
		//ctx.drawImage(pig, mx, my, iw, ih);
	}

}

var TouchEnd = function(event) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();
		t = false;
		//mouseX = event.touches[ 0 ].pageX - halfWidth;
		//mouseY = event.touches[ 0 ].pageY - halfHeight;

	}

}

var MovePig = function(min){


	if (min == -1 && ran === true)
	{
		tx = iw + Math.random() * (w-2*iw);
		ty = ih + Math.random() * (h-2*ih);
		ran = false;
	}
	
	var dx = tx - x,
	dy = ty - y,
	n = dx*dx+dy*dy;
	
	if (n >= 0 && n <= 25) 
	{
		x = tx;
		y = ty;
		if (min != -1) 
		{
			food.splice(min,2);
			ih += 2;
			iw += 2;		
		}
		else ran = true;
	}
	else
	{
		n = 1/Math.sqrt(n);
	
		dx *= n * v;
		dy *= n * v;
	
		x += dx;
		y += dy;
	}
	
	f += fd*fa;
	if (f >= 5) 
	{
		fd *= -1;
		if (anim == 0) anim = 1;
		else anim = 0;
	}
	else if (f <= -5)
	{
		fd *= -1;
	}
	
	
}


var Update = function(){

	var canvas = document.getElementById('feedmeCanvas'),
	ctx = canvas.getContext('2d'),
	dw = dollars.width/2,
	dh = dollars.height/2,
	dmin = w*w+h*h,
	d = 0,
	dd =0,
	min = -1,
	sumx = 0,
	sumy = 0;
	
	ctx.save();
	ctx.setTransform(w, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, w, h);
	ctx.restore();

	ctx.save();
	for (var i=0, len=food.length; i<len; i+=2)
	{
		sumx += food[i];
		sumy += food[i+1];
	}	
	
	sumx /= food.length/2;
	sumy /= food.length/2;
	
	for (var i=0, len=food.length; i<len; i+=2)
	{
		ctx.drawImage(dollars, food[i]-dw, food[i+1]-dh);
		var dx = food[i] - sumx,
		dy = food[i+1] - sumy;
		d = dx*dx+dy*dy;

		dx = sumx - x,
		dy = sumy - y;
		d += dx*dx+dy*dy;
		
		dx = food[i] - x,
		dy = food[i+1] - y;
		dd = dx*dx+dy*dy;
		
		if (dd <= iw*iw) 
		{
			dmin = dd;
			min = i;
		}
		else if (dmin > d)
		{
			dmin = d;
			min = i;
		}
	}
	ctx.restore();
	
	ctx.save();
	ctx.translate(x, y+ih/2);
	ctx.rotate(f*Math.PI/180);
	ctx.translate(-x, -y-ih/2);
	ctx.drawImage(pig[anim], x-iw/2, y-ih/2, iw, ih);
	ctx.restore();

	if (min !== -1)
	{
		tx = food[min];
		ty = food[min+1];
	}

	MovePig(min);


	
};

var GetPowerOfTwo = function(value, pow) {
	var pow = pow || 1;
	while(pow<value) {
		pow *= 2;
	}
	return pow;
};


var GetPigImage = function(width, height){

	var pigCanvas = document.createElement("canvas"),
	ctx = pigCanvas.getContext('2d'),
	w = Math.max(GetPowerOfTwo(width/5),64),
	h = Math.max(GetPowerOfTwo(height/5),64),
	r = Math.max(w,h)/2,
	t = 2,
	r1 = r-2*t,
	r2 = r1/2;
		
	pigCanvas.width = w;
	pigCanvas.height = h;
	
	ctx.fillStyle="#FAAFBA";
	ctx.beginPath();
	ctx.arc(w/2,h/2,r1,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle="#FFFFFF";
	ctx.beginPath();
	ctx.arc(w/2-r2,h/2,r2,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle="#FFFFFF";
	ctx.beginPath();
	ctx.arc(w/2+r2,h/2,r2,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	return ctx.getImageData(0,0,w,h);
};

Start();

}());