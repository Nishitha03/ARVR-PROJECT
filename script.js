// Import essential modules from THREE.js and other libraries for advanced rendering, controls, and effects
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

// Font loader setup for rendering text in 3D
const fontLoader = new FontLoader();
let font;

// Load the font from an external source
fontLoader.load(
    'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json',
    function (loadedFont) {
        font = loadedFont; // Save the loaded font for later use
    }
);

// Define a mapping of artifact URLs to their corresponding descriptive names
const artifactInfo = {
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fdagger.glb?alt=media&token=aa849bf1-e745-424d-9f59-3f3b6935d822': 'Pugio',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fromulus.glb?alt=media&token=0aa559a2-9cde-47b0-b2d3-330ef0e0e6dc': 'Romulus',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fpot.glb?alt=media&token=63d01c0c-4893-42c7-b409-fcf01331774b': 'Ancient_Roman_pottery',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Froman_coins.glb?alt=media&token=5df8a955-6bcf-4127-8860-604d3354fcf4': 'Roman_currency',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fhelmet.glb?alt=media&token=5d6c20fd-3891-4adb-9109-f478fef46c68': 'Galea_(helmet)',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fjulius_caesar.glb?alt=media&token=d369886b-3980-468a-8033-af0fde80593a': 'Julius_Caesar',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fclaudia.glb?alt=media&token=aacc59d9-5e85-45ad-88e6-55d7f728a4d9': 'Claudia_(gens)',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fbust.glb?alt=media&token=b8615138-b92e-43d1-a0b4-19a0cfdc86ad': 'Roman_sculpture',
};

// Maps to store 3D text meshes and associated info for each artifact
const textMeshes = new Map();
const textInfo = new Map();

// Scene setup
const scene = new THREE.Scene(); // Create a new scene
const camera = new THREE.PerspectiveCamera(
    75, // Field of view in degrees
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);

// Renderer setup with enhanced performance and visual quality
const renderer = new THREE.WebGLRenderer({
    antialias: true, // Enable anti-aliasing for smoother edges
    powerPreference: 'high-performance', // Optimize for performance
});
renderer.setSize(window.innerWidth, window.innerHeight); // Match the size to the window
renderer.setPixelRatio(window.devicePixelRatio); // Account for high DPI displays
renderer.outputEncoding = THREE.sRGBEncoding; // Correct color output
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Filmic tone mapping for realistic lighting
renderer.toneMappingExposure = 1.2; // Adjust exposure for balanced brightness
document.body.appendChild(renderer.domElement); // Add the renderer canvas to the HTML body

// Set the initial camera position
camera.position.set(0, 1.6, 7); // Positioned for a clear view of the scene

// Enable shadows for realistic lighting
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for smooth effects

// Add ambient lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Soft white light with high intensity
scene.add(ambientLight); // Add to the scene

// Directional Light: Simulates sunlight or strong direct light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // White light with intensity 2.0
directionalLight.position.set(5, 10, 5); // Position the light source
directionalLight.castShadow = true; // Enable shadow casting
directionalLight.shadow.mapSize.width = 2048; // Higher map size for better shadow quality
directionalLight.shadow.mapSize.height = 2048; // Higher map size for better shadow quality
directionalLight.shadow.camera.near = 0.5; // Near plane of shadow camera
directionalLight.shadow.camera.far = 50; // Far plane of shadow camera
directionalLight.shadow.bias = -0.0001; // Small bias to prevent shadow acne
directionalLight.shadow.normalBias = 0.02; // Bias to improve shadow appearance
scene.add(directionalLight); // Add to the scene

// Point Light 1: Emits light in all directions from a point
const pointLight1 = new THREE.PointLight(0xffcc99, 2.2, 30); // Light with a peach color and intensity 2.2
pointLight1.position.set(0, 5, -5); // Position the point light
pointLight1.castShadow = true; // Enable shadow casting
pointLight1.shadow.mapSize.width = 1024; // Shadow map resolution for point light
pointLight1.shadow.mapSize.height = 1024; // Shadow map resolution for point light
scene.add(pointLight1); // Add to the scene

