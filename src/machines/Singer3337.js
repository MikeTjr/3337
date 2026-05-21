import { MachineState } from '../core/State.js';

/**
 * Structural Component Blueprint for the Singer 3337
 * Manages unique 3D assemblies and kinematic math transformations.
 */
export class Singer3337 {
    constructor(engine) {
        this.engine = engine;
        this.chassis = null;
        this.handwheel = null;
        this.needleBar = null;
        
        this.buildMachineGeometry();
    }

    buildMachineGeometry() {
        // Architectural Chassis Form Factor
        const bodyGeo = new THREE.BoxGeometry(6, 4, 2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.2 });
        this.chassis = new THREE.Mesh(bodyGeo, bodyMat);
        this.engine.add(this.chassis);

        // Heavy Balance Handwheel Mechanism
        const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
        this.handwheel = new THREE.Mesh(wheelGeo, wheelMat);
        this.handwheel.position.set(3.2, 1, 0);
        this.handwheel.rotation.z = Math.PI / 2;
        this.engine.add(this.handwheel);

        // Reciprocating Needle Assembly
        const needleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 16);
        const needleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.05 });
        this.needleBar = new THREE.Mesh(needleGeo, needleMat);
        this.needleBar.position.set(-2, 0, 0.8);
        this.engine.add(this.needleBar);
    }

    updateKinematics(currentTime, deltaTime) {
        // Interpolate rotational inertia speeds smoothly
        MachineState.needleRPM += (MachineState.targetRPM - MachineState.needleRPM) * 0.1;
        document.getElementById('status-rpm').innerText = `${Math.round(MachineState.needleRPM)} RPM`;

        if (MachineState.needleRPM > 0.5) {
            // Convert RPM metrics directly to rotational radian steps
            const radianStep = (MachineState.needleRPM / 60) * (Math.PI * 2) * deltaTime;
            this.handwheel.rotation.y += radianStep;

            // Simple harmonic motion tracking vertical needle translation down the stroke column
            MachineState.needleYOffset = Math.sin(currentTime * (MachineState.needleRPM / 60000) * Math.PI * 2) * 0.5;
            this.needleBar.position.y = MachineState.needleYOffset;
        }
    }
}
