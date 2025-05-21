import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Observer, Auth } from '@calpoly/mustang';

@customElement('profile-view')
export class ProfileViewElement extends LitElement {
  @state()
  private userid?: string;

  private _authObserver = new Observer<Auth.Model>(this, "nfl-dynasty:auth");

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      console.log("[profile-view] Auth state received:", user);
      if (user && user.authenticated) {
        this.userid = user.username;
      } else {
        this.userid = undefined;
        const currentPath = window.location.pathname + window.location.search + window.location.hash;
        if (window.location.pathname !== '/login.html') {
            window.location.href = `/login.html?redirect_uri=${encodeURIComponent(currentPath)}`;
        }
      }
    });
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-medium, 1em);
    }
    .profile-info {
      background-color: var(--color-background-secondary, #f0f0f0);
      padding: var(--size-spacing-large, 1.5em);
      border-radius: var(--border-radius, 0.25rem);
      box-shadow: var(--shadow-dp2, 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12));
    }
    .profile-info h2 {
        margin-top: 0;
        color: var(--color-text-primary, #333);
    }
    .profile-info p {
        color: var(--color-text-secondary, #555);
    }
  `;

  render() {
    if (!this.userid) {
      return html`<p>Loading user information...</p>`;
    }
    return html`
      <section class="profile-info">
        <h2>Welcome, ${this.userid}!</h2>
        <p>This is your profile page. More features will be added soon.</p>
        <!-- You can add more user-specific details here -->
      </section>
    `;
  }
} 