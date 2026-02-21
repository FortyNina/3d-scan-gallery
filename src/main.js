import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


const modelData = [
  {
    name: 'Lily',
    path: '/models/lily.glb',
    position: [0, -.75, .2],
  scale: [15, 15, 15],

  },
  {
    name: 'Chapel',
    path: '/models/chapel.glb',
    position: [0, -.75, 0],
scale: [8, 8, 8],

  },
]


// Scene, camera, renderer setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0f) // light gray
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.set(2  , 2, 0)
camera.lookAt(0, -1, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.enablePan = false
controls.enableZoom = true
controls.update()


scene.add(new THREE.AmbientLight(0xffffff, 3.5))


const models = [];


// Load GLB model
const loader = new GLTFLoader()



// Rendering loop (like Update()). Draws the scene every time the screen is refreshed (60 times per second)
function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



const nav = document.querySelector('.model-nav');

function loadModel(data) {
  models.forEach(m => scene.remove(m));
  models.length = 0;

  loader.load(
    data.path,
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.position.set(...data.position);
model.scale.set(...data.scale);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      models.push(model);

      // do whatever you want with the rest of data here
      console.log(data.description, data.date);
    },
    undefined,
    (error) => console.error(error)
  );
}


// Load first model by default
loadModel(modelData[0]);

modelData.forEach((data, i) => {
  const btn = document.createElement('button');
  btn.classList.add('model-btn');
  if (i === 0) btn.classList.add('active');
  btn.textContent = data.name;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadModel(data);
  });
  nav.appendChild(btn);
});

loadModel(modelData[0]);