// Point Light 2: Similar to the first point light but with a different color
const pointLight2 = new THREE.PointLight(0x99ccff, 2.2, 30); // Light with a light blue color
pointLight2.position.set(-5, 5, 5); // Position the point light
pointLight2.castShadow = true; // Enable shadow casting
pointLight2.shadow.mapSize.width = 1024; // Shadow map resolution for point light
pointLight2.shadow.mapSize.height = 1024; // Shadow map resolution for point light
scene.add(pointLight2); // Add to the scene

// Point Light 3: Another point light with a different color
const pointLight3 = new THREE.PointLight(0xff9999, 2.0, 30); // Light with a soft red color
pointLight3.position.set(5, 5, -5); // Position the point light
pointLight3.castShadow = true; // Enable shadow casting
pointLight3.shadow.mapSize.width = 1024; // Shadow map resolution for point light
pointLight3.shadow.mapSize.height = 1024; // Shadow map resolution for point light
scene.add(pointLight3); // Add to the scene

// Spot Light: A light that shines in a specific direction with a cone-shaped beam
const spotLight = new THREE.SpotLight(0xffffff, 2.0); // White light with intensity 2.0
spotLight.position.set(0, 10, 0); // Position the spot light
spotLight.angle = Math.PI / 6; // Cone angle for the spotlight
spotLight.penumbra = 0.3; // Softness of the spotlight's edge
spotLight.decay = 2; // The light decay (how it fades with distance)
spotLight.distance = 40; // Maximum distance the light can travel
spotLight.castShadow = true; // Enable shadow casting
spotLight.shadow.mapSize.width = 1024; // Shadow map resolution for spot light
spotLight.shadow.mapSize.height = 1024; // Shadow map resolution for spot light
scene.add(spotLight); // Add to the scene

// Hemisphere Light: Provides ambient light with two colors, simulating sky and ground lighting
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x483D8B, 0.3); // Sky and ground colors with soft intensity
scene.add(hemisphereLight); // Add to the scene

// Ground setup: Creating a floor for the scene
const floorGeometry = new THREE.PlaneGeometry(20, 20); // Plane geometry for the ground with width and height of 20
const floorTexture = new THREE.TextureLoader().load('https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2FFloor%20texture.png?alt=media&token=a7e5a2d4-c7a5-4ca5-aae0-64abee548e25'); // Load texture for the floor
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; // Texture wrapping to repeat in both directions
floorTexture.repeat.set(4, 4); // Repeat texture 4 times on both axes
const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture, // Apply texture to the material
    roughness: 0.7, // Make the surface rough
    metalness: 0.4444, // Slight metallic effect
    side: THREE.DoubleSide // Display the floor on both sides
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial); // Create floor mesh
floor.rotation.x = -Math.PI / 2; // Rotate the floor to lie flat
floor.receiveShadow = true; // Enable receiving shadows on the floor
scene.add(floor); // Add the floor to the scene

// Wall setup: Creating textured walls
const wallTexture = new THREE.TextureLoader().load('https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fwall_texture.jpg?alt=media&token=bd3ba934-41e9-4d83-b2b3-ca30f034ae35'); // Load wall texture
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping; // Texture wrapping for the wall
wallTexture.repeat.set(2, 1); // Repeat texture twice on the X-axis and once on the Y-axis
const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallTexture, // Apply texture to the material
    roughness: 0.6, // Slightly rough surface
    metalness: 0.4, // Slight metallic effect
    side: THREE.DoubleSide // Display the wall on both sides
});
const wallGeometry = new THREE.PlaneGeometry(20, 3); // Wall geometry with width 20 and height 3

// Front wall setup
const frontWall = new THREE.Mesh(wallGeometry, wallMaterial); // Create front wall mesh
frontWall.position.set(0, 1.5, -10); // Position the front wall
frontWall.receiveShadow = true; // Enable receiving shadows
scene.add(frontWall); // Add front wall to the scene

