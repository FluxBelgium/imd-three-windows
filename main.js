import {
    AmbientLight,
    CubeTextureLoader,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { WindowFrame } from "./classes/WindowFrame";

// Loading textues.
const cubeTextureLoader = new CubeTextureLoader();
cubeTextureLoader.setPath("./textures/environment/");
const texEnvironment = cubeTextureLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
]);

// Three.js stuff.
// - canvas container
const canvasContainer = document.querySelector("#canvasContainer");
// - renderer
const renderer = new WebGLRenderer({ alpha: true, antialias: true });
canvasContainer.appendChild(renderer.domElement);
// - scene
const scene = new Scene();
scene.environment = texEnvironment;
// - camera
const camera = new PerspectiveCamera(50);
camera.position.set(2, 2, 2);
camera.lookAt(new Vector3(0, 0, 0));
// - controls
const controls = new OrbitControls(camera, renderer.domElement);

// Resize function.
resize();
window.addEventListener("resize", resize);
function resize() {
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
}

// Objects.
const windowFrame = new WindowFrame(1, 1);

// Lights.
const ambientLight = new AmbientLight("#FFFFFF", 0.5);
scene.add(ambientLight);
const directionalLight = new DirectionalLight("#FFFFFF", 1.5);
directionalLight.position.set(-0.75, 1, 1.25);
scene.add(directionalLight);

// Add GUI.
const gui = new GUI();
const guiVars = {
    rotation: 0,
    width: 1,
    height: 1,
};
gui.add(guiVars, "rotation", 0, Math.PI / 2).onChange((value) => {
    windowFrame.setRotation(value);
});
gui.add(guiVars, "width", 0.5, 3).onChange((value) => {
  windowFrame.setSize(guiVars.width, guiVars.height);
});
gui.add(guiVars, "height", 0.5, 3).onChange((value) => {
  windowFrame.setSize(guiVars.width, guiVars.height);
});

// Render loop.
window.requestAnimationFrame(loop);
function loop() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

export { scene };
