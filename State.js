export class MachineStateStore {
  constructor() {
    this.state = {
      powered: false,
      pedalPressed: false,
      manualRPM: 0,
      targetRPM: 0,
      currentRPM: 0,
      stitchType: 'Straight',
      tension: 4,
      fabricGuideVisible: true,
      needleOffset: 0,
    };

    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot() {
    return { ...this.state };
  }

  emit() {
    const snapshot = this.snapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
    return snapshot;
  }

  setPower(powered) {
    this.state.powered = Boolean(powered);
    if (!this.state.powered) {
      this.state.pedalPressed = false;
      this.state.targetRPM = 0;
    }
    return this.emit();
  }

  togglePower() {
    return this.setPower(!this.state.powered);
  }

  setPedal(pressed) {
    this.state.pedalPressed = Boolean(pressed) && this.state.powered;
    this.state.targetRPM = this.state.pedalPressed ? 750 : 0;
    return this.emit();
  }

  togglePedal() {
    return this.setPedal(!this.state.pedalPressed);
  }

  setStitchType(stitchType) {
    this.state.stitchType = stitchType;
    return this.emit();
  }

  setTension(value) {
    const tension = Math.min(9, Math.max(1, Number(value) || 4));
    this.state.tension = tension;
    return this.emit();
  }

  setFabricGuideVisible(visible) {
    this.state.fabricGuideVisible = Boolean(visible);
    return this.emit();
  }

  addManualRPM(amount) {
    this.state.manualRPM = Math.max(0, Math.min(1200, this.state.manualRPM + amount));
    return this.emit();
  }

  decayManualRPM(factor = 0.94) {
    this.state.manualRPM *= factor;
    if (this.state.manualRPM < 0.25) {
      this.state.manualRPM = 0;
    }
  }

  updateCurrentRPM(value) {
    this.state.currentRPM = Math.max(0, value);
    return this.emit();
  }

  setNeedleOffset(value) {
    this.state.needleOffset = value;
  }
}
