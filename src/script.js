import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

let composer;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLightKey = new THREE.DirectionalLight(0xffffff, 1.2);
const directionalLightFill = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightKey.position.set(1, 2, 5);
directionalLightFill.position.set(-1, -2, -4);

const emissionLight = new THREE.PointLight(0x00ff00, 4);
emissionLight.position.set(0, 0, 13);
scene.add(
  ambientLight,
  directionalLightKey,
  directionalLightFill,
  emissionLight
);

/**
 * Objects
 */

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0x441166 })
);
scene.add(cube);

/*\/\/**THREE.Line2*************************************************** */
const line1curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, 0, 15),
  new THREE.Vector3(-5, 5, 10),
  new THREE.Vector3(0, 0, 5),
  new THREE.Vector3(5, -5, 10),
  new THREE.Vector3(10, 0, 15),
]);

const line1Points = line1curve.getPoints(200);
const colors = [];
const line1Geometry = new THREE.BufferGeometry().setFromPoints(line1Points);
for (let i = 0; i < line1Geometry.attributes.position.array.length / 3; i++) {
  colors.push(0.1, 1, 0.1);
}

const line1material = new THREE.LineBasicMaterial({ color: 0xff0000 });

const curveObject = new THREE.Line(line1Geometry, line1material);
scene.add(curveObject);

const geometry = new LineGeometry();
geometry.fromLine(curveObject);
geometry.setColors(colors);

const line2Material = new LineMaterial({
  color: 0x00ffff,
  linewidth: 0.5,
  vertexColors: true,
  worldUnits: true,
  dashed: false,
});

const line = new Line2(geometry, line2Material);
scene.add(line);
/*/\/\**************************************************************** */
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

camera.position.set(0, 0, 20);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
const controls = new OrbitControls(camera, renderer.domElement);

/*\/\/**** GLOW EFFECT ******************************** */
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
const bloomThreshold = 0.57;
const bloomStrength = 1.3;
const bloomRadius = 0.2;
bloomPass.threshold = bloomThreshold;
bloomPass.strength = bloomStrength;
bloomPass.radius = bloomRadius;

composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
/*/\/\********* ************************************** */
const tick = () => {
  controls.update();

  // renderer.render(scene, camera);
  composer.render();
  window.requestAnimationFrame(tick);
};

tick();
