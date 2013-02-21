if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var mesh;

var point001_percent_url = "https://s3.amazonaws.com/dark-sim/FOF_point001_percent.csv"
var point01_percent_url = "https://s3.amazonaws.com/dark-sim/FOF_point01_percent.csv"
var point1_percent_url = "https://s3.amazonaws.com/dark-sim/FOF_point1_percent.csv"
var one_percent_url = "https://s3.amazonaws.com/dark-sim/FOF_1_percent.csv"

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    // camera & controls

    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    scene.add( new THREE.AmbientLight( 0x444444 ) );

    controls = new THREE.OrbitControls(camera)
    controls.center.set(0, 0, 0)
    controls.autoRotateSpeed = 1.0
    controls.autoRotate = true
    camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 2750))

    // lighting

    var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, -1, 0 );
    scene.add( light2 );

    // particle system

    var particle_count = 1800
    var particles = new THREE.Geometry();
    var pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 20
    });

    for(var p = 0; p < particle_count; p++){
        var pX = Math.random() * 500 - 250;
        var pY = Math.random() * 500 - 250;
        var pZ = Math.random() * 500 - 250;

        var particle = new THREE.Vertex(
            new THREE.Vector3(pX, pY, pZ)
        );

        particles.vertices.push(particle);
    }

    var particle_system = new THREE.ParticleSystem(particles, pMaterial);

    scene.add(particle_system);

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0x333333, clearAlpha: 1, alpha: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color, 1 );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;

    container.appendChild( renderer.domElement );

    // stats

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    var time = Date.now() * 0.001;
    controls.update();
    //mesh.rotation.x = time * 0.25;
    //mesh.rotation.y = time * 0.5;
    renderer.render( scene, camera );
}