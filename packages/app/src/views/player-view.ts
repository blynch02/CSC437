import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { View } from '@calpoly/mustang';
import { Player } from 'server/models';
import { Msg } from '../messages';
import { Model } from '../model';

// Demo player data for fallback when API is unavailable
const DEMO_PLAYERS: Record<string, Player> = {
  'Joe Montana': {
    sectionTitle: "Player Information",
    iconRef: "icon-team-info",
    fullName: "Joe Montana",
    position: "Quarterback",
    yearsActive: "1979-1994",
    teams: "San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",
    jerseyNumber: "#16 (49ers), #19 (Chiefs)",
    hofInductionYear: "2000",
    nicknames: "'Joe Cool', 'The Comeback Kid'"
  },
  'Joe-Montana': {
    sectionTitle: "Player Information", 
    iconRef: "icon-team-info",
    fullName: "Joe Montana",
    position: "Quarterback",
    yearsActive: "1979-1994",
    teams: "San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",
    jerseyNumber: "#16 (49ers), #19 (Chiefs)",
    hofInductionYear: "2000",
    nicknames: "'Joe Cool', 'The Comeback Kid'"
  },
  'Jerry Rice': {
    sectionTitle: "Player Information",
    iconRef: "icon-team-info",
    fullName: "Jerry Rice",
    position: "Wide Receiver",
    yearsActive: "1985-2004",
    teams: "San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",
    jerseyNumber: "#80",
    hofInductionYear: "2010",
    nicknames: "'Flash 80', 'World'"
  },
  'Jerry-Rice': {
    sectionTitle: "Player Information",
    iconRef: "icon-team-info", 
    fullName: "Jerry Rice",
    position: "Wide Receiver",
    yearsActive: "1985-2004",
    teams: "San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",
    jerseyNumber: "#80",
    hofInductionYear: "2010",
    nicknames: "'Flash 80', 'World'"
  }
};

export class PlayerViewElement extends View<Model, Msg> {
  @property({ attribute: 'player-name' })
  playerName?: string;

  @state()
  get player(): Player | undefined {
    return this.model.player;
  }

  @state()
  get loading(): boolean {
    return this.model.loading || false;
  }

