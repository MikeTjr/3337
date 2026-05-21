import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class Singer3337 {
  constructor(engine, state) {
    this.engine = engine;
    this.state = state;
    this.group = new THREE.Group();
    this.group.name = 'Singer3337';

    this.interactiveObjects = [];
    this.wheelPivot = null;
    this.needleBar = null;
    this.presserFoot = null;
    this.fabricBed = null;
    this.manualWheelVelocity = 0;
    this.baseNeedleY = 0.6;

    this.buildMachineGeometry();
    this.engine.add(this.group);
  }

  buildMachineGeometry() {
    this.group.position.set(0, 0, 0);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf1f1ef,
      roughness: 0.28,
      metalness: 0.05,
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x232323,
      roughness: 0.65,
      metalness: 0.15,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xb9bcc0,
      roughness: 0.08,
      metalness: 0.95,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.5, 2.2), bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.set(0, 0.45, 0);
    this.group.add(body);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.45, 1.55), bodyMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    arm.position.set(-0.2, 2.0, 0);
    this.group.add(arm);

    const base = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.55, 2.6), darkMat);
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.set(0, -1.35, 0);
    this.group.add(base);

    const throatPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.0), chromeMat);
    throatPlate.position.set(-0.9, -1.1, 0);
    throatPlate.castShadow = true;
    throatPlate.receiveShadow = true;
    this.group.add(throatPlate);

    const needleClamp = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.38, 0.24), chromeMat);
    needleClamp.position.set(-0.95, 0.8, 0);
    needleClamp.castShadow = true;
    this.group.add(needleClamp);

    this.needleBar = new THREE.Group();
    this.needleBar.position.set(-0.95, this.baseNeedleY, 0);
    this.group.add(this.needleBar);

    const needleRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.15, 16), chromeMat);
    needleRod.castShadow = true;
    needleRod.position.set(0, -0.6, 0);
    this.needleBar.add(needleRod);

    const needleTip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 16), chromeMat);
    needleTip.castShadow = true;
    needleTip.position.set(0, -1.22, 0);
    needleTip.rotation.z = Math.PI;
    this.needleBar.add(needleTip);

    this.presserFoot = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.16, 0.92), darkMat);
    this.presserFoot.position.set(-0.9, -0.55, 0);
    this.presserFoot.castShadow = true;
    this.group.add(this.presserFoot);

    const footLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.95, 12), chromeMat);
    footLeg.position.set(-0.9, -0.1, 0);
    footLeg.castShadow = true;
    this.group.add(footLeg);

    const spoolPin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), chromeMat);
    spoolPin.position.set(0.8, 2.75, 0);
    spoolPin.castShadow = true;
    this.group.add(spoolPin);

    const topSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 20), new THREE.MeshStandardMaterial({
      color: 0xd7b46c,
      roughness: 0.4,
      metalness: 0.2,
    }));
    topSpool.position.set(0.8, 3.0, 0);
    topSpool.rotation.z = Math.PI / 2;
    topSpool.castShadow = true;
    this.group.add(topSpool);

    this.wheelPivot = new THREE.Group();
    this.wheelPivot.position.set(3.9, 0.95, 0.0);
    this.group.add(this.wheelPivot);

    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.28, 40), darkMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    this.wheelPivot.add(wheel);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 18), chromeMat);
    hub.rotation.z = Math.PI / 2;
    hub.castShadow = true;
    this.wheelPivot.add(hub);

    const indicator = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), chromeMat);
    indicator.position.set(0, 0.8, 0);
    this.wheelPivot.add(indicator);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 12, 48), new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.85,
      metalness: 0.1,
    }));
    belt.rotation.y = Math.PI / 2;
    belt.position.set(0.03, 0, 0);
    this.wheelPivot.add(belt);

    this.interactiveObjects.push(this.wheelPivot);

    const fabricBed = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 1.8, 20, 8),
      new THREE.MeshStandardMaterial({
        color: 0x6f7d7a,
        roughness: 1,
        metalness: 0,
        wireframe: false,
        side: THREE.DoubleSide,
      })
    );
    fabricBed.rotation.x = -Math.PI / 2;
    fabricBed.position.set(-0.6, -1.05, 0);
    fabricBed.receiveShadow = true;
    this.fabricBed = fabricBed;
    this.group.add(fabricBed);

    const plateBorder = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.07, 1.95),
      new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.8, metalness: 0.15 })
    );
    plateBorder.position.set(-0.6, -1.16, 0);
    plateBorder.castShadow = true;
    this.group.add(plateBorder);

    this.group.scale.set(0.9, 0.9, 0.9);
  }

  spinManual(amount) {
    this.manualWheelVelocity = Math.max(-18, Math.min(18, this.manualWheelVelocity + amount));
  }

  setPower(powered) {
    this.state.setPower(powered);
  }

  setPedal(pressed) {
    this.state.setPedal(pressed);
  }

  setStitchType(stitchType) {
    this.state.setStitchType(stitchType);
  }

  setTension(tension) {
    this.state.setTension(tension);
  }

  update(time, delta) {
    const currentState = this.state.state;

    const autoRPM = currentState.powered && currentState.pedalPressed ? 750 : 0;
    const manualRPM = Math.abs(this.manualWheelVelocity) * 150;
    const target = Math.max(autoRPM, manualRPM);

    currentState.currentRPM += (target - currentState.currentRPM) * Math.min(1, delta * 4.5);
    if (currentState.currentRPM < 0.1) currentState.currentRPM = 0;

    this.manualWheelVelocity *= 0.94;
    this.state.setNeedleOffset(Math.sin(time * (currentState.currentRPM / 60) * Math.PI * 2) * 0.45);
    this.state.updateCurrentRPM(currentState.currentRPM);

    const rpm = currentState.currentRPM;
    const wheelDelta = (rpm / 60) * Math.PI * 2 * delta;

    this.wheelPivot.rotation.y += wheelDelta;
    this.needleBar.position.y = this.baseNeedleY + currentState.needleOffset;

    const bob = 1 + Math.sin(time * 8) * 0.02 * (rpm > 0 ? 1 : 0);
    this.presserFoot.scale.y = bob;

    const tensionPull = (currentState.tension - 4) * 0.015;
    this.fabricBed.position.y = -1.05 - tensionPull;

    const stitchGlow = rpm > 0 ? 1 : 0;
    this.fabricBed.material.emissive = new THREE.Color(0x112222);
    this.fabricBed.material.emissiveIntensity = stitchGlow * 0.2;
  }
}