// Back wall setup: Clone front wall to create the back wall
const backWall = frontWall.clone(); 
backWall.position.set(0, 1.5, 10); // Position the back wall
backWall.rotation.y = Math.PI; // Rotate 180 degrees to face opposite direction
backWall.receiveShadow = true; // Enable receiving shadows
scene.add(backWall); // Add back wall to the scene

// Left wall setup: Positioning the left wall
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial); // Create left wall mesh
leftWall.rotation.y = Math.PI / 2; // Rotate to face left direction
leftWall.position.set(-10, 1.5, 0); // Position the left wall
leftWall.receiveShadow = true; // Enable receiving shadows
scene.add(leftWall); // Add left wall to the scene

// Right wall setup: Clone the left wall for the right wall
const rightWall = leftWall.clone(); 
rightWall.position.set(10, 1.5, 0); // Position the right wall
rightWall.receiveShadow = true; // Enable receiving shadows
scene.add(rightWall); // Add right wall to the scene

// Roof setup: Creating a ceiling for the scene
const roofGeometry = new THREE.PlaneGeometry(20, 20); // Roof geometry with width and height of 20
const roofTexture = new THREE.TextureLoader().load('https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fceiling%20texture.png?alt=media&token=1316c2cb-b420-40f6-bfdb-ba7f63997125'); // Load ceiling texture
roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping; // Texture wrapping for the roof
roofTexture.repeat.set(4, 4); // Repeat texture 4 times on both axes
const roofMaterial = new THREE.MeshStandardMaterial({ 
    map: roofTexture, // Apply texture to the material
    roughness: 0.6, // Slightly rough surface
    metalness: 0.3, // Slight metallic effect
    side: THREE.DoubleSide // Display the roof on both sides
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial); // Create roof mesh
roof.rotation.x = Math.PI / 2; // Rotate to position as the ceiling
roof.position.set(0, 3, 0); // Position the roof
roof.receiveShadow = true; // Enable receiving shadows
scene.add(roof); // Add roof to the scene

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
        const table = gltf.scene;     // The loaded 3D model scene
        table.position.copy(position);  // Set model's position
        table.position.y = 0;
        table.scale.set(1.4, 1.4, 1.4);  // Scale the model for better visibility
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

// InfoPanel class to create a panel with a gradient overlay and animated border
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
            metalness: 0.4,
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
async function loadArtifactModel(url, position, rotation, isLast, x = 0.5, y = 0.5, z = 0.5) {
    const artifactName = url;  // Use URL as a key to fetch artifact information
    const wikiTitle = artifactInfo[artifactName];  // Get the Wikipedia title for the artifact
    
    // Fetch the Wikipedia summary asynchronously
    const summary = await fetchWikiSummary(wikiTitle);
    
    // Load the 3D model using the GLTFLoader
    loader.load(url, (gltf) => {
        const artifact = gltf.scene;  // Extract the loaded scene (artifact)
        artifact.position.copy(position);  // Set the artifact's position
        artifact.rotation.copy(rotation);  // Set the artifact's rotation
        artifact.scale.set(x, y, z);  // Set the artifact's scale

        // Traverse through all child objects in the artifact and set shadow properties
        artifact.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;  // Enable the mesh to cast shadows
                child.receiveShadow = true;  // Enable the mesh to receive shadows
                child.material.roughness = 0.5;  // Set the roughness of the material for a matte look
                child.material.metalness = 0.5; // Set moderate metalness for a semi-shiny effect
            }
        });

        // Create a new info panel to display the Wikipedia summary
        const panelPosition = position.clone();  // Clone the artifact's position to position the panel
        if (isLast === true) {
            panelPosition.x += 2;  // If the artifact is the last, offset the panel more
        } else {
            panelPosition.x += 1;  // Otherwise, a smaller offset for the panel
        }

        // Create and add the info panel to the scene
        const infoPanel = new InfoPanel(summary, panelPosition);
        scene.add(infoPanel.panel);

        // Store references to the panel and the associated text in maps
        textMeshes.set(artifact.uuid, infoPanel);  // Map to store the panel with the artifact's UUID
        textInfo.set(artifact.uuid, summary);  // Map to store the summary text with the artifact's UUID
        
        // Update the panel's text when the font is loaded
        if (font) {
            infoPanel.updateText(font, summary);  // If the font is already loaded, update the text
        } else {
            // Load the font dynamically if not loaded already
            fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json', 
                (loadedFont) => {
                    font = loadedFont;  // Store the loaded font
                    infoPanel.updateText(font, summary);  // Update the text on the info panel
                }
            );
        }
        
        // Add the artifact to the scene and store it in the artifacts array
        scene.add(artifact);
        artifacts.push(artifact);  // Store the loaded artifact for later use
    });
}
// Function to check the proximity of the camera to the artifacts and display the info panel
function checkProximity() {
    const maxDistance = 3;  // Define the maximum distance at which the info panel is shown
    artifacts.forEach(artifact => {
        const distance = camera.position.distanceTo(artifact.position);  // Calculate the distance from the camera to the artifact
        const infoPanel = textMeshes.get(artifact.uuid);  // Retrieve the associated info panel for the artifact
        
        // If the info panel exists and the artifact is within the maximum distance, show it
        if (infoPanel) {
            if (distance < maxDistance) {
                infoPanel.show();  // Display the info panel
                infoPanel.update(camera.position);  // Update the position of the info panel relative to the camera
            } else {
                infoPanel.hide();  // Hide the info panel if the artifact is out of range
            }
        }
    });
}

