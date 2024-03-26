import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//import files
import './style.css'
import earthTexture from './assets/img/earth.jpg'
import jupiterTexture from './assets/img/jupiter.jpg'
import marsTexture from './assets/img/mars.jpg'
import mercuryTexture from './assets/img/mercury.jpg'
import neptuneTexture from './assets/img/neptune.jpg'
import plutoTexture from './assets/img/pluto.jpg'
import saturnTexture from './assets/img/saturn.jpg'
import saturnRingTexture from './assets/img/saturn ring.png'
import starsTexture from './assets/img/stars.jpg'
import sunTexture from './assets/img/sun.jpg'
import uranusTexture from './assets/img/uranus.jpg'
import uranusRingTexture from './assets/img/uranus ring.png'
import venusTexture from './assets/img/venus.jpg'

//my scene
const scene = new THREE.Scene();

//scene size
const sizes = {
  width: window.innerWidth,
  height: window. innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000);
scene.add(camera);

//set the canvas
const canvas = document.getElementById('canvas');

//render the canvas
const renderer = new THREE.WebGL1Renderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//orbital controls
const orbit  = new OrbitControls(camera, canvas)

camera.position.set(-90, 140, 140);
orbit.update();

//lights
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight);

//applies the stary backgroud to the scene
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
])

 
//texture loader that will load textures to objects
const textureLoader = new THREE.TextureLoader();

//Load the sphere and add a  suntexture
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

//add a source of light at the center of the sun
const pointLight =  new THREE.PointLight(0xFFFFFF, 13000, 50000)
scene.add(pointLight)


function createPlanet(size, texture, position, ring){
  const geometry = new THREE.SphereGeometry(size, 30, 30);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  })
  const mesh = new THREE.Mesh(geometry, material)

  const obj = new THREE.Object3D();
  obj.add(mesh)

  if(ring){
    //add a ring
    const ringGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32)
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide

    })

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    obj.add(ringMesh)
    ringMesh.position.x = position
    ringMesh.rotation.x = -0.5 * Math.PI;

  }
  scene.add(obj)
  mesh.position.x = position
  return {mesh, obj}
}

const mercury = createPlanet(3.2, mercuryTexture, 28)
const venus = createPlanet(5.8, venusTexture, 44)
const earth = createPlanet(3.2, earthTexture, 62)
const mars = createPlanet(3.2, marsTexture, 78)
const jupiter = createPlanet(3.2, jupiterTexture, 100)
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
})
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
})
const neptune = createPlanet(7, neptuneTexture, 200)
const pluto = createPlanet(2.8, plutoTexture, 210)
 
// set up animation to refresh the canvas
const refresh = ()=>{
  // self rotation
  sun.rotateY(0.004)
  mercury.mesh.rotateY(0.004)
  venus.mesh.rotateY(0.002)
  earth.mesh.rotateY(0.02)
  mars.mesh.rotateY(0.018)
  jupiter.mesh.rotateY(0.04)
  saturn.mesh.rotateY(0.038)
  uranus.mesh.rotateY(0.03)
  neptune.mesh.rotateY(0.032)
  pluto.mesh.rotateY(0.008 )

  // around the sun
  mercury.obj.rotateY(0.04)
  venus.obj.rotateY(0.015)
  earth.obj.rotateY(0.01)
  mars.obj.rotateY(0.008)
  jupiter.obj.rotateY(0.002)
  saturn.obj.rotateY(0.0009)
  uranus.obj.rotateY(0.0004)
  neptune.obj.rotateY(0.0001)
  pluto.obj.rotateY(0.00007)

  renderer.render(scene,camera);
  requestAnimationFrame(refresh);
}

window.addEventListener('resize', () => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

refresh();