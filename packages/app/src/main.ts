// NFL Dynasty Tracker - SPA Entry Point
// This will be the main entry point for our single-page application

import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { NflDynastyHeaderElement } from "./components/nfl-dynasty-header";
import { HomeViewElement } from "./views/home-view";
import { ProfileViewElement } from "./views/profile-view";
import { PlayerViewElement } from "./views/player-view";
import { LoginViewElement } from "./views/login-view";


// Define routes before the define() statement
const routes = [
  {
    path: "/app/login",
    view: () => html`
      <login-view></login-view>
    `
  },
  {
    path: "/app/franchise/:name",
    view: (params: Switch.Params) => html`
      <franchise-view franchise-name=${params.name}></franchise-view>
    `
  },
  {
    path: "/app/player/:fullName",
    view: (params: Switch.Params) => html`
      <player-view player-name=${params.fullName}></player-view>
    `
  },
  {
    path: "/app/profile",
    view: () => html`
      <profile-view></profile-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

// Define custom elements
define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "nfl-dynasty:history", "nfl-dynasty:auth");
    }
  },
  // Real components
  "nfl-dynasty-header": NflDynastyHeaderElement,
  "home-view": HomeViewElement,
  "profile-view": ProfileViewElement,
  "player-view": PlayerViewElement,
  "login-view": LoginViewElement,
  // Placeholder franchise view
  "franchise-view": class PlaceholderFranchise extends HTMLElement {
    connectedCallback() {
      const franchiseName = this.getAttribute('franchise-name') || 'Unknown';
      this.innerHTML = `
        <main style="padding: 2rem;">
          <h2>Franchise: ${franchiseName}</h2>
          <p>Franchise view placeholder.</p>
          <p>This will show dynasty information, key players, and championship history.</p>
          <a href="/app">← Back to Home</a>
        </main>
      `;
    }
  }
});

