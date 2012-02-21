var scene, camera, composer, renderer, mouseX, mouseY, innerHeightHalf = window.innerHeight/2, innerWidthHalf = window.innerWidth/2;
var state;

init();
animate(); 


function init(){

	var textureBox = [
		"../resource/texture/skybox/px.jpg",
		"../resource/texture/skybox/nx.jpg",
		"../resource/texture/skybox/py.jpg",
		"../resource/texture/skybox/ny.jpg",
		"../resource/texture/skybox/pz.jpg",
		"../resource/texture/skybox/nz.jpg"
	];
/*
	state = new E2THREE.DefaultSystemState();
	state.camera.position.z = 700;
	state.AddObject(E2THREE.createSkyBox(textureBox));
	//state.SetResizeCallback();
	renderer = state.renderer;
	camera = state.camera;
	scene = state.scene;
	WindowResize(renderer,camera);
	*/
	

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

	WindowResize(renderer,camera);

	container.appendChild( renderer.domElement );
	
		
	var textureBox = [
		"../resource/texture/skybox/px.jpg",
		"../resource/texture/skybox/nx.jpg",
		"../resource/texture/skybox/py.jpg",
		"../resource/texture/skybox/ny.jpg",
		"../resource/texture/skybox/pz.jpg",
		"../resource/texture/skybox/nz.jpg"
	];

	scene.add(E2THREE.createSkyBox(textureBox));
	
	//var renderedText = new 
	

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	
	
}
	

function animate() {

	requestAnimationFrame( animate );
	render();
}

function render() {

	//state.camera.position.x += ( state.mouseX - state.camera.position.x ) * .05;
	//state.camera.position.y += ( - state.mouseY + 200 - state.camera.position.y ) * .05;
	//state.LookAt( state.scene.position );
	renderer.render( scene, camera );
	//renderer.clear();
	//composer.render();
	//state.Render();
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - halfWidth;
	mouseY = event.clientY - halfHeight;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - halfWidth;
		mouseY = event.touches[ 0 ].pageY - halfHeight;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - halfWidth;
		mouseY = event.touches[ 0 ].pageY - halfHeight;
	}

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