
function main() {
  
  // get the canvas and create a WebGL renderer for it
  var canvas = document.getElementById( "canvas" );
  var renderer = new THREE.WebGLRenderer( {canvas: canvas} );
  renderer.setSize( canvas.width, canvas.height );
    renderer.shadowMapEnabled = true;
  
  // create a scene to contain graphical objects 
  var scene = new THREE.Scene();
  
  // create an axis helper
  var axis = new THREE.AxisHelper(); 
  scene.add( axis ); 
  
  // create a perspective camera
  var fov = 60,
      aspect = canvas.width / canvas.height,
      near = 0.1,
      far = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 5, 5, 5 );
  
  // use orbit controls
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
    
    // plane
    
    var geometry = new THREE.PlaneGeometry(20, 20);
    var material = new THREE.MeshBasicMaterial( {color: 'grey'});
    var plane = new THREE.Mesh( geometry, material );
    plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x=-0.5*Math.PI;
        plane.position.x=0
        plane.position.y=0
        plane.position.z=0

        // add the plane to the scene
        scene.add(plane);
    
    //torus
    var radius = 0.5,
      tube = 0.3,
      segments = 24;
    var geometry = new THREE.TorusGeometry( radius, tube, segments, segments );
    var material = new THREE.MeshPhongMaterial ({color: 'red' });
    var torus = new THREE.Mesh( geometry, material );
    torus.position.set(0, 2, 3);
    torus.castShadow = true;
  scene.add(torus);
    
    
    // octahedron
    var geometry2 = new THREE.OctahedronGeometry( 1,0 );
    var material2 = new THREE.MeshLambertMaterial ({color: 'blue' });
    var torus2 = new THREE.Mesh( geometry2, material2 );
	torus2.position.set(2, 2, 2);
    torus2.castShadow = true;
	scene.add( torus2 );
    
    
    // cube
    
    var geometry3 = new THREE.CubeGeometry( 1, 1, 1, 1, 1, 1 );
    var material3 = new THREE.MeshBasicMaterial({color: 'green' });
    var torus3 = new THREE.Mesh( geometry3, material3 );
	torus3.position.set(3, 2, 0);
    torus3.castShadow = true;
	scene.add( torus3 );
    
    // add subtle ambient lighting
      var ambientLight = new THREE.AmbientLight(0x000044);
      scene.add(ambientLight);
      
      // directional lighting
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1);

      scene.add(directionalLight);
    
    //spotlight
     var spotLight = new THREE.SpotLight( 0xffffff,1 );
     spotLight.position.set( 5,10,6 );

     spotLight.castShadow = true;

    // spotLight.target.position.set(50, 10, 50);
     spotLight.shadowDarkness = 0.5;

     spotLight.shadowCameraNear = 6; 
     spotLight.shadowCameraFar = 13;

    scene.add( spotLight );
    
  // create the animation
  var animate = function () {
      torus.rotation.x += 0.03;
    torus.rotation.y += 0.01;
      torus2.rotation.x += 0.03;
    torus2.rotation.y += 0.01;
      torus3.rotation.x += 0.03;
    torus3.rotation.y += 0.01;
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  };

  animate();
}
