import { MachineState } from './core/State.js';
import { SimulationEngine } from './core/Engine.js';
import { Singer3337 } from './machines/Singer3337.js';

// Initialize Core Application Execution Blocks
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Fire up WebGL graphics thread
    const engine = new SimulationEngine('canvas-container');

    // 2. Load custom mechanical assets
    const machineInstance = new Singer3337(engine);

    // 3. Link machine kinetic animations into engine loop processing
    engine.registerUpdateCallback((time, delta) => {
        machineInstance.updateKinematics(time, delta);
    });

    // 4. Mount Event Handlers for UI Elements
    const powerButton = document.getElementById('btn-power');
    const pedalButton = document.getElementById('btn-pedal');
    const powerStatusTxt = document.getElementById('status-power');

    powerButton.addEventListener('click', () => {
        const currentPowerState = MachineState.togglePower();
        powerStatusTxt.innerText = currentPowerState ? "ON" : "OFF";
        powerStatusTxt.style.color = currentPowerState ? "#00ffcc" : "#ff3333";
    });

    pedalButton.addEventListener('click', () => {
        MachineState.adjustPedal();
    });

    // 5. Run Graphics Loop
    engine.start();
});
