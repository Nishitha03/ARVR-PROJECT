import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/shaders/FXAAShader.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/geometries/TextGeometry.js';
// Font loader setup
const fontLoader = new FontLoader();
let font;

// Load the font
fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json', function(loadedFont) {
    font = loadedFont;
});

// Define artifact information mapping
const artifactInfo = {
    'dagger': 'Pugio',
    'romulus': 'Romulus',
    'pot': 'Ancient_Roman_pottery',
    'roman_coins': 'Roman_currency',
    'helmet': 'Galea_(helmet)',
    'julius_caesar': 'Julius_Caesar',
    'claudia': 'Claudia_(gens)',
    'bust': 'Roman_sculpture'
};

// Create maps to store text meshes and info for each artifact
const textMeshes = new Map();
const textInfo = new Map();

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

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
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
const floorTexture = new THREE.TextureLoader().load('./Floor texture.png');
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
const wallTexture = new THREE.TextureLoader().load('./wall_texture.jpg');
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
const roofTexture = new THREE.TextureLoader().load('./ceiling texture.png');
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



// Function to fetch Wikipedia summary
async function fetchWikiSummary(title) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
        const data = await response.json();
        return data.extract.split('.')[0] + '.'; // Get first sentence
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return 'Information unavailable';
    }
}

// Function to create text mesh
function createTextMesh(text, position) {
    if (!font) return null;

    const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.20,
        height: 0.02,
        curveSegments: 12,
        bevelEnabled: false
    });

    const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.1,
        roughness: 0.3
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Center the text
    textGeometry.computeBoundingBox();
    const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    textMesh.position.set(position.x + centerOffset, position.y + 0.5, position.z);
    
    textMesh.visible = false; // Hide initially
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;

    return textMesh;
}

// GLTFLoader setup
const loader = new GLTFLoader();
const tables = [];
const artifacts = [];

// Function to load table models
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


// class InfoPanel {
//     constructor(text, position) {
//         // Create smaller background panel with fixed size
//         const panelGeometry = new THREE.PlaneGeometry(1, 0.6); // Reduced size
//         const panelMaterial = new THREE.MeshPhongMaterial({
//             color: 0x1a1a1a,
//             transparent: true,
//             opacity: 0.9,
//             side: THREE.DoubleSide
//         });
//         this.panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
//         // Add border
//         const borderGeometry = new THREE.EdgesGeometry(panelGeometry);
//         const borderMaterial = new THREE.LineBasicMaterial({ color: 0x2c3e50, linewidth: 2 });
//         const border = new THREE.LineSegments(borderGeometry, borderMaterial);
//         this.panel.add(border);

//         // Position the panel next to artifact
//         this.panel.position.copy(position);
//         this.panel.position.x += 0.3; // Offset to the right of the artifact
        
//         // Create text wrapper with fixed orientation
//         this.textWrapper = new THREE.Group();
//         this.panel.add(this.textWrapper);
        
//         this.panel.visible = false;
//     }

//     updateText(font, text) {
//         // Clear existing text
//         while (this.textWrapper.children.length > 0) {
//             const child = this.textWrapper.children[0];
//             child.geometry.dispose();
//             child.material.dispose();
//             this.textWrapper.remove(child);
//         }
    
//         // Split text into words and create text geometry
//         const words = text.split(' ');
//         let currentLine = '';
//         let yPosition = 0.2; // Adjusted starting position
//         const lineHeight = 0.08; // Reduced line height
//         const maxWidth = 0.9; // Reduced maximum width for text lines
    
//         const textMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0xffffff,
//             metalness: 0,
//             roughness: 1
//         });
    
//         words.forEach((word, index) => {
//             const testLine = currentLine + word + ' ';
//             const testGeometry = new TextGeometry(testLine, {
//                 font: font,
//                 size: 0.05, // Reduced text size
//                 height: 0.001,
//                 curveSegments: 4,
//                 bevelEnabled: false
//             });
//             testGeometry.computeBoundingBox();
//             const lineWidth = testGeometry.boundingBox.max.x - testGeometry.boundingBox.min.x;
    
