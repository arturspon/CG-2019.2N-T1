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

var imgs = [
    'img/bins.png'
]
var professors = []
var professorVelocity = 0.02
var edges = []

function initScreenSaver() {
    loadProfessor()
    addBouncingEdges()
    render()
}

function loadProfessor() {
    var texture = new THREE.TextureLoader().load(imgs[0])
    var material = new THREE.MeshBasicMaterial()
    material.map = texture

    var professor = {}
    var geometry = new THREE.CircleGeometry(0.25, 32)
    professor.shape = new THREE.Mesh(geometry, material)
    scene.add(professor.shape)
    professors.push(professor)
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

    edges.push(
        rightCube,
        leftCube,
        topCube,
        bottomCube
    )
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
    for (edge of edges) {
        if (isColliding(obj, edge)) {
            rotateObject(obj, Math.floor(Math.random() * 2))

            console.log('colidindo')
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