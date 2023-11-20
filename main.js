import {
    AmbientLight,
    CameraHelper,
    CubeTextureLoader,
    DirectionalLight,
    Mesh,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShadowMaterial,
    Vector3,
    WebGLRenderer,
    PCFSoftShadowMap
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

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

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);

// Three.js stuff.
// - canvas container
const canvasContainer = document.querySelector("#canvasContainer");
// - renderer
const renderer = new WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(1);
// - enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
canvasContainer.appendChild(renderer.domElement);
// - scene
const scene = new Scene();
scene.environment = texEnvironment;
// - camera
const camera = new PerspectiveCamera(50);
camera.position.set(0, 0.5, 2);
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

const floor = new Mesh(
    new PlaneGeometry(100, 100),
    new ShadowMaterial({ transparent: true, opacity: 0.1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Lights.
const ambientLight = new AmbientLight("#FFFFFF", 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight("#FFFFFF", 1.5);
directionalLight.position.set(-0.75, 1, 1.25);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.near = -1;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.top = 2;
// scene.add(new CameraHelper(directionalLight.shadow.camera))

// Add GUI.
const gui = new GUI();
const guiVars = {
    rotation: 0,
    width: 1,
    height: 1,
    color: "#FFFFFF",
};
gui.add(guiVars, "rotation", 0, Math.PI / 2).onChange((value) => {
    windowFrame.setRotation(value);
});
gui.add(guiVars, "width", 0.5, 3).onChange((value) => {
    windowFrame.setSize(guiVars.width, guiVars.height);
});
gui.add(guiVars, "height", 0.5, 3).onChange((value) => {
    windowFrame.setSize(guiVars.width, guiVars.height);
    floor.position.y = -guiVars.height;
});
gui.addColor(guiVars, "color").onChange((value) => {
    windowFrame.setMaterialColor(value);
});

// Add Stats.
const stats = new Stats();
canvasContainer.appendChild(stats.dom);

// Render loop.
window.requestAnimationFrame(loop);
function loop() {
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    window.requestAnimationFrame(loop);
}

export { scene, gltfLoader };
