if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var mesh;
var particle_system;

var point001_percent_url = "data/FOF_point001_percent.json"
var point01_percent_url = "data/FOF_point01_percent.json"
var point1_percent_url = "data/FOF_point1_percent.json"
var one_percent_url = "data/FOF_1_percent.json"

var all_keys = ['26.0', '28.0', '30.0', '32.0', '34.0', '36.0', '38.0', '40.0', '42.0', '44.0', '46.0', '48.0', '50.0', '52.0', '54.0', '56.0', '58.0', '60.0', '62.0', '64.0',
            '66.0', '67.0', '68.0', '69.0', '70.0', '71.0', '72.0', '73.0', '74.0', '75.0', '76.0', '77.0', '78.0', '79.0', '80.0', '81.0', '82.0', '83.0', '84.0', '85.0'];

var era = 25;

var point001_percent_data;
var point01_percent_data;
var point1_percent_data;
var one_percent_data;

var loaded = 0;

$.getJSON(point001_percent_url, function(data){
    point001_percent_data = data;
    loaded = point001_percent_data;
    init();
    animate();
});

function t_back(){
    era -= 1;
    draw_particles();
}

function t_forward(){
    era += 1;
    draw_particles();
}

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

    var slider = document.getElementById("t-slider");
    era = slider.value;

    $(document).keydown(function(e){ 
        if(e.keyCode == 37){
            t_back();
        }else if(e.keyCode == 39){
            t_forward();
        }
        slider.value = era;
    });

    $("#t-slider").change(function(){
        console.log(this.value);
    });

    // lighting

    var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, -1, 0 );
    scene.add( light2 );

    // particle system

    draw_particles()

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

function draw_particles(){
    // particle system

    if($.inArray(particle_system, scene.children)){
        scene.remove(scene.children[scene.children.length-1])
    }

    var key = all_keys[era];
    var coordinates = loaded[key];
    if(!coordinates){
        era++;
        key = all_keys[era];
        coordinates = loaded[key]
    }
    if(!coordinates){
        era -= 2;
        key = all_keys[era];
        coordinates = loaded[key]
    }

    var particle_count = coordinates.length;
    var particles = new THREE.Geometry();
    var pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 20,
        map: THREE.ImageUtils.loadTexture(
            "img/particle.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    for(var p = 0; p < particle_count; p++){
        var pX = coordinates[p][0] - 500;
        var pY = coordinates[p][1] - 500;
        var pZ = coordinates[p][2] - 500;

        var particle = new THREE.Vector3(pX, pY, pZ);

        particles.vertices.push(particle);
        scene.add(particle_system);
    }

    particle_system = new THREE.ParticleSystem(particles, pMaterial);
    particle_system.sortParticles = true;
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

$.getJSON(point01_percent_url, function(data){
    point01_percent_data = data;
    loaded = point01_percent_data;
    console.log("drawing .01%...");
    draw_particles();
});

// give .1% to web worker
w1 = new Worker("js/workers/point_one_percent_worker.js");
w1.onmessage = function(event){
    if(event.data.info == 1)
        console.log(event.data.message);
    else if(event.data.info == 0){
        point1_percent_data = event.data.message;
        loaded = point1_percent_data;
        console.log("drawing .1%...");
        draw_particles();
    }
};

/*
// give massive 1% to web worker
w2 = new Worker("js/workers/one_percent_worker.js");
w2.onmessage = function(event){
    if(event.data.info == 1)
        console.log(event.data.message);
    else if(event.data.info == 0){
        one_percent_data = event.data.message;
        loaded = one_percent_data;
        console.log("drawing 1%...");
        draw_particles();
    }
};
*/
