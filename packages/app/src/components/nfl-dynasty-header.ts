import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Observer, Auth, Events } from '@calpoly/mustang';

@customElement('nfl-dynasty-header')
export class NflDynastyHeaderElement extends LitElement {
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
      <a href="/app/login" class="auth-link">Sign In</a>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--size-spacing-large, 1rem);
      background-color: var(--color-background-header, #333);
      color: var(--color-text-light, white);
    }
    .header-content {
      flex-grow: 1;
    }
    .header-content a {
      color: inherit;
      text-decoration: none;
    }
    .header-content a:hover {
      opacity: 0.8;
    }
    .title {
      margin: 0;
      font-size: 1.5em;
    }
    .subtitle {
      margin: 0;
      font-size: 0.9em;
      font-weight: normal;
    }
    .auth-controls {
      display: flex;
      align-items: center;
      gap: var(--size-spacing-medium, 0.5rem);
    }
    .auth-link, .auth-button {
      color: var(--color-link-inverted, yellow);
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
  `;

  override render() {
    return html`
      <div class="header-content">
        <a href="/app">
          <h1 class="title">NFL Dynasty Tracker</h1>
          <p class="subtitle">Explore the greatest dynasties in NFL history</p>
        </a>
      </div>
      <div class="auth-controls">
        ${this.loggedIn
          ? html`
              <span class="user-greeting">Hello, ${this.userid}</span>
              <a href="/app/profile" class="auth-link">Profile</a>
              ${this.renderSignOutButton()}
            `
          : this.renderSignInButton()}
      </div>
    `;
  }
} 