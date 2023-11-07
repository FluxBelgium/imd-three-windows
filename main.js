import {
    BoxGeometry,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { WindowFrame } from "./classes/WindowFrame";

// Add GUI.
const gui = new GUI();

// Three.js stuff.
// - canvas container
const canvasContainer = document.querySelector("#canvasContainer");
// - renderer
const renderer = new WebGLRenderer({ alpha: true, antialias: true });
canvasContainer.appendChild(renderer.domElement);
// - scene
const scene = new Scene();
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

// Render loop.
window.requestAnimationFrame(loop);
function loop() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

export { scene }
