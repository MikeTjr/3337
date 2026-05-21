/**
 * Global Simulation State Machine
 * Centralizes variables to ensure UI, physics, and mechanical modules read identical parameters.
 */
export const MachineState = {
    isPowered: false,
    isSewing: false,
    needleRPM: 0,
    targetRPM: 0,
    stitchType: 'Straight',
    tensionSetting: 4,
    needleYOffset: 0,

    // UI Mutation Handlers
    togglePower() {
        this.isPowered = !this.isPowered;
        if (!this.isPowered) this.targetRPM = 0;
        return this.isPowered;
    },

    adjustPedal() {
        if (!this.isPowered) return false;
        this.targetRPM = this.targetRPM === 0 ? 750 : 0;
        return true;
    }
};