//             if (lineWidth > maxWidth && currentLine !== '') {
//                 this.createTextLine(font, textMaterial, currentLine, yPosition);
//                 yPosition -= lineHeight;
//                 currentLine = word + ' ';
//             } else {
//                 currentLine = testLine;
//             }

//             testGeometry.dispose();

//             if (index === words.length - 1 && currentLine !== '') {
//                 this.createTextLine(font, textMaterial, currentLine, yPosition);
//             }
//         });
//     }

//     createTextLine(font, material, text, yPosition) {
//         const textGeometry = new TextGeometry(text, {
//             font: font,
//             size: 0.05, // Reduced text size
//             height: 0.001,
//             curveSegments: 4,
//             bevelEnabled: false
//         });
//         textGeometry.computeBoundingBox();
        
//         const lineWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
//         const backgroundGeometry = new THREE.PlaneGeometry(lineWidth + 0.05, 0.08);
//         const backgroundMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x333333, 
//             transparent: true, 
//             opacity: 0.8 
//         });
        
//         const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
//         background.position.set(0, yPosition, 0); // Centered position
//         this.textWrapper.add(background);

//         // Create and position text
//         const textMesh = new THREE.Mesh(textGeometry, material);
//         textMesh.position.set( -0.0 - lineWidth/2, yPosition, 0.01);
//         this.textWrapper.add(textMesh);
//     }

//     show() {
//         this.panel.visible = true;
//     }

//     hide() {
//         this.panel.visible = false;
//     }

//     // Simplified update method - no rotation needed
//     update() {
//         // Panel is now static, so no updates needed
//         return;
//     }
// }





