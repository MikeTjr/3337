import { MachineStateStore } from './core/State.js';
import { SimulationEngine } from './core/Engine.js';
import { Singer3337 } from './machines/Singer3337.js';
import { FabricAssistant } from './tools/FabricAssistant.js';
import { InteractionController } from './ui/InteractionController.js';

document.addEventListener('DOMContentLoaded', () => {
  const state = new MachineStateStore();
  const engine = new SimulationEngine('canvas-container');
  const machine = new Singer3337(engine, state);
  const fabricAssistant = new FabricAssistant();
  fabricAssistant.mount(document.getElementById('app-shell') || document.body);
  const interactions = new InteractionController(engine, machine);

  engine.registerUpdateCallback((time, delta) => {
    machine.update(time, delta);
  });

  const powerButton = document.getElementById('btn-power');
  const pedalButton = document.getElementById('btn-pedal');
  const fabricButton = document.getElementById('btn-fabric');
  const powerStatus = document.getElementById('status-power');
  const rpmStatus = document.getElementById('status-rpm');
  const stitchStatus = document.getElementById('status-stitch');
  const tensionValue = document.getElementById('tension-value');
  const stitchSelect = document.getElementById('stitch-select');
  const tensionRange = document.getElementById('tension-range');

  const syncUI = (snapshot) => {
    if (powerButton) powerButton.textContent = `POWER: ${snapshot.powered ? 'ON' : 'OFF'}`;
    if (pedalButton) pedalButton.textContent = `PEDAL: ${snapshot.pedalPressed ? 'DEPRESSED' : 'RELEASED'}`;
    if (fabricButton) fabricButton.textContent = `FABRIC GUIDE: ${snapshot.fabricGuideVisible ? 'ON' : 'OFF'}`;
    if (powerStatus) {
      powerStatus.textContent = snapshot.powered ? 'ON' : 'OFF';
      powerStatus.style.color = snapshot.powered ? '#00ffcc' : '#ff5555';
    }
    if (rpmStatus) rpmStatus.textContent = `${Math.round(snapshot.currentRPM)} RPM`;
    if (stitchStatus) stitchStatus.textContent = snapshot.stitchType;
    if (tensionValue) tensionValue.textContent = String(snapshot.tension);
    fabricAssistant.setVisible(snapshot.fabricGuideVisible);
  };

  state.subscribe(syncUI);

  powerButton?.addEventListener('click', () => state.togglePower());
  pedalButton?.addEventListener('pointerdown', () => state.setPedal(true));
  pedalButton?.addEventListener('pointerup', () => state.setPedal(false));
  pedalButton?.addEventListener('pointerleave', () => state.setPedal(false));
  pedalButton?.addEventListener('pointercancel', () => state.setPedal(false));
  fabricButton?.addEventListener('click', () => {
    state.setFabricGuideVisible(!state.state.fabricGuideVisible);
  });

  stitchSelect?.addEventListener('change', (event) => {
    state.setStitchType(event.target.value);
  });

  tensionRange?.addEventListener('input', (event) => {
    state.setTension(event.target.value);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      state.setPedal(true);
    }
    if (event.key.toLowerCase() === 'p') {
      state.togglePower();
    }
    if (event.key.toLowerCase() === 'g') {
      state.setFabricGuideVisible(!state.state.fabricGuideVisible);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      state.setPedal(false);
    }
  });

  engine.start();

  // Keep references alive for debugging and future module expansion.
  window.__sewingSim = { state, engine, machine, interactions, fabricAssistant };
});
