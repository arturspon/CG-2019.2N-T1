var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0, 0, 0)
scene.add(light);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

var imgs = [
    'img/bins.png'
]

function initScreenSaver() {
    loadProfessor()
    render()
}

function loadProfessor() {
    var texture = new THREE.TextureLoader().load(imgs[0]);
    var material = new THREE.MeshBasicMaterial();
    material.map = texture;

    var professor = {}
    var geometry = new THREE.CircleGeometry(0.25, 32);
    professor.shape = new THREE.Mesh(geometry, material);
    scene.add(professor.shape);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

initScreenSaver()