class InfoPanel {
    constructor(text, position) {
        // Create glass-like background panel
        const panelGeometry = new THREE.PlaneGeometry(1.2, 0.8);
        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
        });
        this.panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Add gradient overlay
        const gradientTexture = new THREE.CanvasTexture(this.createGradientCanvas());
        const overlayGeometry = new THREE.PlaneGeometry(1.2, 0.8);
        const overlayMaterial = new THREE.MeshBasicMaterial({
            map: gradientTexture,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
        this.overlay.position.z = 0.001;
        this.panel.add(this.overlay);
        
        // Add animated border
        const borderGeometry = new THREE.EdgesGeometry(panelGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ffff,
            linewidth: 2
        });
        this.border = new THREE.LineSegments(borderGeometry, borderMaterial);
        this.border.position.z = 0.002;
        this.panel.add(this.border);

        // Position panel
        this.panel.position.copy(position);
        this.panel.position.x += 0.3;
        
        // Create text wrapper with initial rotation
        this.textWrapper = new THREE.Group();
        this.panel.add(this.textWrapper);
        
        this.panel.visible = false;
        this.targetOpacity = 0;
        this.currentOpacity = 0;
        
        // Animation properties
        this.floatAmplitude = 0.05;
        this.floatSpeed = 2;
        this.initialY = this.panel.position.y;
        this.time = 0;
        
        // Text animation properties
        this.textAnimationPhase = 0;
        this.letterSpacing = 0;

        // User interaction properties
        this.userMovement = new THREE.Vector2(0, 0);
        this.lastMousePosition = new THREE.Vector2(0, 0);
        this.tiltAmount = 0.1;
        this.tiltSmoothing = 0.1;
        this.targetRotation = new THREE.Euler(0, 0, 0);
        this.currentRotation = new THREE.Euler(0, 0, 0);

        // Add mouse move listener
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.userMovement.x = mouseX - this.lastMousePosition.x;
        this.userMovement.y = mouseY - this.lastMousePosition.y;
        
        this.lastMousePosition.set(mouseX, mouseY);
        
        // Calculate target rotation based on mouse position
        this.targetRotation.x = mouseY * this.tiltAmount;
        this.targetRotation.y = mouseX * this.tiltAmount;
    }

    createGradientCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, 'rgba(41, 128, 185, 0.4)');
        gradient.addColorStop(0.5, 'rgba(52, 152, 219, 0.2)');
        gradient.addColorStop(1, 'rgba(41, 128, 185, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        return canvas;
    }

    updateText(font, text) {
        while (this.textWrapper.children.length > 0) {
            const child = this.textWrapper.children[0];
            child.geometry.dispose();
            child.material.dispose();
            this.textWrapper.remove(child);
        }
    
        const words = text.split(' ');
        let currentLine = '';
        let yPosition = 0.25;
        const lineHeight = 0.1;
        const maxWidth = 1;
    
        // Simplified white text material with good visibility
        const textMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.3
        });
    
        words.forEach((word, index) => {
            const testLine = currentLine + word + ' ';
            const testGeometry = new TextGeometry(testLine, {
                font: font,
                size: 0.06,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.001,
                bevelSize: 0.001,
                bevelSegments: 3
            });
            testGeometry.computeBoundingBox();
            const lineWidth = testGeometry.boundingBox.max.x - testGeometry.boundingBox.min.x;
    
            if (lineWidth > maxWidth && currentLine !== '') {
                this.createTextLine(font, textMaterial, currentLine, yPosition);
                yPosition -= lineHeight;
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }

            testGeometry.dispose();

            if (index === words.length - 1 && currentLine !== '') {
                this.createTextLine(font, textMaterial, currentLine, yPosition);
            }
        });
    }

    createTextLine(font, material, text, yPosition) {
        const textGeometry = new TextGeometry(text, {
            font: font,
            size: 0.06,
            height: 0.005,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.001,
            bevelSegments: 3
        });
        
        textGeometry.computeBoundingBox();
        const lineWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        
        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.set(-lineWidth/2, yPosition, 0.01);
        this.textWrapper.add(textMesh);
    }

    show() {
        this.panel.visible = true;
        this.targetOpacity = 1;
    }

    hide() {
        this.targetOpacity = 0;
        this.panel.visible = false;
        // setTimeout(() => {
        //     if (this.currentOpacity <= 0.1) {
                
        //     }
        // }, 500);
    }

    update(cameraPosition) {
        // Smooth opacity transition
        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.1;
        this.panel.material.opacity = this.currentOpacity * 0.7;
        this.overlay.material.opacity = this.currentOpacity * 0.3;
        
        // Floating animation
        this.time += 0.016;
        this.panel.position.y = this.initialY + Math.sin(this.time * this.floatSpeed) * this.floatAmplitude;
        
        // Border color animation
        const hue = (Math.sin(this.time) + 1) * 0.5;
        this.border.material.color.setHSL(hue, 1, 0.5);
        
        // Smooth panel rotation based on user movement
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.tiltSmoothing;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.tiltSmoothing;
        
        // Apply rotation while maintaining camera face direction
        const direction = new THREE.Vector3()
            .subVectors(cameraPosition, this.panel.position)
            .normalize();
        this.panel.lookAt(cameraPosition);
        this.panel.rotateX(this.currentRotation.x);
        this.panel.rotateY(this.currentRotation.y);
        
        // Animate text with subtle hover effect
        this.textAnimationPhase += 0.05;
        this.textWrapper.children.forEach((textMesh, index) => {
            const hoverOffset = Math.sin(this.textAnimationPhase + index * 0.5) * 0.005;
            textMesh.position.z = 0.01 + hoverOffset;
        });
    }

    // Clean up method
    dispose() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        // Dispose of geometries and materials
        this.panel.geometry.dispose();
        this.panel.material.dispose();
        this.overlay.geometry.dispose();
        this.overlay.material.dispose();
        this.border.geometry.dispose();
        this.border.material.dispose();
    }
}




