/**
 * WebGL Graphical Processing Context
 * Handles rendering, camera configuration, lighting rigs, and display synchronization.
 */
export class SimulationEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.updatables = []; // Callbacks for mechanical loops
        
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fpsInterval = this.lastTime;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x121212);

        // Optimized Perspective Matrix for micro-macro views
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        // High-Performance Renderer Configuration
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Caps sub-sampling to maintain 4K frame pacing
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Camera Interactivity
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Balanced Lighting Arrays
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(0, 8, 2);
        spotLight.angle = Math.PI / 6;
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    addMesh(mesh) {
        this.scene.add(mesh);
    }

    registerUpdateCallback(callback) {
        this.updatables.push(callback);
    }

    start() {
        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            
            const now = performance.now();
            const delta = (now - this.lastTime) / 1000;
            this.frameCount++;

            // Handle telemetry frame counters
            if (now - this.fpsInterval >= 1000) {
                document.getElementById('status-fps').innerText = this.frameCount;
                this.frameCount = 0;
                this.fpsInterval = now;
            }

            // Fire registered mechanical transformations
            for (const update of this.updatables) {
                update(now, delta);
            }

            this.lastTime = now;
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        
        requestAnimationFrame(renderLoop);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
