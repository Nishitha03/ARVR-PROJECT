import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/shaders/FXAAShader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);
camera.position.set(0, 1.6, 7);

// Enhanced Lighting and Shadow Setup
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xffffff, 3.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.bias = -0.0001;
directionalLight.shadow.normalBias = 0.02;
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xffcc99, 2.2, 30);
pointLight1.position.set(0, 5, -5);
pointLight1.castShadow = true;
pointLight1.shadow.mapSize.width = 1024;
pointLight1.shadow.mapSize.height = 1024;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x99ccff, 2.2, 30);
pointLight2.position.set(-5, 5, 5);
pointLight2.castShadow = true;
pointLight2.shadow.mapSize.width = 1024;
pointLight2.shadow.mapSize.height = 1024;
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xff9999, 2.0, 30);
pointLight3.position.set(5, 5, -5);
pointLight3.castShadow = true;
pointLight3.shadow.mapSize.width = 1024;
pointLight3.shadow.mapSize.height = 1024;
scene.add(pointLight3);

const spotLight = new THREE.SpotLight(0xffffff, 2.0);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.decay = 2;
spotLight.distance = 40;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);



const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x483D8B, 0.3);
scene.add(hemisphereLight);


// Ground setup

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorTexture = new THREE.TextureLoader().load('./textures/Floor texture.png');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture,
    roughness: 0.7, 
    metalness: 0.3,
    side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Wall setup
const wallTexture = new THREE.TextureLoader().load('./textures//wall_texture.jpg');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(2, 1);
const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallTexture,
    roughness: 0.6, 
    metalness: 0.3, 
    side: THREE.DoubleSide 
});
const wallGeometry = new THREE.PlaneGeometry(20, 3);

// Front wall
const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
frontWall.position.set(0, 1.5, -10);
frontWall.receiveShadow = true;
scene.add(frontWall);

// Back wall
const backWall = frontWall.clone();
backWall.position.set(0, 1.5, 10);
backWall.rotation.y = Math.PI;
backWall.receiveShadow = true;
scene.add(backWall);

// Left wall
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 1.5, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall
const rightWall = leftWall.clone();
rightWall.position.set(10, 1.5, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);

// Roof
const roofGeometry = new THREE.PlaneGeometry(20, 20);
const roofTexture = new THREE.TextureLoader().load('./textures/ceiling texture.png');
roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
roofTexture.repeat.set(4, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ 
    map: roofTexture,
    roughness: 0.6, 
    metalness: 0.3, 
    side: THREE.DoubleSide 
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.rotation.x = Math.PI / 2;
roof.position.set(0, 3, 0);
roof.receiveShadow = true;
scene.add(roof);

// GLTFLoader setup
const loader = new GLTFLoader();
const tables = [];
const artifacts = [];

// Function to load models with shadow casting
function loadTableModel(url, position) {
    loader.load(url, (gltf) => {
        const table = gltf.scene;
        table.position.copy(position);
        table.position.y = 0;
        table.scale.set(1.4, 1.4, 1.4);
        table.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.roughness = 0.7;
                child.material.metalness = 0.3;
            }
        });
        scene.add(table);
        tables.push(table);
    }, undefined, (error) => {
        console.error('Error loading table model:', error);
    });
}

function loadArtifactModel(url, position, rotation, x = 0.5, y = 0.5, z = 0.5) {
    loader.load(url, (gltf) => {
        const artifact = gltf.scene;
        artifact.position.copy(position);
        artifact.rotation.copy(rotation);
        artifact.scale.set(x, y, z);
        artifact.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.roughness = 0.5;
                child.material.metalness = 0.5;
            }
        });
        scene.add(artifact);
        artifacts.push(artifact);
    }, undefined, (error) => {
        console.error('Error loading artifact model:', error);
    });
}

// Table and artifact positions
const tableModelUrl = './models/table_new.glb';
const artifactModelUrls = ['./models/dagger.glb', './models/romulus.glb', './models/pot.glb', './models/roman_coins.glb', './models/helmet.glb', './models/julius_caesar.glb', './models/claudia.glb', './models/bust.glb'];

