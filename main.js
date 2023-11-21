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
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

import { WindowFrame } from "./classes/WindowFrame";
import { WindowWall } from "./classes/WindowWall";

// Loading textues.


// Loaders.
const textureLoader = new TextureLoader();

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);

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
renderer.setPixelRatio(1);
// - enable shadows
renderer.shadowMap.enabled = true;
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

const windowWall = new WindowWall(2, 2)

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
directionalLight.shadow.camera.left = -3.5;
directionalLight.shadow.camera.right = 3.5;
directionalLight.shadow.camera.bottom = -3.5;
directionalLight.shadow.camera.top = 3.5;
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
    windowWall.setSize(guiVars.width * 2, guiVars.height * 2, guiVars.width, guiVars.height);
});
gui.add(guiVars, "height", 0.5, 3).onChange((value) => {
    windowFrame.setSize(guiVars.width, guiVars.height);
    windowWall.setSize(guiVars.width * 2, guiVars.height * 2, guiVars.width, guiVars.height);
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

export { scene, gltfLoader, textureLoader };
