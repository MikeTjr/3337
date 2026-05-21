import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class InteractionController {
  constructor(engine, machine) {
    this.engine = engine;
    this.machine = machine;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragging = false;
    this.dragMode = null;
    this.lastPointer = { x: 0, y: 0 };

    this.domElement = engine.renderer.domElement;
    this.domElement.style.touchAction = 'none';

    this.bindEvents();
  }

  bindEvents() {
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    window.addEventListener('mouseleave', this.onPointerUp);
  }

  dispose() {
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    window.removeEventListener('mouseleave', this.onPointerUp);
  }

  onPointerDown = (event) => {
    this.updatePointer(event);
    const hits = this.intersectInteractive();
    if (hits.length > 0) {
      this.dragging = true;
      this.dragMode = 'wheel';
      this.lastPointer.x = event.clientX;
      this.lastPointer.y = event.clientY;
      this.engine.controls.enabled = false;
      event.preventDefault();
    }
  };

  onPointerMove = (event) => {
    if (!this.dragging) return;

    const dx = event.clientX - this.lastPointer.x;
    const dy = event.clientY - this.lastPointer.y;
    this.lastPointer.x = event.clientX;
    this.lastPointer.y = event.clientY;

    if (this.dragMode === 'wheel') {
      const spinAmount = (dx - dy) * 0.0024;
      this.machine.spinManual(Math.abs(spinAmount) * 8 + 0.4);
      event.preventDefault();
    }
  };

  onPointerUp = () => {
    this.dragging = false;
    this.dragMode = null;
    this.engine.controls.enabled = true;
  };

  updatePointer(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  intersectInteractive() {
    this.raycaster.setFromCamera(this.pointer, this.engine.camera);
    return this.raycaster.intersectObjects(this.machine.interactiveObjects, true);
  }
}
