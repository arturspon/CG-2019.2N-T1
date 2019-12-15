var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

var renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0, 0, 0)
scene.add(light)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
})

var professorImages = [
    'img/bins.png',
    'img/braulio.png',
    'img/denio.png',
    'img/emilio.png',
    'img/fernando.png',
    'img/guilherme.png',
    'img/marco.png',
]
var professors = []
var professorVelocity = 0.015
var edges = {}
var rotateDirection = {
    'left': 1,
    'top': 0,
    'right': 1,
    'bottom': 0
}
var professorsOnScreen = 0
var maxProfessorsOnScreen = 10

function initScreenSaver() {
    generateProfessors()
    addBouncingEdges()
    render()
}

function generateProfessors() {
    setInterval(function(){
        if (professorsOnScreen < maxProfessorsOnScreen) {
            loadProfessor()
        }
    }, 3000);
}

function loadProfessor() {
    var professorImg = professorImages[Math.floor(Math.random() * professorImages.length)]

    var texture = new THREE.TextureLoader().load(professorImg)
    var material = new THREE.MeshBasicMaterial()
    material.map = texture

    var professor = {}
    var geometry = new THREE.CircleGeometry(0.25, 32)
    professor.shape = new THREE.Mesh(geometry, material)
    professor.shape.rotateZ(Math.random() * (0, 2) * Math.PI);
    scene.add(professor.shape)
    professors.push(professor)

    professorsOnScreen++
}

function addBouncingEdges() {
    var geometry = new THREE.BoxGeometry(1.5, 5, 1)
    var material = new THREE.MeshBasicMaterial({ depthWrite: false, depthTest: false })

    var rightCube = new THREE.Mesh(geometry, material)
    rightCube.position.set(4.5, 0, 0.5)

    var leftCube = new THREE.Mesh(geometry, material)
    leftCube.position.set(-4.5, 0, 0.5)

    geometry = new THREE.BoxGeometry(9, 1.5, 1)

    var topCube = new THREE.Mesh(geometry, material)
    topCube.position.set(0, 2.5, 0.5)

    var bottomCube = new THREE.Mesh(geometry, material)
    bottomCube.position.set(0, -2.5, 0.5)

    edges['left'] = leftCube
    edges['top'] = topCube
    edges['right'] = rightCube
    edges['bottom'] = bottomCube
}

function isColliding (firstObject, secondObject) {
    var firstHitbox = new THREE.Box3().setFromObject(firstObject)
    var secondHitbox = new THREE.Box3().setFromObject(secondObject)
    return secondHitbox.containsBox(firstHitbox)
}

function rotateObject(obj, amount) {
    var rotation = ((obj.rotation.z / Math.PI) + amount) * -1 * Math.PI
    obj.rotation.z = rotation
}

function checkEdgeCollisions(obj) {
    for (key in edges) {
        if (edges.hasOwnProperty(key)) {
            if (isColliding(obj, edges[key])) {
                rotateObject(obj, rotateDirection[key])
            }
        }
    }
}

function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)

    for (professor of professors) {
        professor.shape.translateX(professorVelocity)
        checkEdgeCollisions(professor.shape)
    }
}

initScreenSaver()