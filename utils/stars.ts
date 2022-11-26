// @ts-ignore
import * as THREE from "three"

//////////////settings/////////
let actionZ = 0 //on left click action
const rotationA = 3.1 // amount of rotation
const movementSpeed = 10
const zoomSpeed = 10
const totalObjects = 40000
/////////////////////////////////
let rotated = false
const container = document.createElement("div")
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 2000

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x555555, 0.0003)
const geometry = new THREE.Geometry()

for (let i = 0; i < totalObjects; i++) {
  const vertex = new THREE.Vector3()
  vertex.x = Math.random() * 40000 - 20000
  vertex.y = Math.random() * 7000 - 3500
  vertex.z = Math.random() * 7000 - 3500
  geometry.vertices.push(vertex)
}

const material = new THREE.ParticleBasicMaterial({ size: 6 })
const particles = new THREE.ParticleSystem(geometry, material)

scene.add(particles)

camera.position.x = -10000

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

renderer.render(scene, camera)

render()

function render() {
  requestAnimationFrame(render)
  if (!rotated && camera.position.x < 11000) {
    if (camera.position.x > 10000) {
      rotated = true
      if (camera.rotation.y < rotationA) {
        camera.rotation.y += 0.015
        rotated = false
      }
      if (camera.position.z > -2000) {
        camera.position.z -= 19
        rotated = false
      }
    } else {
      camera.position.x += movementSpeed
      camera.position.z += actionZ
    }
  } else if (rotated && camera.position.x > -11000) {
    if (camera.position.x < -10000) {
      rotated = false
      if (camera.rotation.y > 0) {
        camera.rotation.y -= 0.015
        rotated = true
      }
      if (camera.position.z < 2000) {
        camera.position.z += 19
        rotated = true
      }
    } else {
      camera.position.x -= movementSpeed
      camera.position.z -= actionZ
    }
  }

  renderer.render(scene, camera)
}

window.addEventListener("mousedown", onDocumentMouseDown, false)
window.addEventListener("mouseup", onDocumentMouseUp, false)
window.addEventListener("resize", onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
function onDocumentMouseDown(event: { preventDefault: () => void }) {
  event.preventDefault()
  actionZ = -zoomSpeed
}

function onDocumentMouseUp() {
  actionZ = 0
}
