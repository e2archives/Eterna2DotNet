var camera, scene, renderer;

var texture_placeholder;
var isUserInteracting = false;
var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var lon = 90, onMouseDownLon = 0;
var lat = 0, onMouseDownLat = 0;
var phi = 0, theta = 0, target = new THREE.Vector3();

init();

function init() {

	var container, mesh;
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	scene = new THREE.Scene();

	scene.add(camera);
	texture_placeholder = document.createElement('canvas');
	texture_placeholder.width = 128;
	texture_placeholder.height = 128;

	var context = texture_placeholder.getContext('2d');
	context.fillStyle = 'rgb( 200, 200, 200 )';
	context.fillRect(0, 0, texture_placeholder.width, texture_placeholder.height);

	var materials = [loadTexture('../resource/texture/skybox/px.jpg'), // right
	loadTexture('../resource/texture/skybox/nx.jpg'), // left
	loadTexture('../resource/texture/skybox/py.jpg'), // top
	loadTexture('../resource/texture/skybox/ny.jpg'), // bottom
	loadTexture('../resource/texture/skybox/pz.jpg'), // back
	loadTexture('../resource/texture/skybox/nz.jpg') // front

	];
	mesh = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 7, 7, 7, materials), new THREE.MeshFaceMaterial());
	mesh.scale.x = -1;
	scene.add(mesh);

	for(var i = 0, l = mesh.geometry.vertices.length; i < l; i++) {

		var vertex = mesh.geometry.vertices[i];

		vertex.position.normalize();
		vertex.position.multiplyScalar(550);

	}
	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mousewheel', onDocumentMouseWheel, false);
	document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);

}

function loadTexture(path) {

	var texture = new THREE.Texture(texture_placeholder);
	var material = new THREE.MeshBasicMaterial({
		map : texture,
		overdraw : true
	});

	var image = new Image();
	image.onload = function() {

		texture.needsUpdate = true;
		material.map.image = this;

		render();

	};
	image.src = path;

	return material;

}

function onDocumentMouseDown(event) {

	event.preventDefault();
	isUserInteracting = true;
	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;
	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

	if(isUserInteracting) {
		lon = (onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = (event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		render();

	}
}

function onDocumentMouseUp(event) {
	isUserInteracting = false;
	render();

}

function onDocumentMouseWheel(event) {

	// WebKit

	if(event.wheelDeltaY) {

		camera.fov -= event.wheelDeltaY * 0.05;

		// Opera / Explorer 9

	} else if(event.wheelDelta) {

		camera.fov -= event.wheelDelta * 0.05;

		// Firefox

	} else if(event.detail) {

		camera.fov -= event.detail * 0.05;

	}

	camera.updateProjectionMatrix();

	render();

}

function onDocumentTouchStart(event) {

	if(event.touches.length == 1) {

		event.preventDefault();
		onPointerDownPointerX = event.touches[0].pageX;
		onPointerDownPointerY = event.touches[0].pageY;
		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}

}

function onDocumentTouchMove(event) {

	if(event.touches.length == 1) {

		event.preventDefault();
		lon = (onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
		lat = (event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

		render();

	}

}

function render() {
	lat = Math.max(-85, Math.min(85, lat));
	phi = (90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	target.x = 500 * Math.sin(phi) * Math.cos(theta);
	target.y = 500 * Math.cos(phi);
	target.z = 500 * Math.sin(phi) * Math.sin(theta);

	camera.position.x = -target.x;
	camera.position.y = -target.y;
	camera.position.z = -target.z;
	camera.lookAt(target);

	renderer.render(scene, camera);

}