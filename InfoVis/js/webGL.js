/*

	Author: eterna2@hotmail.com
	
	Credits:
		Three.js: https://github.com/mrdoob/three.js
		
		Text Rendering: 
			http://www.spoonofdeath.com/delph/webgltext.html
			https://gist.github.com/1186920
*/

//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

fontFamily = "Segoe UI Light",

camera, scene, renderer, material, composer, gl;


init();
animate();

function init() {

	var i, container;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 700;
	scene.add( camera );

	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;

	container.appendChild( renderer.domElement );
	//renderer.domElement.style.width = "100%";
	//renderer.domElement.style.height = "100%";
	
	
	
	var geometry = new THREE.Geometry(),
		geometry2 = new THREE.Geometry(),
		geometry3 = new THREE.Geometry(),
		points = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, 2, 0, 1, 2, 3, 4, 5, 6, 7 ),
		colors = [], colors2 = [], colors3 = [];

	for ( i = 0; i < points.length; i ++ ) {

		geometry.vertices.push( new THREE.Vertex( points[ i ] ) );

		colors[ i ] = new THREE.Color( 0xffffff );
		colors[ i ].setHSV( 0.6, ( 200 + points[ i ].x ) / 400, 1.0 );

		colors2[ i ] = new THREE.Color( 0xffffff );
		colors2[ i ].setHSV( 0.3, 1.0, ( 200 + points[ i ].x ) / 400 );

		colors3[ i ] = new THREE.Color( 0xffffff );
		colors3[ i ].setHSV( i / points.length, 1.0, 1.0 );

	}

	geometry2.vertices = geometry3.vertices = geometry.vertices;

	geometry.colors = colors;
	geometry2.colors = colors2;
	geometry3.colors = colors3;

	// lines

	material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3 } );

	var line, p, scale = 0.3, d = 225,
		parameters =  [ [ material, scale*1.5, [-d,0,0],  geometry ],
						[ material, scale*1.5, [0,0,0],  geometry2 ],
						[ material, scale*1.5, [d,0,0],  geometry3 ] ];

	material.vertexColors = true;

	for ( i = 0; i < parameters.length; ++i ) {

		p = parameters[ i ];
		line = new THREE.Line( p[ 3 ],  p[ 0 ] );
		line.scale.x = line.scale.y = line.scale.z =  p[ 1 ];
		line.position.x = p[ 2 ][ 0 ];
		line.position.y = p[ 2 ][ 1 ];
		line.position.z = p[ 2 ][ 2 ];
		scene.add( line );

	}

	//

	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '0px';
	//container.appendChild( stats.domElement );

	//

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	var renderModel = new THREE.RenderPass( scene, camera );
	var effectBloom = new THREE.BloomPass( 1.3 );
	var effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
	var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );

	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

	effectScreen.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderModel );
	//composer.addPass( effectFXAA );
	//composer.addPass( effectBloom );
	composer.addPass( effectScreen );

	gl = renderer.getContext("experimental-webgl");
	
	//var mesh = renderText(100,100,-100,"ABCasdasdasdasdasdasdasdafdgdfgfdasdasdasd asdasdasdasd kjklasdjklasjdkljaslkdhaskldh asdjklasjdklasjdkljaskdjklasd jasdasdasdasdasd gfgsdasdD", 20, "#FFFFFF", "center", "bottom", fontFamily, 500);
	//scene.addObject(mesh);
	
	setWallpaper();
	WindowResize(renderer, camera);
}

// port of Processing Java code by Thomas Diewald
// http://www.openprocessing.org/visuals/?visualID=15599

function hilbert3D( center, side, iterations, v0, v1, v2, v3, v4, v5, v6, v7 ) {

	var half = side / 2,

		vec_s = [

		new THREE.Vector3( center.x - half, center.y + half, center.z - half ),
		new THREE.Vector3( center.x - half, center.y + half, center.z + half ),
		new THREE.Vector3( center.x - half, center.y - half, center.z + half ),
		new THREE.Vector3( center.x - half, center.y - half, center.z - half ),
		new THREE.Vector3( center.x + half, center.y - half, center.z - half ),
		new THREE.Vector3( center.x + half, center.y - half, center.z + half ),
		new THREE.Vector3( center.x + half, center.y + half, center.z + half ),
		new THREE.Vector3( center.x + half, center.y + half, center.z - half )

		],

		vec = [ vec_s[ v0 ], vec_s[ v1 ], vec_s[ v2 ], vec_s[ v3 ], vec_s[ v4 ], vec_s[ v5 ], vec_s[ v6 ], vec_s[ v7 ] ];

	if( --iterations >= 0 ) {

		var tmp = [];

		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 0 ], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 1 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 2 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 3 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 4 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 5 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 6 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 7 ], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7 ) );

		return tmp;

	}

	return vec;
}

//

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

//

function animate() {

	requestAnimationFrame( animate );
	render();

	//stats.update();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	var time = Date.now() * 0.0005;

	for( var i = 0; i < scene.objects.length; i ++ ) {

		//scene.objects[ i ].rotation.y = time * ( i % 2 ? 1 : -1 );

	}

	renderer.clear();
	composer.render();

}






