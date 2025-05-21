import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Observer, Auth, Events } from '@calpoly/mustang';

@customElement('app-header')
export class AppHeaderElement extends LitElement {
  @state()
  private userid?: string;

  @state()
  private loggedIn = false;

  private _authObserver = new Observer<Auth.Model>(this, "nfl-dynasty:auth");

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  renderSignInButton() {
    return html`
      <a href="/login.html" class="auth-link">Sign In</a>
    `;
  }

  renderSignOutButton() {
    return html`
      <button @click=${this._handleSignOut} class="auth-button">Sign Out</button>
    `;
  }

  _handleSignOut(e: Event) {
    Events.relay(e, "auth:message", ["auth/signout"]);
  }

  static styles = css`
    :host {
      display: flex; /* Changed from block to flex for better alignment */
      justify-content: space-between; /* Distributes space between items */
      align-items: center; /* Vertically aligns items in the center */
      padding: var(--size-spacing-large, 1rem);
      background-color: var(--color-background-header, #333);
      color: var(--color-text-light, white);
    }
    .header-content {
        flex-grow: 1; /* Allows this section to take up available space */
    }
    .title {
        margin: 0;
        font-size: 1.5em; /* Example size */
    }
    .subtitle {
        margin: 0;
        font-size: 0.9em; /* Example size */
        font-weight: normal;
    }
    .auth-controls {
        display: flex;
        align-items: center;
        gap: var(--size-spacing-medium, 0.5rem); /* Adds space between auth items if needed */
    }
    .auth-link, .auth-button {
      color: var(--color-link-inverted, yellow); /* Use inverted link color from tokens */
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 1em;
      text-decoration: none;
      padding: var(--size-spacing-small) var(--size-spacing-medium);
    }
    .auth-button {
        border: 1px solid var(--color-link-inverted, yellow);
        border-radius: var(--border-radius, 0.25rem);
    }
    .auth-button:hover {
        background-color: rgba(255,255,255,0.1);
    }
    .user-greeting {
        margin-right: var(--size-spacing-medium, 0.5rem);
    }
    /* Dark mode toggle styles (if it's part of this header) */
    .dark-mode-toggle label {
        display: flex;
        align-items: center;
        gap: var(--size-spacing-small, 0.25rem);
    }
  `;

  override render() {
    return html`
      <div class="header-content">
        <h1 class="title">NFL Dynasty Tracker</h1>
        <p class="subtitle">Explore the greatest dynasties in NFL history</p>
      </div>
      <div class="auth-controls">
        ${this.loggedIn
          ? html`
              <span class="user-greeting">Hello, ${this.userid}</span>
              <a href="/profile.html" class="auth-link">Profile</a>
              ${this.renderSignOutButton()}
            `
          : this.renderSignInButton()}
      </div>
      <!-- Dark mode toggle can be part of this component or separate -->
      <!-- If it's here, you'd include its HTML and any related logic -->
      <!-- For now, assuming dark mode toggle is handled as it was in index.html -->
    `;
  }
}
