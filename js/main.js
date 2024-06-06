import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = -10;
camera.position.x = 5;

const morphGroup = new THREE.Group();
scene.add(morphGroup);

let morph;
const loader = new GLTFLoader();
loader.load(
  `models/morph/scene.gltf`,
  function (gltf) {
    morph = gltf.scene;
    morph.scale.set(3, 3, 3);
    morph.position.set(-9, 4, -2); // x,y,z
    morphGroup.add(morph);
    console.log("morph model loaded successfully", morph);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Ubah warna cahaya ke 0xffffff
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (morph) {
    const intersects = raycaster.intersectObjects([morph]);
    if (intersects.length > 0) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  }
}

function createConstellations() {
  const constellationMaterial = new THREE.LineBasicMaterial({
    // Konfigurasi material
  });

  }
createConstellations();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (morph) {
    morph.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