  constructor() {
    super("nfl-dynasty:model");
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "player-name" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "player/select",
        { fullName: newValue }
      ]);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.playerName) {
      this.dispatchMessage([
        "player/select",
        { fullName: this.playerName }
      ]);
    }
  }

  private get fallbackPlayer(): Player | undefined {
    return this.playerName ? DEMO_PLAYERS[this.playerName] : undefined;
  }

  private get displayPlayer(): Player | undefined {
    return this.player || this.fallbackPlayer;
  }

  private get usingFallback(): boolean {
    return !this.player && !!this.fallbackPlayer;
  }

  private get availablePlayerNavigation(): Array<{name: string, displayName: string}> {
    // Available players for navigation
    const allPlayers = [
      { name: 'Joe-Montana', displayName: 'Joe Montana' },
      { name: 'Jerry-Rice', displayName: 'Jerry Rice' },
      { name: 'Joseph Clifford Montana Jr.', displayName: 'Joe Montana (Full)' }
    ];

    // Filter out the current player and return up to 2 others
    return allPlayers
      .filter(player => player.name !== this.playerName)
      .slice(0, 2);
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .player-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .loading, .error {
      text-align: center;
      padding: var(--size-spacing-xlarge, 3rem);
    }

    .loading {
      color: var(--color-text-secondary, #666);
    }

    .error {
      color: var(--color-error, #dc3545);
      background-color: var(--color-background-error, #f8d7da);
      border: 1px solid var(--color-border-error, #f5c6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-large, 1.5rem);
    }

    .demo-notice {
      background-color: var(--color-background-info, #d1ecf1);
      border: 1px solid var(--color-border-info, #bee5eb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-info, #0c5460);
      text-align: center;
    }

    .api-notice {
      background-color: var(--color-background-success, #d4edda);
      border: 1px solid var(--color-border-success, #c3e6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-success, #155724);
      text-align: center;
    }

    .player-header {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      margin-bottom: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .player-header h1 {
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      color: var(--color-text-primary, #333);
      font-size: 2rem;
    }

    .player-subtitle {
      color: var(--color-text-secondary, #666);
      font-size: 1.1rem;
      margin: 0;
    }

    .player-info {
      background-color: white;
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      padding: var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      margin: 0;
      font-size: 1.2rem;
    }

    .icon {
      width: 1.5em;
      height: 1.5em;
      margin-right: var(--size-spacing-medium, 1rem);
      fill: currentColor;
    }

    .player-details {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 2rem);
      padding: var(--size-spacing-xlarge, 2rem);
    }

    .detail-label {
      font-weight: 600;
      color: var(--color-text-primary, #333);
      text-align: right;
    }

    .detail-value {
      color: var(--color-text-secondary, #555);
      margin: 0;
    }

    .navigation {
      margin-top: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .nav-button {
      display: inline-block;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-background-secondary, #6c757d);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      margin: 0 var(--size-spacing-small, 0.5rem);
      transition: background-color 0.2s ease;
    }

    .nav-button:hover {
      background-color: var(--color-background-secondary-dark, #545b62);
    }

    .auth-message {
      text-align: center;
      padding: var(--size-spacing-xlarge, 2rem);
      background-color: var(--color-background-warning, #fff3cd);
      border: 1px solid var(--color-border-warning, #ffeaa7);
      border-radius: var(--border-radius, 0.25rem);
      color: var(--color-text-warning, #856404);
    }

    .auth-message a {
      color: var(--color-link, #007bff);
      text-decoration: none;
    }

    .auth-message a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    if (this.loading) {
      return html`
        <div class="player-container">
          <div class="loading">
            <h2>Loading player data...</h2>
            <p>Fetching information for ${this.playerName}</p>
          </div>
        </div>
      `;
    }

    const currentPlayer = this.displayPlayer;
    if (!currentPlayer) {
      return html`
        <div class="player-container">
          <div class="error">
            <h2>Player Not Found</h2>
            <p>No player information available for "${this.playerName}".</p>
          </div>
          <div class="navigation">
            <a href="/app" class="nav-button">← Back to Home</a>
          </div>
        </div>
      `;
    }

    return html`
      <div class="player-container">
        ${this.usingFallback ? html`
          <div class="demo-notice">
            📝 <strong>Demo Mode:</strong> Showing sample data. Sign in to access live data.
          </div>
        ` : html`
          <div class="api-notice">
            <strong>Live Data:</strong> Loaded from MongoDB database via API.
          </div>
        `}

        <div class="player-header">
          <h1>${currentPlayer.fullName}</h1>
          <p class="player-subtitle">${currentPlayer.position} | ${currentPlayer.teams}</p>
        </div>

        <div class="player-info">
          <h2 class="section-header">
            <svg class="icon" aria-hidden="true">
              <use href="/icons/sections.svg#${currentPlayer.iconRef || 'icon-team-info'}"></use>
            </svg>
            ${currentPlayer.sectionTitle || 'Player Information'}
          </h2>
          
          <div class="player-details">
            <div class="detail-label">Full Name:</div>
            <div class="detail-value">${currentPlayer.fullName}</div>
            
            <div class="detail-label">Position:</div>
            <div class="detail-value">${currentPlayer.position}</div>
            
            <div class="detail-label">Years Active:</div>
            <div class="detail-value">${currentPlayer.yearsActive}</div>
            
            <div class="detail-label">Teams:</div>
            <div class="detail-value">${currentPlayer.teams}</div>
            
            <div class="detail-label">Jersey Number:</div>
            <div class="detail-value">${currentPlayer.jerseyNumber}</div>
            
            <div class="detail-label">Hall of Fame:</div>
            <div class="detail-value">${currentPlayer.hofInductionYear}</div>
            
            ${currentPlayer.nicknames ? html`
              <div class="detail-label">Nicknames:</div>
              <div class="detail-value">${currentPlayer.nicknames}</div>
            ` : ''}
          </div>
        </div>

        <div class="navigation">
          <a href="/app" class="nav-button">← Back to Home</a>
          <a href="/app/player/${this.playerName}/edit" class="nav-button">Edit Player</a>
          ${this.availablePlayerNavigation.map(player => html`
            <a href="/app/player/${player.name}" class="nav-button">${player.displayName}</a>
          `)}
          <a href="/app/profile" class="nav-button">Profile</a>
        </div>
      </div>
    `;
  }
} 