import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  formData: LoginFormData = {};

  @property({ type: String })
  api?: string;

  @property({ type: String })
  redirect: string = "/"; // Default redirect path

  @state()
  error?: string;

  get canSubmit(): boolean {
    return !!(this.api && this.formData.username && this.formData.password);
  }

  override render() {
    return html`
      <form
        @change=${(e: Event) => this.handleChange(e as InputEvent)}
        @submit=${(e: Event) => this.handleSubmit(e as SubmitEvent)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>
            Login
          </button>
        </slot>
        ${this.error ? html`<p class="error">${this.error}</p>` : ""}
      </form>
    `;
  }

  handleChange(event: InputEvent) {
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

  async handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (!this.canSubmit || !this.api) {
      return;
    }

    this.error = undefined; // Clear previous errors

    try {
      const response = await fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.formData)
      });

      const responseBody = await response.json();

      if (!response.ok) { // Check for non-2xx status codes
        throw new Error(responseBody.error || `Login failed: ${response.statusText} (Status ${response.status})`);
      }
      
      const { token } = responseBody as { token: string };
      if (token) {
        // Check for redirect_uri in query params
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUri = urlParams.get('redirect_uri');

        const customEvent = new CustomEvent(
          'auth:message', {
          bubbles: true,
          composed: true,
          detail: [
            'auth/signin',
            { token, redirect: redirectUri || this.redirect } // Use redirectUri if present
          ]
        });
        this.dispatchEvent(customEvent);
      } else {
        throw new Error("Login successful, but no token received.");
      }

    } catch (err: any) {
      console.error("Login form error:", err);
      this.error = err.message || "An unexpected error occurred during login.";
    }
  }

  static styles = [
    css`
      :host {
        display: block;
      }
      .error {
        color: var(--color-error, red);
        border: 1px solid var(--color-error, red);
        padding: var(--size-spacing-medium, 0.5rem);
        margin-top: var(--size-spacing-medium, 0.5rem);
        border-radius: var(--border-radius, 0.25rem);
      }
      button[type="submit"] {
        /* Styles are in login.html, but you can add/override here if needed */
      }
    `
  ];
} 