// Define the URL for the table model
const tableModelUrl = 'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Ftable_new.glb?alt=media&token=2235aadd-7e91-4c14-abcc-fb1049b3b135';

// Define the URLs for the artifact models
const artifactModelUrls = [
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fdagger.glb?alt=media&token=aa849bf1-e745-424d-9f59-3f3b6935d822', 
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fromulus.glb?alt=media&token=0aa559a2-9cde-47b0-b2d3-330ef0e0e6dc', 
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fpot.glb?alt=media&token=63d01c0c-4893-42c7-b409-fcf01331774b',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Froman_coins.glb?alt=media&token=5df8a955-6bcf-4127-8860-604d3354fcf4',
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fhelmet.glb?alt=media&token=5d6c20fd-3891-4adb-9109-f478fef46c68', 
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fjulius_caesar.glb?alt=media&token=d369886b-3980-468a-8033-af0fde80593a', 
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fclaudia.glb?alt=media&token=aacc59d9-5e85-45ad-88e6-55d7f728a4d9', 
    'https://firebasestorage.googleapis.com/v0/b/musiq-6f2a8.appspot.com/o/arvr%2Fbust.glb?alt=media&token=b8615138-b92e-43d1-a0b4-19a0cfdc86ad'
];

// Define table positions for the models in the scene
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

// Load each table model at the specified positions
tablePositions.forEach(pos => loadTableModel(tableModelUrl, pos));

// Function to load artifact models into the scene
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
    
    // Define rotations for each artifact
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

    // Load each artifact model at the specified positions and rotations
    artifactPositions.forEach((pos, index) => {
        let x = 0.5, y = 0.5, z = 0.5;
        // Adjust scale for specific artifacts
        if (index === 1) { x = 0.3; y = 0.3; z = 0.3; }
        else if (index === 2) { x = 0.1; y = 0.1; z = 0.1; }
        else if (index == 5) { x = 0.08; y = 0.08; z = 0.08; }
        else if (index == 4) { x = 1; y = 1; z = 1 }
        else if (index == 7) { x = 0.18; y = 0.18; z = 0.18; }

        let m = false;
        // Set the 'isLast' flag for the last artifact
        if (index == 7) { m = true }

        // Load the artifact model with the adjusted parameters
        loadArtifactModel(artifactModelUrls[index], pos, artifactRotations[index], m, x, y, z);
    });
};

