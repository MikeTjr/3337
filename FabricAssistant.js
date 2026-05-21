export class FabricAssistant {
  constructor() {
    this.overlay = null;
    this.grid = null;
    this.panel = null;
    this.isVisible = true;
    this.pixelsPerInch = 96;
  }

  mount(parent = document.body) {
    if (this.overlay) return this.overlay;

    const overlay = document.createElement('div');
    overlay.id = 'fabric-overlay';

    const grid = document.createElement('div');
    grid.className = 'fabric-grid';

    const panel = document.createElement('div');
    panel.className = 'fabric-panel';
    panel.innerHTML = `
      <div style="font-weight:700; color:#00ffcc;">FAMILY FABRIC GUIDE</div>
      <div class="meta">Calibrate this mat so 1 square lines up with your real ruler.</div>
      <div class="row">
        <button type="button" id="grid-minus">-</button>
        <button type="button" id="grid-plus">+</button>
        <button type="button" id="grid-hide">HIDE</button>
      </div>
      <div class="meta">Scale: <span id="grid-ppi">96</span> PPI</div>
    `;

    overlay.appendChild(grid);
    overlay.appendChild(panel);
    parent.appendChild(overlay);

    this.overlay = overlay;
    this.grid = grid;
    this.panel = panel;

    this.applyScale();

    const minus = panel.querySelector('#grid-minus');
    const plus = panel.querySelector('#grid-plus');
    const hide = panel.querySelector('#grid-hide');
    const ppiLabel = panel.querySelector('#grid-ppi');
    this.hideButton = hide;

    minus.addEventListener('click', () => {
      this.pixelsPerInch = Math.max(48, this.pixelsPerInch - 1);
      this.applyScale();
      ppiLabel.textContent = String(this.pixelsPerInch);
    });

    plus.addEventListener('click', () => {
      this.pixelsPerInch = Math.min(240, this.pixelsPerInch + 1);
      this.applyScale();
      ppiLabel.textContent = String(this.pixelsPerInch);
    });

    hide.addEventListener('click', () => {
      this.setVisible(!this.isVisible);
      hide.textContent = this.isVisible ? 'HIDE' : 'SHOW';
    });

    return overlay;
  }

  applyScale() {
    if (!this.grid) return;
    const ppi = this.pixelsPerInch;
    const quarter = ppi / 4;
    this.grid.style.backgroundSize = `${ppi}px ${ppi}px, ${ppi}px ${ppi}px, ${quarter}px ${quarter}px, ${quarter}px ${quarter}px`;
    const label = this.panel?.querySelector('#grid-ppi');
    if (label) label.textContent = String(this.pixelsPerInch);
  }

  setVisible(visible) {
    this.isVisible = Boolean(visible);
    if (!this.overlay) return;
    this.overlay.classList.toggle('hidden', !this.isVisible);
    if (this.hideButton) {
      this.hideButton.textContent = this.isVisible ? 'HIDE' : 'SHOW';
    }
  }

  toggle() {
    this.setVisible(!this.isVisible);
  }
}