// Enhanced artifact loading function with Wikipedia integration
async function loadArtifactModel(url, position, rotation,isLast, x = 0.5, y = 0.5, z = 0.5,) {
    const artifactName = url.split('/').pop().split('.')[0];
    const wikiTitle = artifactInfo[artifactName];
    
    const summary = await fetchWikiSummary(wikiTitle);
    
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

        // Create info panel
        const panelPosition = position.clone();
        if (isLast === true){
            panelPosition.x += 2
        }
        else{
            panelPosition.x += 1
        }
         // Offset panel to the right of artifact
        const infoPanel = new InfoPanel(summary, panelPosition);
        scene.add(infoPanel.panel);
        
        // Store panel reference
        textMeshes.set(artifact.uuid, infoPanel);
        textInfo.set(artifact.uuid, summary);
        
        // Update panel text when font is loaded
        if (font) {
            infoPanel.updateText(font, summary);
        } else {
            fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json', 
                (loadedFont) => {
                    font = loadedFont;
                    infoPanel.updateText(font, summary);
                }
            );
        }
        
        scene.add(artifact);
        artifacts.push(artifact);
    });
}


function checkProximity() {
    const maxDistance = 3;
    artifacts.forEach(artifact => {
        const distance = camera.position.distanceTo(artifact.position);
        const infoPanel = textMeshes.get(artifact.uuid);
        
        if (infoPanel) {
            if (distance < maxDistance) {
                infoPanel.show();
                infoPanel.update(camera.position);
            } else {
                infoPanel.hide();
            }
        }
    });
}

// Table and artifact positions
const tableModelUrl = './table_new.glb';
const artifactModelUrls = ['./dagger.glb', './romulus.glb', './pot.glb', './roman_coins.glb', './helmet.glb', './julius_caesar.glb', './claudia.glb', './bust.glb'];

const tablePositions = [
    new THREE.Vector3(-6, 0, -3),
    new THREE.Vector3(-2, 0, -3),
    new THREE.Vector3(2, 0, -3),
    new THREE.Vector3(6, 0, -3),
    new THREE.Vector3(-6, 0, 3),
    new THREE.Vector3(-2, 0, 3),
    new THREE.Vector3(2, 0, 3),
    new THREE.Vector3(6, 0, 3)
];

tablePositions.forEach(pos => loadTableModel(tableModelUrl, pos));

const loadArtifacts = () => {
    const artifactPositions = [
        new THREE.Vector3(-6, 1.45, -3),
        new THREE.Vector3(-2.10, 1.1, -2.9),
        new THREE.Vector3(2, 1.1, -2.85),
        new THREE.Vector3(6, 1.1, -3),
        new THREE.Vector3(-6, -0.41, 3.05),
        new THREE.Vector3(-1.97, 1.64, 3.05),
        new THREE.Vector3(2.1, 1.6, 3),
        new THREE.Vector3(5.1, 1.7, 3.5)
    ];
    
    const artifactRotations = [
        new THREE.Euler(0, Math.PI / 4, 0),
        new THREE.Euler(0, Math.PI * 2, 0),
        new THREE.Euler(0, Math.PI / 2, 0),
        new THREE.Euler(150, -Math.PI / 4, 0),
        new THREE.Euler(0, Math.PI / 6, 0),
        new THREE.Euler(0, -Math.PI * 2, 0),
        new THREE.Euler(0, Math.PI * 2.2, 0),
        new THREE.Euler(0, Math.PI * 2.5, 0)
    ];

    artifactPositions.forEach((pos, index) => {
        let x = 0.5, y = 0.5, z = 0.5;
        if (index === 1) { x = 0.3; y = 0.3; z = 0.3; }
        else if (index === 2) { x = 0.1; y = 0.1; z = 0.1; }
        else if (index == 5) { x = 0.08; y = 0.08; z = 0.08; }
        else if (index == 4) { x = 1; y = 1; z = 1 }
        else if (index == 7) { x = 0.18; y = 0.18; z = 0.18; }
        let m = false;
        if(index == 7){m = true}
        loadArtifactModel(artifactModelUrls[index], pos, artifactRotations[index],m, x, y, z);
    });
};

loadArtifacts();

// PointerLockControls setup for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Raycaster for collision detection
const raycaster = new THREE.Raycaster();
const collisionDistance = 0.5;

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
    0.7, // Strength
    0.4, // Radius
    0.85 // Threshold
);
composer.addPass(bloomPass);

// FXAA Pass setup
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveCamera();
    checkProximity();
    composer.render();
}

animate();



