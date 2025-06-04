import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface LoginFormData {
  username?: string;
  password?: string;
}

@customElement('login-view')
export class LoginViewElement extends LitElement {
  @state()
  private formData: LoginFormData = {};

  @state()
  private error?: string;

  @state()
  private loading = false;

  get canSubmit(): boolean {
    return !!(this.formData.username && this.formData.password);
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding-top: var(--size-spacing-xlarge, 3rem);
    }

    .login-card {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--size-spacing-large, 2rem);
    }

    .login-header h1 {
      color: var(--color-text-primary, #333);
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      font-size: 1.8rem;
    }

    .login-header p {
      color: var(--color-text-secondary, #666);
      margin: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--size-spacing-large, 1.5rem);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: var(--size-spacing-small, 0.5rem);
    }

    .label-text {
      font-weight: 600;
      color: var(--color-text-primary, #333);
    }

    input {
      padding: var(--size-spacing-medium, 1rem);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: var(--color-primary, #007bff);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .submit-button {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      border: none;
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .submit-button:hover:not(:disabled) {
      background-color: var(--color-primary-dark, #0056b3);
    }

    .submit-button:disabled {
      background-color: var(--color-background-secondary, #6c757d);
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, #dc3545);
      background-color: var(--color-background-error, #f8d7da);
      border: 1px solid var(--color-border-error, #f5c6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .loading {
      color: var(--color-text-secondary, #666);
      text-align: center;
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .navigation {
      margin-top: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .nav-link {
      color: var(--color-link, #007bff);
      text-decoration: none;
      font-weight: 500;
    }

    .nav-link:hover {
      text-decoration: underline;
    }

    .demo-notice {
      background-color: var(--color-background-info, #d1ecf1);
      border: 1px solid var(--color-border-info, #bee5eb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-info, #0c5460);
      text-align: center;
      font-size: 0.9rem;
    }
  `;

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;

    if (name && value !== undefined) {
      this.formData = {
        ...this.formData,
        [name]: value
      };
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.canSubmit) {
      return;
    }

    this.loading = true;
    this.error = undefined;

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error || `Login failed: ${response.statusText} (Status ${response.status})`);
      }

      const { token } = responseBody as { token: string };
      if (token) {
        // Store token for mustang auth and our components
        localStorage.setItem('token', token);
        localStorage.setItem('auth:token', token);
        
        // Check for redirect_uri in query params
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUri = urlParams.get('redirect_uri') || '/app';

        // Dispatch auth event
        const authEvent = new CustomEvent('auth:message', {
          bubbles: true,
          composed: true,
          detail: ['auth/signin', { token, redirect: redirectUri }]
        });
        this.dispatchEvent(authEvent);

        // Navigate to redirect URI
        window.history.pushState(null, '', redirectUri);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        throw new Error('Login successful, but no token received.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      this.error = err.message || 'An unexpected error occurred during login.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="login-container">
        <div class="demo-notice">
          💡 <strong>Demo Credentials:</strong> Try username: <code>testuser2</code> with any password, or create a new account.
        </div>

        <div class="login-card">
          <div class="login-header">
            <h1>User Login</h1>
            <p>Sign in to access player data and your profile</p>
          </div>

          <form @submit=${this.handleSubmit} @input=${this.handleChange}>
            <label>
              <span class="label-text">Username:</span>
              <input 
                name="username" 
                type="text"
                autocomplete="username"
                placeholder="Enter your username"
                .value=${this.formData.username || ''}
                required
              />
            </label>

            <label>
              <span class="label-text">Password:</span>
              <input 
                name="password" 
                type="password"
                autocomplete="current-password"
                placeholder="Enter your password"
                .value=${this.formData.password || ''}
                required
              />
            </label>

            <button 
              type="submit" 
              class="submit-button"
              ?disabled=${!this.canSubmit || this.loading}
            >
              ${this.loading ? 'Signing in...' : 'Sign In'}
            </button>

            ${this.loading ? html`<div class="loading">Authenticating...</div>` : ''}
            ${this.error ? html`<div class="error">${this.error}</div>` : ''}
          </form>

          <div class="navigation">
            <a href="/app" class="nav-link">← Back to Home</a>
          </div>
        </div>
      </div>
    `;
  }
} 