function shapeInit(imageCanvas)
{

}

function loadTexture( path ) {

	var image = new Image;
	var texture = new THREE.Texture( image, THREE.UVMapping );
	image.onload = function(){
		texture.needsUpdate =! 0;	
	};	
	image.src = path;

	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

	return material;

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
	
	
	mesh = new THREE.Mesh( new THREE.CubeGeometry( size, size, size, 7, 7, 7, materials ), new THREE.MeshFaceMaterial() );
	mesh.scale.x = - 1;
	scene.add( mesh );
	
	
}

function createLabel(text, x, y, z, size, color, backGroundColor, backgroundMargin, font) {
	if(!backgroundMargin)
		backgroundMargin = 50;

	var canvas = document.createElement("canvas");
	canvas.style ="background-color: transparent";

	var context = canvas.getContext("2d");
	context.font = size + "pt Arial";

	var textWidth = context.measureText(text).width;

	canvas.width = textWidth + backgroundMargin;
	canvas.height = size + backgroundMargin;
	context = canvas.getContext("2d");
	context.font = size + "px "+fontFamily;

	if(backGroundColor) {
		context.fillStyle = backGroundColor;
		context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
	}

	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = color;
	context.fillText(text, canvas.width / 2, canvas.height / 2);

	// context.strokeStyle = "black";
	// context.strokeRect(0, 0, canvas.width, canvas.height);


}

function initTexture(canvas) {
	canvasTexture = gl.createTexture();
	handleLoadedTexture(canvasTexture, canvas);
}

function handleLoadedTexture(texture, textureCanvas) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
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
	return maxLineWidth.width;
}

function generateShapes(parent)
{
	var extrudeSettings = {	amount: 2,  bevelEnabled: false, bevelSegments: 2, steps: 2 , bevelSize: 2, bevelThickness:1}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5,

	var roundedRectShape = new THREE.Shape();
	roundedRect( roundedRectShape, 0, 0, 50, 50, 20 );

	var roundedRect3d = roundedRectShape.extrude( extrudeSettings );
	var roundedRectPoints = roundedRectShape.createPointsGeometry();
	var roundedRectSpacedPoints = roundedRectShape.createSpacedPointsGeometry();

	function roundedRect( ctx, x, y, width, height, radius ){

		ctx.moveTo( x, y + radius );
		ctx.lineTo( x, y + height - radius );
		ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
		ctx.lineTo( x + width - radius, y + height) ;
		ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
		ctx.lineTo( x + width, y + radius );
		ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
		ctx.lineTo( x + radius, y );
		ctx.quadraticCurveTo( x, y, x, y + radius );

	}
	
	addGeometry(parent, roundedRect3d, roundedRectPoints, roundedRectSpacedPoints,	0x005500, -150,  150, 0, 0, 0, 0, 1 );
}

function addGeometry(parent, geometry, points, spacedPoints, color, x, y, z, rx, ry, rz, s ) {

	// 3d shape
	var material =  new THREE.MeshLambertMaterial( { color: color } );
	//var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set( x, y, z - 75 );
	mesh.rotation.set( rx, ry, rz );
	mesh.scale.set( s, s, s );
	parent.add( mesh );

	// solid line

	//var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 2 } ) );
	//line.position.set( x, y, z + 25 );
	//line.rotation.set( rx, ry, rz );
	//line.scale.set( s, s, s );
	//parent.add( line );

	// transparent line from real points

	//var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, opacity: 0.5 } ) );
	//line.position.set( x, y, z + 75 );
	//line.rotation.set( rx, ry, rz );
	//line.scale.set( s, s, s );
	//parent.add( line );

	// vertices from real points

	//var pgeo = THREE.GeometryUtils.clone( points );
	//var particles = new THREE.ParticleSystem( pgeo, new THREE.ParticleBasicMaterial( { color: color, size: 2, opacity: 0.75 } ) );
	//particles.position.set( x, y, z + 75 );
	//particles.rotation.set( rx, ry, rz );
	//particles.scale.set( s, s, s );
	//parent.add( particles );

	// transparent line from equidistance sampled points

	//var line = new THREE.Line( spacedPoints, new THREE.LineBasicMaterial( { color: color, opacity: 0.2 } ) );
	//line.position.set( x, y, z + 100 );
	//line.rotation.set( rx, ry, rz );
	//line.scale.set( s, s, s );
	//parent.add( line );

	// equidistance sampled points

	//var pgeo = THREE.GeometryUtils.clone( spacedPoints );
	//var particles2 = new THREE.ParticleSystem( pgeo, new THREE.ParticleBasicMaterial( { color: color, size: 2, opacity: 0.5 } ) );
	//particles2.position.set( x, y, z + 100 );
	//particles2.rotation.set( rx, ry, rz );
	//particles2.scale.set( s, s, s );
	//parent.add( particles2 );

}

function WindowResize(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}