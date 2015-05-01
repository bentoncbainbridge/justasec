var camera, cubeCamera, scene, renderer;
var cube, sphere, torus, lady;
var time = 0;
var fov = 70,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

var texture = THREE.ImageUtils.loadTexture(
    'textures/JustASecLenticularQuickClean.jpg',
    THREE.UVMapping,
    function () {
        init();
        animate();
    }
);

function init() {
    camera = new THREE.PerspectiveCamera(
        fov, window.innerWidth / window.innerHeight, 1, 1000);
    scene = new THREE.Scene();

    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(500, 60, 40),
        new THREE.MeshBasicMaterial({ map: texture }));
    mesh.scale.x = -1;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    cubeCamera = new THREE.CubeCamera( 1, 1000, 256 );
    cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add( cubeCamera );

    document.body.appendChild( renderer.domElement );

    var material = new THREE.MeshBasicMaterial(
        {envMap: cubeCamera.renderTarget});

    // instantiate a loader
    var loader = new THREE.JSONLoader( );

    // load a resource
    loader.load(
        'NakedLady.js',

        // Function when resource is loaded
        function ( geometry, material ) {
            lady = new THREE.Mesh(geometry( 99, 99, 99 ), material);
            scene.add(lady);

            sphere = new THREE.Mesh(
                new THREE.SphereGeometry( 20, 30, 15 ), material);
            scene.add( sphere );

            cube = new THREE.Mesh(
                new THREE.BoxGeometry( 20, 20, 20 ), material );
            scene.add( cube );

            torus = new THREE.Mesh(
                new THREE.TorusKnotGeometry(Math.sin(time) * 1,
                                            Math.cos(time) * 1,
                                            Math.sin(time) * 1), material);
            scene.add(torus);
        });

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
    window.addEventListener( 'resize', onWindowResized, false );

    onWindowResized( null );
}

function onWindowResized( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
}

function onDocumentMouseDown( event ) {
    event.preventDefault();

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

}

function onDocumentMouseMove( event ) {

    lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

}

function onDocumentMouseUp( event ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );

}

function onDocumentMouseWheel( event ) {

    // WebKit

    if ( event.wheelDeltaY ) {

        fov -= event.wheelDeltaY * 0.05;

        // Opera / Explorer 9

    } else if ( event.wheelDelta ) {

        fov -= event.wheelDelta * 0.05;

        // Firefox

    } else if ( event.detail ) {

        fov += event.detail * 1.0;

    }

    camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );

}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    var time = Date.now();

    lon += .15;

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    sphere.position.x = Math.sin( time * 0.001 ) * 30;
    sphere.position.y = Math.sin( time * 0.0011 ) * 30;
    sphere.position.z = Math.sin( time * 0.0012 ) * 30;

    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.03;

    cube.position.x = Math.sin( time * 0.001 + 2 ) * 30;
    cube.position.y = Math.sin( time * 0.0011 + 2 ) * 30;
    cube.position.z = Math.sin( time * 0.0012 + 2 ) * 30;

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    torus.position.x = Math.sin( time * 0.001 + 4 ) * 30;
    torus.position.y = Math.sin( time * 0.0011 + 4 ) * 30;
    torus.position.z = Math.sin( time * 0.0012 + 4 ) * 30;

    torus.rotation.x += 0.02;
    torus.rotation.y += 0.03;

    lady.position.x = Math.sin( time * 0.001 + 4 ) * 30;
    lady.position.y = Math.sin( time * 0.0011 + 4 ) * 30;
    lady.position.z = Math.sin( time * 0.0012 + 4 ) * 30;

    lady.rotation.x += 0.02;
    lady.rotation.y += 0.03;

    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = 100 * Math.cos( phi );
    camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( scene.position );

    sphere.visible = false; // *cough*

    cubeCamera.updateCubeMap( renderer, scene );

    sphere.visible = true; // *cough*

    renderer.render( scene, camera );
}
