import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

// Define the interface for the player data structure
interface PlayerData {
  sectionTitle?: string;
  iconRef?: string;
  fullName?: string;
  position?: string;
  yearsActive?: string;
  teams?: string;
  jerseyNumber?: string;
  hofInductionYear?: string;
  nicknames?: string;
}

export class NflPlayerLoaderElement extends LitElement {
  @property({ type: String })
  src?: string;

  @state()
  private _playerData?: PlayerData;

  @state()
  private _error?: string;

  async connectedCallback() {
    super.connectedCallback();
    if (this.src) {
      await this._loadData(this.src);
    }
  }

  private async _loadData(src: string) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch player data: ${response.status} ${response.statusText}`);
      }
      this._playerData = await response.json() as PlayerData;
      this._error = undefined; // Clear any previous error
    } catch (e) {
      this._error = (e instanceof Error) ? e.message : String(e);
      console.error("Error loading player data:", e);
      this._playerData = undefined; // Clear data on error
    }
  }

  override render() {
    if (this._error) {
      return html`<p class="error-message">Error loading player data: ${this._error}</p>`;
    }

    if (!this._playerData) {
      return html`<p>Loading player data...</p>`;
    }

    // Ensure NflPlayerInfoElement is defined if not already globally
    // This is usually handled by importing and defining it in the main HTML consuming this loader.
    // If NflPlayerInfoElement is not defined, this will render an unknown element.
    if (!customElements.get('nfl-player-info')) {
        console.warn("nfl-player-info component not defined. Make sure it's imported and defined in the consuming HTML.");
        // Optionally, you could define it here if it's a strict dependency and not expected to be pre-defined.
        // customElements.define('nfl-player-info', NflPlayerInfoElement);
    }

    return html`
      <nfl-player-info
        section-title=${this._playerData.sectionTitle ?? ''}
        icon-ref=${this._playerData.iconRef ?? ''}
        full-name=${this._playerData.fullName ?? ''}
        position=${this._playerData.position ?? ''}
        years-active=${this._playerData.yearsActive ?? ''}
        teams=${this._playerData.teams ?? ''}
        jersey-number=${this._playerData.jerseyNumber ?? ''}
        hof-induction-year=${this._playerData.hofInductionYear ?? ''}
        nicknames=${this._playerData.nicknames ?? ''}
      ></nfl-player-info>
    `;
  }

  static styles = css`
    .error-message {
      color: var(--color-primary, red); /* Use theme color or fallback */
      border: 1px solid var(--color-primary, red);
      padding: var(--size-spacing-medium, 0.5rem);
      margin-bottom: var(--size-spacing-medium, 0.5rem);
    }
  `;
} 