// Invoke the function to load artifacts into the scene
loadArtifacts();

// PointerLockControls setup for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());  // Add the camera-controlled object to the scene

// Raycaster for collision detection (e.g., for player movement)
const raycaster = new THREE.Raycaster();
const collisionDistance = 0.5;  // Set the collision distance threshold

// Movement parameters (speed and keys for movement)
const movementSpeed = 0.1;
const keys = { w: false, a: false, s: false, d: false };

// Event listener for keydown events to handle player input (movement and escape)
window.addEventListener('keydown', (event) => {
    if (keys[event.key] !== undefined) keys[event.key] = true;  // Update the movement keys
    if (event.key === 'Escape') controls.unlock();  // Unlock the pointer control when 'Escape' is pressed
});
// Listen for 'keyup' events to stop the movement when a key is released
window.addEventListener('keyup', (event) => {
    if (keys[event.key] !== undefined) keys[event.key] = false; // Mark the key as not pressed
});

// Listen for a mouse click to lock the pointer (for first-person view)
document.body.addEventListener('click', () => {
    controls.lock();  // Lock the mouse pointer for first-person controls
});

// Function to detect collision in a given direction
function checkCollision(direction) {
    raycaster.set(camera.position, direction);  // Set the raycaster from the camera's position in the given direction
    const intersects = raycaster.intersectObjects(scene.children, true);  // Check for intersections with scene objects
    if (intersects.length > 0 && intersects[0].distance < collisionDistance) {  // If the distance to the intersection is less than the collision distance, return true
        return true;
    }
    return false;  // No collision detected
}

// Function to move the camera based on user input
const moveCamera = () => {
    if (!controls.isLocked) return;  // If the controls are not locked, don't move the camera

    const direction = new THREE.Vector3();  // Vector to store the direction the camera is facing
    const right = new THREE.Vector3();  // Vector to store the right direction (for strafing left/right)
    camera.getWorldDirection(direction);  // Get the world direction the camera is facing
    right.crossVectors(camera.up, direction).normalize();  // Calculate the right direction based on the camera's up vector and world direction

    // Move forward/backward
    if (keys.w && !checkCollision(direction)) controls.moveForward(movementSpeed);  // Move forward if 'W' is pressed and no collision detected
    if (keys.s && !checkCollision(direction.negate())) controls.moveForward(-movementSpeed);  // Move backward if 'S' is pressed and no collision detected

    // Move left/right
    if (keys.a && !checkCollision(right.negate())) controls.moveRight(-movementSpeed);  // Move left if 'A' is pressed and no collision detected
    if (keys.d && !checkCollision(right)) controls.moveRight(movementSpeed);  // Move right if 'D' is pressed and no collision detected
};

// Listen for window resize and adjust camera and renderer accordingly
window.addEventListener('resize', () => {
    const width = window.innerWidth;  // Get the new window width
    const height = window.innerHeight;  // Get the new window height
    renderer.setSize(width, height);  // Update the renderer size
    camera.aspect = width / height;  // Update the camera aspect ratio
    camera.updateProjectionMatrix();  // Update the camera projection matrix
    composer.setSize(width, height);  // Update the composer size for post-processing
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);  // Update the FXAA pass resolution
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);  // Update the FXAA pass resolution
});

// Post-processing setup
const composer = new EffectComposer(renderer);  // Create an EffectComposer for post-processing
const renderPass = new RenderPass(scene, camera);  // Add the basic render pass to the composer
composer.addPass(renderPass);  // Add the render pass to the composer

// Setup for UnrealBloomPass (for bloom effects)
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),  // Set the size of the bloom pass
    0.7,  // Strength of the bloom effect
    0.4,  // Radius of the bloom effect
    0.85  // Threshold for bloom to occur
);
composer.addPass(bloomPass);  // Add the bloom pass to the composer

