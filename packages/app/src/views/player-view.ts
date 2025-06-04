import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Observer, Auth } from '@calpoly/mustang';
import { Player } from '../models/player';

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

@customElement('player-view')
export class PlayerViewElement extends LitElement {
  @property({ attribute: 'player-name' })
  playerName?: string;

  @state()
  private player?: Player;

  @state()
  private loading = false;

  @state()
  private error?: string;

  @state()
  private authenticated = false;

  @state()
  private usingFallback = false;

  @state()
  private authToken?: string;

  private _authObserver = new Observer<Auth.Model>(this, "nfl-dynasty:auth");

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.authenticated = true;
        // Don't try to access user.token as it may not exist
        console.log("[player-view] User authenticated, loading data");
        // Always try API first when authenticated
        if (this.playerName && !this.loading) {
          this.loadPlayerData();
        }
      } else {
        this.authenticated = false;
        this.authToken = undefined;
        console.log("[player-view] User not authenticated, trying API anyway then falling back");
        // Still try API first (might work if token in localStorage)
        if (this.playerName) {
          this.loadPlayerData();
        }
      }
    });
  }

  updated(changedProperties: Map<string, any>) {
    // If playerName changes, load new data
    if (changedProperties.has('playerName') && this.playerName) {
      // Always try API first
      this.loadPlayerData();
    }
  }

  private getAuthToken(): string {
    // Try multiple sources for the auth token
    return this.authToken || 
           localStorage.getItem('token') || 
           localStorage.getItem('auth:token') || 
           '';
  }

  async loadPlayerData() {
    if (!this.playerName) return;

    this.loading = true;
    this.error = undefined;
    this.player = undefined;
    this.usingFallback = false;

    console.log(`[player-view] Loading data for: ${this.playerName}`);

    try {
      // Always try the API first
      const token = this.getAuthToken();
      console.log(`[player-view] Using token: ${token ? 'Token available' : 'No token'}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/players/${this.playerName}`, {
        headers
      });

      console.log(`[player-view] API response status: ${response.status}`);

      if (response.ok) {
        const playerData = await response.json();
        console.log('[player-view] Successfully loaded from API:', playerData);
        this.player = playerData;
        this.usingFallback = false;
        this.error = undefined;
      } else if (response.status === 401) {
        console.log('[player-view] API requires authentication, falling back to demo data');
        this.loadFallbackData();
        return;
      } else if (response.status === 404) {
        console.log('[player-view] Player not found in API, falling back to demo data');
        this.loadFallbackData();
        return;
      } else {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      console.error('[player-view] API failed:', err);
      console.log('[player-view] Falling back to demo data');
      this.loadFallbackData();
      return;
    } finally {
      this.loading = false;
    }
  }

  loadFallbackData() {
    if (!this.playerName) return;
    
    console.log(`[player-view] Loading fallback data for: ${this.playerName}`);
    this.usingFallback = true;
    
    const demoPlayer = DEMO_PLAYERS[this.playerName];
    if (demoPlayer) {
      this.player = demoPlayer;
      this.error = undefined;
      console.log('[player-view] Successfully loaded fallback data');
    } else {
      this.error = `Player "${this.playerName}" not found in demo data.`;
      this.player = undefined;
      console.log(`[player-view] Player not found in fallback data: ${this.playerName}`);
    }
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

    if (this.error) {
      return html`
        <div class="player-container">
          <div class="error">
            <h2>Error Loading Player</h2>
            <p>${this.error}</p>
            <button @click=${this.loadPlayerData} class="nav-button">Try Again</button>
          </div>
          <div class="navigation">
            <a href="/app" class="nav-button">← Back to Home</a>
          </div>
        </div>
      `;
    }

    if (!this.player) {
      return html`
        <div class="player-container">
          <div class="error">
            <h2>No Player Data</h2>
            <p>No player information available.</p>
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
            📝 <strong>Demo Mode:</strong> Showing sample data. ${this.authenticated ? 'API not available.' : 'Sign in to access live data.'}
          </div>
        ` : html`
          <div class="api-notice">
            <strong>Live Data:</strong> Loaded from MongoDB database via API.
          </div>
        `}

        <div class="player-header">
          <h1>${this.player.fullName}</h1>
          <p class="player-subtitle">${this.player.position} | ${this.player.teams}</p>
        </div>

        <div class="player-info">
          <h2 class="section-header">
            <svg class="icon" aria-hidden="true">
              <use href="/icons/sections.svg#${this.player.iconRef || 'icon-team-info'}"></use>
            </svg>
            ${this.player.sectionTitle || 'Player Information'}
          </h2>
          
          <div class="player-details">
            <div class="detail-label">Full Name:</div>
            <div class="detail-value">${this.player.fullName}</div>
            
            <div class="detail-label">Position:</div>
            <div class="detail-value">${this.player.position}</div>
            
            <div class="detail-label">Years Active:</div>
            <div class="detail-value">${this.player.yearsActive}</div>
            
            <div class="detail-label">Teams:</div>
            <div class="detail-value">${this.player.teams}</div>
            
            <div class="detail-label">Jersey Number:</div>
            <div class="detail-value">${this.player.jerseyNumber}</div>
            
            <div class="detail-label">Hall of Fame:</div>
            <div class="detail-value">${this.player.hofInductionYear}</div>
            
            ${this.player.nicknames ? html`
              <div class="detail-label">Nicknames:</div>
              <div class="detail-value">${this.player.nicknames}</div>
            ` : ''}
          </div>
        </div>

        <div class="navigation">
          <a href="/app" class="nav-button">← Back to Home</a>
          <a href="/app/player/Jerry-Rice" class="nav-button">Jerry Rice</a>
          <a href="/app/profile" class="nav-button">Profile</a>
        </div>
      </div>
    `;
  }
} 