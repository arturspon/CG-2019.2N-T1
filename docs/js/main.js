var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 1000

var renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var light = new THREE.PointLight(0xFFFFFF, 1, 10000)
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
var edges = {}
var rotateDirection = {
    'left': 1,
    'top': 0,
    'right': 1,
    'bottom': 0
}
var professorsOnScreen = 0
var maxProfessorsOnScreen = 10
var canExplode = true

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
    }, 1000)
    setInterval(function(){
        professorsOnScreen = 0
    }, 20000)
}

function loadProfessor() {
    var professorImg = professorImages[Math.floor(Math.random() * professorImages.length)]

    var texture = new THREE.TextureLoader().load(professorImg)
    var material = new THREE.MeshBasicMaterial()
    material.map = texture

    var professor = {}
    var geometry = new THREE.CircleGeometry(Math.floor(Math.random() * 52) + 44)

    professor.shape = new THREE.Mesh(geometry, material)
    professor.shape.rotateZ(Math.random() * (0, 2) * Math.PI)
    professor.velocity = Math.floor(Math.random() * 4) + 1

    scene.add(professor.shape)

    professors.push(professor)

    professorsOnScreen++
}

function addBouncingEdges() {
    var vFOV = THREE.Math.degToRad(camera.fov);     // convert vertical fov to radians
    var height = 2 * Math.tan( vFOV / 2 ) * 999;    // visible height
    var width = height * camera.aspect;             // visible width

    var geometry = new THREE.BoxGeometry(width, height, 1)
    var material = new THREE.MeshBasicMaterial({ depthWrite: false, depthTest: false })

    var rightCube = new THREE.Mesh(geometry, material)
    rightCube.position.set(4.5, 0, 0.5)

    var leftCube = new THREE.Mesh(geometry, material)
    leftCube.position.set(-4.5, 0, 0.5)

    geometry = new THREE.BoxGeometry(width, height, 1)

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

function checkProfessorCollisions(obj) {
    for (professor of professors) {
        if (professor && obj !== professor.shape && detectCollisionCubes(obj, professor.shape)) {
            removeProfessor(professor)
            explode(obj.position.x, obj.position.y)
            obj.scale.x += 1
            obj.scale.y += 1
        }        
    }
}

function detectCollisionCubes(object1, object2){
    object1.geometry.computeBoundingBox()
    object2.geometry.computeBoundingBox()
    object1.updateMatrixWorld()
    object2.updateMatrixWorld()

    var box1 = object1.geometry.boundingBox.clone()
    box1.applyMatrix4(object1.matrixWorld)

    var box2 = object2.geometry.boundingBox.clone()
    box2.applyMatrix4(object2.matrixWorld)

    return box1.intersectsBox(box2)
}

function explode(x, y) {
    if (canExplode) {
        canExplode = false
        parts.push(new ExplodeAnimation(x, y))
        setTimeout(function(){ canExplode = true }, 1000)
    }
}

function removeProfessor(professor) {
    scene.remove(professor.shape)
    var professorIndex = professors.indexOf(professor)
    delete professors[professorIndex]
    professorsOnScreen--
}

function render() {
    requestAnimationFrame(render)

    var pCount = parts.length
    while(pCount--) {
        parts[pCount].update()
    }

    renderer.render(scene, camera)

    for (professor of professors) {
        if(professor){
            professor.shape.translateX(professor.velocity)
            checkEdgeCollisions(professor.shape)
            checkProfessorCollisions(professor.shape)
        }
    }
}

initScreenSaver()