// Setup for FXAA (Fast Approximate Anti-Aliasing) pass
const fxaaPass = new ShaderPass(FXAAShader);  // Create the FXAA pass
const pixelRatio = renderer.getPixelRatio();  // Get the renderer's pixel ratio
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);  // Update the FXAA pass resolution
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);  // Update the FXAA pass resolution
composer.addPass(fxaaPass);  // Add the FXAA pass to the composer

// Animation loop
function animate() {
    requestAnimationFrame(animate);  // Request the next animation frame
    moveCamera();  // Move the camera based on user input
    checkProximity();  // Check for proximity and show/hide info panels as necessary
    composer.render();  // Render the scene with post-processing effects
}
// Create and inject the CSS styles for the start overlay into the HTML document
const style = document.createElement('style');
style.textContent = `
.start-overlay {
    position: fixed;  // Fixed position to cover the entire viewport
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);  // Semi-transparent black background
    display: flex;
    flex-direction: column;  // Align items vertically
    justify-content: center;  // Center content vertically
    align-items: center;  // Center content horizontally
    z-index: 1000;  // Ensure it appears above other content
    transition: opacity 1s ease;  // Smooth fade-out effect
}

.start-overlay h1 {
    color: white;  // White text color for the title
    font-size: 3.5rem;  // Large font size for the title
    margin-bottom: 2rem;  // Margin to create space below the title
    font-family: serif;  // Serif font for the title
}

.start-overlay p {
    color: #cccccc;  // Light grey text for the description
    font-size: 1.2rem;  // Slightly larger font for readability
    max-width: 500px;  // Limit the width of the paragraph for better layout
    text-align: center;  // Center align the text
    margin: 0.5rem 0;  // Add some vertical space between paragraphs
}

.controls-info {
    color: #999999;  // Darker grey for controls info
    margin: 2rem 0;  // Add vertical space before and after
    text-align: center;  // Center the text
}

.start-button {
    background: white;  // White background for the start button
    color: black;  // Black text for visibility
    border: none;  // No border for the button
    padding: 1rem 2rem;  // Padding for a larger clickable area
    font-size: 1.2rem;  // Font size for the button text
    border-radius: 8px;  // Rounded corners for the button
    cursor: pointer;  // Pointer cursor to indicate it’s clickable
    transition: transform 0.2s ease, background-color 0.2s ease;  // Smooth hover effects
}

.start-button:hover {
    background: #e0e0e0;  // Change background color on hover
    transform: scale(1.05);  // Slightly enlarge the button on hover
}

.fade-out {
    opacity: 0;  // Fade the overlay out
}
`;
document.head.appendChild(style);  // Append the style to the head of the document

// Create the start screen HTML content
const startOverlay = document.createElement('div');
startOverlay.className = 'start-overlay';  // Add the class for styling
startOverlay.innerHTML = `
    <h1>Roman Artifacts Museum</h1>
    <p>Explore ancient Roman artifacts in our virtual museum.<br>
       Get close to items to reveal their historical information.</p>
    <div class="controls-info">
        <p>Controls:</p>
        <p>W, A, S, D - Move</p>
        <p>Mouse - Look around</p>
        <p>ESC - Exit fullscreen</p>
    </div>
    <button class="start-button">Enter Museum</button>
`;

// Add the overlay to the page body
document.body.appendChild(startOverlay);

// Handle the start button click event
const startButton = startOverlay.querySelector('.start-button');
startButton.addEventListener('click', () => {
    // Add fade-out effect to the overlay when clicked
    startOverlay.classList.add('fade-out');
    
    // After 1 second (fade-out duration), lock the pointer and remove the overlay
    setTimeout(() => {
        controls.lock();  // Lock the pointer for first-person navigation
        startOverlay.remove();  // Remove the start overlay after it fades out
    }, 1000);
});

// Remove the existing click listener (if any) before adding the new one
document.body.removeEventListener('click', () => controls.lock());

// Add a new click listener to lock the pointer only if the start-overlay is not present
document.body.addEventListener('click', () => {
    if (!document.querySelector('.start-overlay')) {
        controls.lock();  // Lock the pointer for first-person navigation
    }
});

// Start the animation loop
animate();
