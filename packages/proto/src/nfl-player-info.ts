import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import resetCss from "./styles/reset.css.js"; // Import the JS version

export class NflPlayerInfoElement extends LitElement {
  @property({ attribute: 'section-title' })
  sectionTitle?: string = "Player Information"; // Default value

  @property({ attribute: 'icon-ref' })
  iconRef?: string = "icon-team-info"; // Default value

  @property({ attribute: 'full-name' })
  fullName?: string;

  @property()
  position?: string;

  @property({ attribute: 'years-active' })
  yearsActive?: string;

  @property()
  teams?: string;

  @property({ attribute: 'jersey-number' })
  jerseyNumber?: string;

  @property({ attribute: 'hof-induction-year' })
  hofInductionYear?: string;

  @property()
  nicknames?: string;

  override render() {
    return html`
      <section>
        <h2><svg class="icon" aria-hidden="true"><use href=${`/icons/sections.svg#${this.iconRef}`} /></svg>${this.sectionTitle}</h2>
        <dl>
            <dt>Full Name</dt>
            <dd>${this.fullName}</dd>
            
            <dt>Position</dt>
            <dd>${this.position}</dd>
            
            <dt>Years Active</dt>
            <dd>${this.yearsActive}</dd>
            
            <dt>Teams</dt>
            <dd>${this.teams}</dd>
            
            <dt>Jersey Number</dt>
            <dd>${this.jerseyNumber}</dd>
            
            <dt>Hall of Fame Induction</dt>
            <dd>${this.hofInductionYear}</dd>
            
            <dt>Nicknames</dt>
            <dd>${this.nicknames}</dd>
        </dl>
      </section>
    `;
  }

  static styles = [
    resetCss, // Add the imported reset styles
    css`
    /* Component-specific styles will go here */
    h2 {
      display: flex;
      align-items: center;
    }
    .icon {
      display: inline-block;
      width: 1.1em;
      height: 1.1em;
      vertical-align: -0.15em;
      fill: currentColor;
      margin-right: 0.3em;
    }
    dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-spacing-small) var(--size-spacing-large);
        margin-bottom: var(--size-spacing-large);
    }
    dd {
        margin-left: 0;
    }
  `];
} 