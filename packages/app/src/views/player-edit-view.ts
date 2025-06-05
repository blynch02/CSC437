import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { View, Form, define, History } from '@calpoly/mustang';
import { Player } from 'server/models';
import { Msg } from '../messages';
import { Model } from '../model';

export class PlayerEditViewElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property({ attribute: 'player-name' })
  playerName?: string;

  @state()
  get player(): Player | undefined {
    return this.model.player;
  }

  constructor() {
    super("nfl-dynasty:model");
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.playerName && !this.player) {
      this.dispatchMessage([
        "player/select",
        { fullName: this.playerName }
      ]);
    }
  }

  handleSubmit(event: Form.SubmitEvent<Player>) {
    this.dispatchMessage([
      "player/save",
      {
        fullName: this.playerName!,
        player: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/player/${this.playerName}`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .edit-container {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-large, 2rem);
    }

    mu-form {
      background: white;
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    label {
      display: block;
      margin-bottom: var(--size-spacing-large, 1.5rem);
    }

    label span {
      display: block;
      font-weight: 600;
      margin-bottom: var(--size-spacing-small, 0.5rem);
      color: var(--color-text-primary, #333);
    }

    input {
      width: 100%;
      padding: var(--size-spacing-medium, 1rem);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
    }

    .form-buttons {
      display: flex;
      gap: var(--size-spacing-medium, 1rem);
      margin-top: var(--size-spacing-large, 2rem);
      align-items: center;
      clear: both;
    }

    .submit-btn, .cancel-btn {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      border: none;
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      display: inline-block;
      min-width: 120px;
    }

    .submit-btn {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .cancel-btn {
      background-color: var(--color-background-secondary, #6c757d);
      color: white;
    }

    /* Style the mu-form's built-in submit button */
    mu-form button[type="submit"] {
      background-color: #dc3545 !important;
      color: white !important;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem) !important;
      border: none !important;
      border-radius: var(--border-radius, 0.25rem) !important;
      font-size: 1rem !important;
      cursor: pointer !important;
      display: inline-block !important;
      float: left !important;
      min-width: 120px !important;
    }

    mu-form button[type="submit"]:hover {
      background-color: #c82333 !important;
    }

    /* Ensure form buttons container displays properly */
    mu-form .form-buttons {
      display: inline-block !important;
      margin-left: var(--size-spacing-medium, 1rem) !important;
      float: left !important;
    }

    /* Clear floats after buttons */
    mu-form::after {
      content: "";
      display: table;
      clear: both;
    }
  `;

  render() {
    return html`
      <div class="edit-container">
        <h1>Edit Player: ${this.player?.fullName || this.playerName}</h1>
        
        <mu-form
          .init=${this.player}
          @mu-form:submit=${this.handleSubmit}>
          
          <label>
            <span>Full Name:</span>
            <input name="fullName" .value=${this.player?.fullName || ''}>
          </label>
          
          <label>
            <span>Position:</span>
            <input name="position" .value=${this.player?.position || ''}>
          </label>
          
          <label>
            <span>Years Active:</span>
            <input name="yearsActive" .value=${this.player?.yearsActive || ''}>
          </label>
          
          <label>
            <span>Teams:</span>
            <input name="teams" .value=${this.player?.teams || ''}>
          </label>
          
          <label>
            <span>Jersey Number:</span>
            <input name="jerseyNumber" .value=${this.player?.jerseyNumber || ''}>
          </label>
          
          <label>
            <span>Hall of Fame Year:</span>
            <input name="hofInductionYear" .value=${this.player?.hofInductionYear || ''}>
          </label>
          
          <label>
            <span>Nicknames:</span>
            <input name="nicknames" .value=${this.player?.nicknames || ''}>
          </label>

          <div class="form-buttons">
            <a href="/app/player/${this.playerName}" class="cancel-btn">Cancel</a>
          </div>

        </mu-form>
      </div>
    `;
  }
} 