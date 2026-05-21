import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';

export class SimulationEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Simulation container not found: ${containerId}`);
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    this.controls = null;
    this.clock = new THREE.Clock();
    this.updatables = [];
    this.running = false;

    this.telemetry = {
      frameCount: 0,
      lastFpsTick: performance.now(),
    };

    this.init();
  }

  init() {
    this.scene.background = new THREE.Color(0x0f0f10);
    this.scene.fog = new THREE.Fog(0x0f0f10, 18, 48);

    this.camera.position.set(0, 5.25, 11.5);
    this.camera.lookAt(0, 1.4, 0);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.container.clientWidth || window.innerWidth, this.container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(0, 1.35, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.52);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(5, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.32);
    fillLight.position.set(-7, 3, -4);
    this.scene.add(fillLight);

    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 1, metalness: 0 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -1.85;
    this.scene.add(floor);

    window.addEventListener('resize', () => this.resize());
  }

  add(object3d) {
    this.scene.add(object3d);
    return object3d;
  }

  registerUpdateCallback(callback) {
    this.updatables.push(callback);
  }

  resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  start() {
    if (this.running) return;
    this.running = true;

    const tick = () => {
      if (!this.running) return;
      requestAnimationFrame(tick);

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      for (const update of this.updatables) {
        update(elapsed, delta);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      this.telemetry.frameCount += 1;
      const now = performance.now();
      if (now - this.telemetry.lastFpsTick >= 1000) {
        const fpsElement = document.getElementById('status-fps');
        if (fpsElement) {
          fpsElement.textContent = String(this.telemetry.frameCount);
        }
        this.telemetry.frameCount = 0;
        this.telemetry.lastFpsTick = now;
      }
    };

    requestAnimationFrame(tick);
  }
}
