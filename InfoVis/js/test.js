var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,
camera, scene, renderer,
geometry, material, mesh,
fontFamily = "Segoe UI Light";

init();
animate();

function init() {

        renderer = new THREE.WebGLRenderer({ clearColor: 0x000000, clearAlpha: 1, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
 
 
        // scene
        scene = new THREE.Scene();
 
        // camera
	camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 700;
	scene.add( camera );
  
	
	mesh = renderText(100,100,-100,"ABCasdasdasdasdasdasdasdafdgdfgfdasdasdasd asdasdasdasd kjklasdjklasjdkljaslkdhaskldh asdjklasjdklasjdkljaskdjklasd jasdasdasdasdasd gfgsdasdD", 20, "#FFFFFF", "center", "bottom", fontFamily, 500);
	scene.addObject(mesh);
	
	setWallpaper();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );


}

function animate() {

	// note: three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );
	render();

}

function render() {

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;

	//camera.lookAt( scene.position );
	//renderer.render( scene, camera );
	
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;

	camera.lookAt( scene.position );
	renderer.render( scene, camera );
	//renderer.clear();

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}

}



function renderText(x, y, z, textToWrite, textHeight, fontColor, textAlign, textBaseline, fontFamily, maxWidth)
{			
	var text = [],
	textX, textY,
	canvasTexture;

	// get canvas
	var canvas = document.getElementById('textureCanvas');
	if (!canvas) canvas = document.createElement("textureCanvas");
	
	var ctx = canvas.getContext('2d');

	// 2D Canvas text rendering properties
	createMultilineText(ctx, textToWrite, maxWidth, text);
	canvasX = getPowerOfTwo(maxWidth);
	canvasY = getPowerOfTwo(textHeight*(text.length+1));
	canvas.width = canvasX;
	canvas.height = canvasY;

	
	ctx.fillStyle = fontColor; 	
	ctx.textAlign = textAlign;	
	ctx.textBaseline = textBaseline;	
	ctx.font = textHeight+"px "+fontFamily;	

	textX = canvasX/2;
	var offset = (canvasY - textHeight*(text.length+1)) * 0.5;

	for(var i = 0; i < text.length; i++) {
		textY = (i+1)*textHeight + offset;
		ctx.fillText(text[i], textX,  textY);
	}

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	var material = new THREE.MeshBasicMaterial({
		map : texture, transparent: true
	});

	material.opacity = 0.8;
	
	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
	// mesh.overdraw = true;
	mesh.doubleSided = true;
	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;

	return mesh;

}

function setWallpaper()
{
	var materials = [

		loadTexture( '../resource/texture/skybox/px.jpg' ), // right
		loadTexture( '../resource/texture/skybox/nx.jpg' ), // left
		loadTexture( '../resource/texture/skybox/py.jpg' ), // top
		loadTexture( '../resource/texture/skybox/ny.jpg' ), // bottom
		loadTexture( '../resource/texture/skybox/pz.jpg' ), // back
		loadTexture( '../resource/texture/skybox/nz.jpg' )  // front

	];

	var size = Math.max(window.innerWidth, window.innerHeight);
	
	var skybox = new THREE.Mesh( new THREE.CubeGeometry( size, size, size, 7, 7, 7, materials ), new THREE.MeshFaceMaterial() );
	skybox.scale.x = - 1;
	scene.add( skybox );
	
	
}

function loadTexture( path ) {

	var texture = ImageUtils_loadTexture( path , THREE.UVMapping);
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

	return material;

}

function ImageUtils_loadTexture(path, mapping){
	//var texture = new THREE.Texture( path, mapping );
	//texture.needsUpdate = true;
	//return texture;
	var img = new Image,
	texture = new THREE.Texture(img,mapping);
	
	img.onload=function(){
		texture.needsUpdate=!0;
		//c&&c(this);
	};
	//d.crossOrigin = this.crossOrigin;
	img.src = path;
	
	return texture;
	
}




function getPowerOfTwo(value, pow) {
	var pow = pow || 1;
	while(pow<value) {
		pow *= 2;
	}
	return pow;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) {
	textToWrite = textToWrite.replace("\n"," ");
	var currentText = textToWrite;
	var futureText;
	var subWidth = 0;
	var maxLineWidth = 0;
	
	var wordArray = textToWrite.split(" ");
	var wordsInCurrent, wordArrayLength;
	wordsInCurrent = wordArrayLength = wordArray.length;

	// Reduce currentText until it is less than maxWidth or is a single word
	// futureText var keeps track of text not yet written to a text line
	while (ctx.measureText(currentText).width > maxWidth && wordsInCurrent > 1) {
	//console.log(ctx.measureText(currentText));
	//console.log(wordsInCurrent);
		wordsInCurrent--;
		var linebreak = false;	
		
		currentText = futureText = "";
		for(var i = 0; i < wordArrayLength; i++) {
			if (i < wordsInCurrent) {
				currentText += wordArray[i];
				if (i+1 < wordsInCurrent) { currentText += " "; }
			}
			else {
				futureText += wordArray[i];
				if(i+1 < wordArrayLength) { futureText += " "; }
			}
		}
	}
	
					

	text.push(currentText); // Write this line of text to the array
	maxLineWidth = ctx.measureText(currentText);
	
	// If there is any text left to be written call the function again
	if(futureText) {
		subWidth = createMultilineText(ctx, futureText, maxWidth, text);
		if (subWidth > maxLineWidth) { 
			maxLineWidth = subWidth;
		}
	}
	
	// Return the maximum line width
	return maxLineWidth;
}

