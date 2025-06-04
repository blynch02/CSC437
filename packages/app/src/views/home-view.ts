import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('home-view')
export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }
    
    section {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h2 {
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    p {
      color: var(--color-text-secondary, #555);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      line-height: 1.6;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li {
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    a {
      display: inline-block;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-background-secondary, #f8f9fa);
      color: var(--color-text-primary, #333);
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      border-left: 4px solid var(--color-primary, #007bff);
      transition: background-color 0.2s ease;
    }
    
    a:hover {
      background-color: var(--color-background-hover, #e9ecef);
    }
    
    .test-links {
      margin-top: var(--size-spacing-xlarge, 3rem);
      padding-top: var(--size-spacing-large, 2rem);
      border-top: 1px solid var(--color-border, #dee2e6);
    }
    
    .test-links h3 {
      color: var(--color-text-secondary, #666);
      font-size: 1rem;
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .test-links a {
      background-color: var(--color-background-accent, #fff3cd);
      border-left-color: var(--color-accent, #ffc107);
      font-size: 0.9rem;
    }
    
    footer {
      text-align: center;
      margin-top: var(--size-spacing-xlarge, 3rem);
      padding-top: var(--size-spacing-large, 2rem);
      border-top: 1px solid var(--color-border, #dee2e6);
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }
  `;

  render() {
    return html`
      <main>
        <section>
          <h2>NFL Franchises</h2>
          <p>Select a franchise to explore its dynasties:</p>
          
          <ul>
            <li><a href="/app/franchise/49ers">San Francisco 49ers</a></li>
            <li><a href="/app/franchise/cowboys">Dallas Cowboys</a></li>
            <li><a href="/app/franchise/steelers">Pittsburgh Steelers</a></li>
            <li><a href="/app/franchise/patriots">New England Patriots</a></li>
          </ul>
          
          <div class="test-links">
            <h3>Test SPA Features:</h3>
            <ul>
              <li><a href="/app/player/Joe-Montana">Joe Montana (Player View)</a></li>
              <li><a href="/app/player/Jerry-Rice">Jerry Rice (Player View)</a></li>
              <li><a href="/app/login">Login (Demo)</a></li>
              <li><a href="/app/profile">Profile (Protected)</a></li>
            </ul>
          </div>
        </section>
        
        <footer>
          <p>&copy; 2025 NFL Dynasty Tracker</p>
        </footer>
      </main>
    `;
  }
} 