const tablePositions = [new THREE.Vector3(-6, 0, -3), new THREE.Vector3(-2, 0, -3), new THREE.Vector3(2, 0, -3), new THREE.Vector3(6, 0, -3), new THREE.Vector3(-6, 0, 3), new THREE.Vector3(-2, 0, 3), new THREE.Vector3(2, 0, 3), new THREE.Vector3(6, 0, 3)];
tablePositions.forEach(pos => loadTableModel(tableModelUrl, pos));

const loadArtifacts = () => {
    const artifactPositions = [new THREE.Vector3(-6, 1.45, -3), 
        new THREE.Vector3(-2.10, 1.1, -2.9), 
        new THREE.Vector3(2, 1.1, -2.85), 
        new THREE.Vector3(6, 1.1, -3), 
        new THREE.Vector3(-6, -0.41, 3.05), 
        new THREE.Vector3(-1.97, 1.64, 3.05), 
        new THREE.Vector3(2.1, 1.6, 3), 
        new THREE.Vector3(5.1, 1.7, 3.5)];
    const artifactRotations = [new THREE.Euler(0, Math.PI / 4, 0), new THREE.Euler(0, Math.PI * 2, 0), new THREE.Euler(0, Math.PI / 2, 0), new THREE.Euler(150, -Math.PI / 4, 0), new THREE.Euler(0, Math.PI / 6, 0), new THREE.Euler(0, -Math.PI *2, 0), new THREE.Euler(0, Math.PI *2.2, 0), new THREE.Euler(0, Math.PI * 2.5, 0)];

    artifactPositions.forEach((pos, index) => {
        let x = 0.5, y = 0.5, z = 0.5;
        if (index === 1) { x = 0.3; y = 0.3; z = 0.3; }
        else if (index === 2) { x = 0.1; y = 0.1; z = 0.1; }
        else if (index == 5) { x = 0.08; y = 0.08; z = 0.08; }
        else if (index == 4) { x = 1; y = 1; z = 1 }
        else if (index == 7) { x = 0.18; y = 0.18; z = 0.18; }
        loadArtifactModel(artifactModelUrls[index], pos, artifactRotations[index], x, y, z);
    });
};

loadArtifacts();

// PointerLockControls setup for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Raycaster for collision detection
const raycaster = new THREE.Raycaster();
const collisionDistance = 0.5; // Distance to detect collision

// Movement parameters
const movementSpeed = 0.1;
const keys = { w: false, a: false, s: false, d: false };

// Event listeners for keyboard input
window.addEventListener('keydown', (event) => {
    if (keys[event.key] !== undefined) keys[event.key] = true;
    if (event.key === 'Escape') controls.unlock();
});

window.addEventListener('keyup', (event) => {
    if (keys[event.key] !== undefined) keys[event.key] = false;
});

// Click to lock pointer
document.body.addEventListener('click', () => {
    controls.lock();
});

// Collision detection function
function checkCollision(direction) {
    raycaster.set(camera.position, direction);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
        return true;
    }
    return false;
}

// Movement logic
const moveCamera = () => {
    if (!controls.isLocked) return;
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(direction);
    right.crossVectors(camera.up, direction).normalize();

    // Move forward/backward
    if (keys.w && !checkCollision(direction)) controls.moveForward(movementSpeed);
    if (keys.s && !checkCollision(direction.negate())) controls.moveForward(-movementSpeed);

    // Move left/right
    if (keys.a && !checkCollision(right.negate())) controls.moveRight(-movementSpeed);
    if (keys.d && !checkCollision(right)) controls.moveRight(movementSpeed);
};

// Resize listener
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    composer.setSize(width, height);
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
});

// Post-processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// UnrealBloomPass setup
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.7, // Strength of the bloom effect
    0.4, // Radius of the bloom effect
    0.85 // Threshold of the bloom effect
);
composer.addPass(bloomPass);

// FXAA Pass setup for anti-aliasing
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveCamera();
    composer.render();
}

animate();