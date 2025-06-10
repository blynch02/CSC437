// NFL Dynasty Tracker - SPA Entry Point
// This will be the main entry point for our single-page application

import {
  Auth,
  define,
  History,
  Store,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { NflDynastyHeaderElement } from "./components/nfl-dynasty-header";
import { HomeViewElement } from "./views/home-view";
import { ProfileViewElement } from "./views/profile-view";
import { PlayerViewElement } from "./views/player-view";
import { PlayerEditViewElement } from "./views/player-edit-view";
import { LoginViewElement } from "./views/login-view";
import { FranchiseViewElement } from "./views/franchise-view";
import { GameViewElement } from "./views/game-view";


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
    path: "/app/game/:gameId",
    view: (params: Switch.Params) => html`
      <game-view game-id=${params.gameId}></game-view>
    `
  },
  {
    path: "/app/player/:fullName/edit",
    view: (params: Switch.Params) => html`
      <player-edit-view player-name=${params.fullName}></player-edit-view>
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
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "nfl-dynasty:auth");
    }
  },
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
  "player-edit-view": PlayerEditViewElement,
  "login-view": LoginViewElement,
  "franchise-view": FranchiseViewElement,
  "game-view": GameViewElement
});

