import { html, css } from 'lit';
import { state } from 'lit/decorators.js';
import { View } from '@calpoly/mustang';
import { Msg } from '../messages';
import { Model } from '../model';

export class ProfileViewElement extends View<Model, Msg> {
  @state()
  get profile() {
    return this.model.profile;
  }

  @state()
  get loading(): boolean {
    return this.model.loading || false;
  }

  constructor() {
    super("nfl-dynasty:model");
  }

  connectedCallback() {
    super.connectedCallback();
    // Load profile data when component connects
    // In a real app, this would load user-specific profile data
    // For now, we'll use basic auth info
    if (!this.profile) {
      this.dispatchMessage([
        "profile/load",
        { username: "current-user" }
      ]);
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }
    
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-info {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
      margin-bottom: var(--size-spacing-large, 2rem);
    }
    
    .profile-info h2 {
      margin-top: 0;
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .profile-info p {
      color: var(--color-text-secondary, #666);
      line-height: 1.6;
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .loading {
      text-align: center;
      padding: var(--size-spacing-xlarge, 2rem);
      color: var(--color-text-secondary, #666);
    }
    
    .profile-actions {
      display: flex;
      gap: var(--size-spacing-medium, 1rem);
      flex-wrap: wrap;
    }
    
    .action-button {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    
    .action-button:hover {
      background-color: var(--color-primary-dark, #0056b3);
    }
    
    .action-button.secondary {
      background-color: var(--color-background-secondary, #6c757d);
    }
    
    .action-button.secondary:hover {
      background-color: var(--color-background-secondary-dark, #545b62);
    }
    
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-spacing-large, 1.5rem);
      margin-top: var(--size-spacing-large, 1.5rem);
    }
    
    .stat-card {
      background-color: white;
      padding: var(--size-spacing-large, 1.5rem);
      border-radius: var(--border-radius, 0.25rem);
      border-left: 4px solid var(--color-accent, #ffc107);
      box-shadow: var(--shadow-small, 0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .stat-card h3 {
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      color: var(--color-text-primary, #333);
      font-size: 1rem;
    }
    
    .stat-card p {
      margin: 0;
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }
  `;

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <p>Loading user information...</p>
        </div>
      `;
    }

    if (!this.profile) {
      return html`
        <div class="loading">
          <p>Redirecting to login...</p>
        </div>
      `;
    }

    return html`
      <div class="profile-container">
        <section class="profile-info">
          <h2>Welcome, ${this.profile.username}!</h2>
          <p>This is your profile page. You're successfully logged into the NFL Dynasty Tracker.</p>
          <p>Here you can manage your preferences, view your favorite teams, and track your dynasty exploration progress.</p>
          
          <div class="profile-actions">
            <a href="/app" class="action-button">Explore Dynasties</a>
            <a href="/app/player/Joe-Montana" class="action-button secondary">View Sample Player</a>
          </div>
        </section>
        
        <div class="profile-stats">
          <div class="stat-card">
            <h3>Account Status</h3>
            <p>Active since today</p>
          </div>
          
          <div class="stat-card">
            <h3>Favorite Team</h3>
            <p>Not set yet</p>
          </div>
          
          <div class="stat-card">
            <h3>Players Viewed</h3>
            <p>Ready to explore!</p>
          </div>
        </div>
      </div>
    `;
  }
} 