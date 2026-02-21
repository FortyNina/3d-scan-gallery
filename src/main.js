import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


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
loader.load(
    '/models/2_20_2026.glb',
    (gltf) => {
        const model = gltf.scene
        scene.add(model)
        model.position.set(0, -.75, .2);
        model.scale.set(15,15,15);
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        models.push(model)
    },
    undefined,
    (error) => {
        console.error(error)
    }
)



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


function loadModel(path) {
  // Remove existing models
  models.forEach(m => scene.remove(m));
  models.length = 0;

  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.position.set(0, -.75, 0);
      model.scale.set(15, 15, 15);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      models.push(model);
    },
    undefined,
    (error) => console.error(error)
  );
}

document.querySelectorAll('.model-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadModel(btn.dataset.model);
  });
});
