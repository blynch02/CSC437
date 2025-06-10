import { html, css } from "lit";
import { View } from "@calpoly/mustang";
import { property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

type DynastyInfo = {
  name: string;
  summary: string;
  players: { name: string; fullName: string }[];
  game: { name: string; link: string };
};

const dynastyData: Record<string, DynastyInfo> = {
  "49ers": {
    name: "San Francisco 49ers",
    summary:
      "The 49ers dynasty of the 1980s, led by coach Bill Walsh and quarterback Joe Montana, was defined by the innovative West Coast Offense. They won four Super Bowls in a nine-year span (1981-1989), establishing themselves as one of the most dominant teams in NFL history.",
    players: [
      { name: "Joe Montana", fullName: "Joe-Montana" },
      { name: "Jerry Rice", fullName: "Jerry-Rice" }
    ],
    game: {
      name: "Super Bowl XXIII vs. Bengals",
      link: "/app/game/super-bowl-xxiii"
    }
  },
  patriots: {
    name: "New England Patriots",
    summary:
      "The Patriots dynasty, spanning from 2001 to 2019, was led by coach Bill Belichick and quarterback Tom Brady. They appeared in nine Super Bowls, winning six, and are considered one of the greatest dynasties in sports history.",
    players: [
      { name: "Tom Brady", fullName: "Tom-Brady" },
      { name: "Rob Gronkowski", fullName: "Rob-Gronkowski" }
    ],
    game: {
      name: "Super Bowl LI vs. Falcons",
      link: "/app/game/super-bowl-li"
    }
  },
  broncos: {
    name: "Denver Broncos",
    summary:
      "Led by quarterback John Elway, the Broncos of the late 1990s won back-to-back Super Bowls (XXXII and XXXIII). Their potent offense, featuring Terrell Davis, and a strong defense made them a powerhouse in the AFC.",
    players: [
      { name: "John Elway", fullName: "John-Elway" },
      { name: "Terrell Davis", fullName: "Terrell-Davis" }
    ],
    game: {
      name: "Super Bowl XXXII vs. Packers",
      link: "/app/game/super-bowl-xxxii"
    }
  }
};

const teamColors: Record<string, { primary: string; secondary: string }> = {
  "49ers": { primary: "#AA0000", secondary: "#B3995D" },
  patriots: { primary: "#002244", secondary: "#C60C30" },
  broncos: { primary: "#FB4F14", secondary: "#002244" }
};

export class FranchiseViewElement extends View<Model, Msg> {
  @property({ type: String, reflect: true, attribute: "franchise-name" })
  franchiseName = "unknown";

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      border-left: 10px solid var(--team-color-primary, #ddd);
      background-color: #f9f9f9;
    }
    h2 {
      color: var(--team-color-primary, #000);
      margin-bottom: 1rem;
    }
    p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    a {
      text-decoration: none;
      color: var(--team-color-secondary, #007bff);
    }
    a:hover {
      text-decoration: underline;
    }
    .key-players,
    .legendary-game {
      margin-top: 2rem;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 0.5rem;
    }
  `;

  render() {
    const franchise = dynastyData[this.franchiseName];
    const colors = teamColors[this.franchiseName] || { primary: "#ddd", secondary: "#000" };

    if (!franchise) {
      return html`<h2>Franchise not found</h2>`;
    }

    return html`
      <style>
        :host {
          --team-color-primary: ${colors.primary};
          --team-color-secondary: ${colors.secondary};
        }
      </style>
      <div>
        <h2>${franchise.name} Dynasty</h2>
        <p>${franchise.summary}</p>
        <div class="key-players">
          <h3>Key Players</h3>
          <ul>
            ${franchise.players.map(
              (player: { name: string; fullName: string }) => html`
                <li>
                  <a href="/app/player/${player.fullName}">${player.name}</a>
                </li>
              `
            )}
          </ul>
        </div>
        <div class="legendary-game">
          <h3>Legendary Game</h3>
          <a href="${franchise.game.link}">${franchise.game.name}</a>
        </div>
      </div>
    `;
  }
} 