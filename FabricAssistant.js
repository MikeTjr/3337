/**
 * Fabric Cutting & Spatial Calibration Assistant
 * Generates a high-precision, screen-calibrated vector grid to assist in straight-line fabric cutting.
 */
export class FabricAssistant {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.gridElement = null;
        this.pixelsPerInch = 96; // Standard baseline baseline DPI
    }

    renderVirtualMat() {
        // Clear canvas container to display the high-contrast grid system
        this.container.innerHTML = '';
        
        const mat = document.createElement('div');
        mat.id = 'virtual-cutting-mat';
        mat.style.width = '100vw';
        mat.style.height = '100vh';
        mat.style.position = 'absolute';
        mat.style.top = '0';
        mat.style.left = '0';
        mat.style.zIndex = '5';
        
        // Complex CSS math to generate a clean, recurring 1-inch and 1/4-inch grid matrix
        mat.style.backgroundColor = '#0b291b'; // Classic self-healing mat green
        mat.style.backgroundImage = `
            linear-gradient(rgba(0, 255, 204, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 204, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `;
        
        // Dynamically map grid sizing to physical inch metrics based on screen calibration
        this.updateGridScale(mat);

        this.container.appendChild(mat);
        this.renderCalibrationUI();
    }

    updateGridScale(element) {
        const ppi = this.pixelsPerInch;
        const quarterInch = ppi / 4;
        
        element.style.backgroundSize = `
            ${ppi}px ${ppi}px, 
            ${ppi}px ${ppi}px, 
            ${quarterInch}px ${quarterInch}px, 
            ${quarterInch}px ${quarterInch}px
        `;
    }

    renderCalibrationUI() {
        const ui = document.createElement('div');
        ui.style.position = 'absolute';
        ui.style.bottom = '30px';
        ui.style.left = '30px';
        ui.style.zIndex = '20';
        ui.style.background = 'rgba(10, 10, 10, 0.9)';
        ui.style.padding = '15px';
        ui.style.borderRadius = '6px';
        ui.style.border = '1px solid #00ffcc';
        ui.style.fontFamily = 'monospace';

        ui.innerHTML = `
            <div style="margin-bottom: 10px; color: #00ffcc;">GRID SCREEN CALIBRATION</div>
            <div style="font-size: 0.8rem; margin-bottom: 10px; color: #aaa;">Hold a physical ruler to the screen.<br>Adjust buttons until 1 grid square matches 1 inch exactly.</div>
            <button id="grid-plus" style="padding: 5px 10px; font-weight:bold;">+</button>
            <button id="grid-minus" style="padding: 5px 10px; font-weight:bold;">-</button>
            <span id="current-ppi" style="margin-left: 10px; color:#fff;">${this.pixelsPerInch} PPI</span>
        `;

        document.body.appendChild(ui);

        // Event hooks to change grid sizing on the fly to fit any display or TV resolution
        document.getElementById('grid-plus').addEventListener('click', () => {
            this.pixelsPerInch += 1;
            this.updateGridScale(document.getElementById('virtual-cutting-mat'));
            document.getElementById('current-ppi').innerText = `${this.pixelsPerInch} PPI`;
        });

        document.getElementById('grid-minus').addEventListener('click', () => {
            this.pixelsPerInch -= 1;
            this.updateGridScale(document.getElementById('virtual-cutting-mat'));
            document.getElementById('current-ppi').innerText = `${this.pixelsPerInch} PPI`;
        });
    }
}
