/*

	E2THREE: eterna2@hotmail.com
	
	Credits:
		THREE.js: https://github.com/mrdoob/three.js
		
		Text Rendering: 
			http://www.spoonofdeath.com/delph/webgltext.html
			https://gist.github.com/1186920
			
		Window Resize:
			http://learningthreejs.com
*/

// namespace
var E2THREE	= E2THREE 		|| {};

E2THREE.DefaultSystemState = function(){

	this.container = document.createElement( 'div' );
	document.body.appendChild( this.container );
	
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	this.scene = new THREE.Scene();
	this.scene.add( this.camera );
	
	this.renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: true } );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.autoClear = true;
	this.container.appendChild( this.renderer.domElement );
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.fontFamily = "Segoe UI";
	
	this.width = window.innerWidth;
	this.height = window.innerHeight;
		
}

E2THREE.DefaultSystemState.prototype.AddObject = function(object){
	this.scene.add(object);
};

E2THREE.DefaultSystemState.prototype.RemoveObject = function(object){
	this.scene.removeObject(object);
};
	
E2THREE.DefaultSystemState.prototype.LookAt = function(position){
	this.camera.lookAt( position );
};

E2THREE.DefaultSystemState.prototype.TranslateCameraBy = function(x, y, z){
	this.camera.position.x += x;
	this.camera.position.y += y;
	this.camera.position.z += z;
};

E2THREE.DefaultSystemState.prototype.TranslateCameraTo = function(x, y, z){
	this.camera.position.x = x;
	this.camera.position.y = y;
	this.camera.position.z = z;
};

E2THREE.DefaultSystemState.prototype.Render = function(){
	this.renderer.render(this.scene, this.camera);
};

E2THREE.DefaultSystemState.prototype.InitShader = function(){
	var renderModel = new THREE.RenderPass( this.scene, this.camera );
	var effectBloom = new THREE.BloomPass( 1.3 );
	var effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
	var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );

	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	effectScreen.renderToScreen = true;

	this.composer = new THREE.EffectComposer( this.renderer );
	this.composer.addPass( renderModel );
	//composer.addPass( effectFXAA );
	//composer.addPass( effectBloom );
	this.composer.addPass( effectScreen );
}

E2THREE.DefaultSystemState.prototype.RenderShader = function(){
	this.renderer.clear();
	this.composer.render();
}

E2THREE.DefaultSystemState.prototype.SetResizeCallback = function(){
	var ResizeCallback = function(){

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.camera.aspect	= window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
	
	window.addEventListener('resize', ResizeCallback, false);	
};

E2THREE.DefaultSystemState.prototype.RemoveResizeCallback = function(){
	window.removeEventListener( 'resize', this.ResizeCallback );
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

/**
	Load and return a material based on a input Texture
	
	Input:
		texturePath <- path to the texture
	Return:
		material to the texture
**/
E2THREE.LoadTexture = function( texturePath ) {

	var image = new Image;
	var texture = new THREE.Texture( image, THREE.UVMapping );
	image.onload = function(){
		texture.needsUpdate =! 0;	
	};	
	image.src = texturePath;

	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

	return material;

}


/** 
	Object to hold the mesh of a skybox with the input texture
	
	Input:
		boxTexture -> array of path to texture files -> px, nx, py, ny, pz, nz
	Return:
		mesh of the skybox

**/
E2THREE.SkyBox = function( boxTexture )
{
	var materials = [

		E2THREE.LoadTexture( boxTexture[0] ), // right
		E2THREE.LoadTexture( boxTexture[1] ), // left
		E2THREE.LoadTexture( boxTexture[2] ), // top
		E2THREE.LoadTexture( boxTexture[3] ), // bottom
		E2THREE.LoadTexture( boxTexture[4] ), // back
		E2THREE.LoadTexture( boxTexture[5] )  // front

	];

	var size = Math.max(window.innerWidth, window.innerHeight);
	
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( size, size, size, 7, 7, 7, materials ), new THREE.MeshFaceMaterial() );
	this.mesh.scale.x = - 1;	
}

E2THREE.createSkyBox = function( boxTexture )
{
	var materials = [

		E2THREE.LoadTexture( boxTexture[0] ), // right
		E2THREE.LoadTexture( boxTexture[1] ), // left
		E2THREE.LoadTexture( boxTexture[2] ), // top
		E2THREE.LoadTexture( boxTexture[3] ), // bottom
		E2THREE.LoadTexture( boxTexture[4] ), // back
		E2THREE.LoadTexture( boxTexture[5] )  // front

	];

	var size = Math.max(window.innerWidth, window.innerHeight);
	
	var mesh = new THREE.Mesh( new THREE.CubeGeometry( size, size, size, 7, 7, 7, materials ), new THREE.MeshFaceMaterial() );
	mesh.scale.x = - 1;	
	
	return mesh;
}

/**
	Object to hold the mesh for a multiline text 
	
	Inputs:
		x, y, z <- position where the text will appear, relative from the top left corner
		textToWrite <- multi-line text
		textHeight <- font size based on pixel
		fontColor <- font color
		textAlign <- alignment of the text (follows canvas2D)
		fontFamily <- font
		maxWidth <- max width of each line
		
	Property:
		mesh of the text
**/
E2THREE.MultilineText = function(x, y, z, textToWrite, textHeight, fontColor, textAlign, fontFamily, maxWidth)
{			
	var text = [],
	textX, textY,
	canvasTexture;

	// get canvas
	var canvas = document.getElementById('textureCanvas');
	if (!canvas) canvas = document.createElement("textureCanvas");
	
	var ctx = canvas.getContext('2d');

	// 2D Canvas text rendering properties
	E2THREE.ReturnMultilineText(ctx, textToWrite, maxWidth, text);
	canvasX = E2THREE.GetPowerOfTwo(maxWidth);
	canvasY = E2THREE.GetPowerOfTwo(textHeight*(text.length+1));
	canvas.width = canvasX;
	canvas.height = canvasY;

	
	ctx.fillStyle = fontColor; 	
	ctx.textAlign = textAlign;	
	//ctx.textBaseline = textBaseline;	
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
	
	this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
	// mesh.overdraw = true;
	this.mesh.doubleSided = true;
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
}

E2THREE.GetPowerOfTwo = function(value, pow) {
	var pow = pow || 1;
	while(pow<value) {
		pow *= 2;
	}
	return pow;
}

E2THREE.ReturnMultilineText = function(ctx, textToWrite, maxWidth, text) {
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

