import { html, css } from "lit";
import { View } from "@calpoly/mustang";
import { property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

type GameInfo = {
  title: string;
  summary: string;
  score: string;
  keyMoments: string[];
};

const gameData: Record<string, GameInfo> = {
  "super-bowl-xxiii": {
    title: "Super Bowl XXIII: 49ers vs. Bengals",
    summary:
      "A classic Super Bowl that came down to the final seconds. Joe Montana led the 49ers on a 92-yard game-winning drive, cementing his 'Joe Cool' nickname. The drive, which culminated in a touchdown pass to John Taylor with 34 seconds left, is one of the most famous in NFL history.",
    score: "Final Score: 49ers 20, Bengals 16",
    keyMoments: [
      "The Drive: Montana's 92-yard game-winning drive.",
      "John Taylor's game-winning touchdown catch.",
      "Stanford Jennings' 93-yard kickoff return touchdown for the Bengals."
    ]
  },
  "super-bowl-li": {
    title: "Super Bowl LI: Patriots vs. Falcons",
    summary:
      "The greatest comeback in Super Bowl history. The Patriots trailed 28-3 in the third quarter but rallied to force the first-ever Super Bowl overtime. James White's touchdown run in OT sealed the historic victory for New England.",
    score: "Final Score: Patriots 34, Falcons 28 (OT)",
    keyMoments: [
      "The 28-3 comeback.",
      "Julian Edelman's incredible diving catch.",
      "James White's game-winning overtime touchdown."
    ]
  },
  "super-bowl-xxxii": {
    title: "Super Bowl XXXII: Broncos vs. Packers",
    summary:
      "John Elway and the Broncos finally won the big one after several Super Bowl disappointments. Terrell Davis was the MVP, rushing for 157 yards and three touchdowns despite suffering from a migraine headache that caused him to miss part of the game.",
    score: "Final Score: Broncos 31, Packers 24",
    keyMoments: [
      "Terrell Davis' MVP performance despite a migraine.",
      "John Elway's 'Helicopter' run for a crucial first down.",
      "The Broncos' defense stopping Brett Favre on the final drive."
    ]
  }
};

export class GameViewElement extends View<Model, Msg> {
  @property({ type: String, reflect: true, attribute: "game-id" })
  gameId = "unknown";

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }
    .game-container {
      max-width: 800px;
      margin: 0 auto;
    }
    h2 {
      margin-bottom: 1rem;
    }
    p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .score {
        font-weight: bold;
        font-size: 1.2em;
    }
    .key-moments {
      margin-top: 2rem;
    }
    ul {
      list-style-type: disc;
      padding-left: 2rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    a {
      display: inline-block;
      margin-top: 2rem;
    }
  `;

  render() {
    const game = gameData[this.gameId];
    if (!game) {
      return html`<h2>Game not found</h2>`;
    }

    return html`
      <div class="game-container">
        <h2>${game.title}</h2>
        <p class="score">${game.score}</p>
        <p>${game.summary}</p>
        <div class="key-moments">
          <h3>Key Moments</h3>
          <ul>
            ${game.keyMoments.map((moment) => html`<li>${moment}</li>`)}
          </ul>
        </div>
        <a href="/app">← Back to Home</a>
      </div>
    `;
  }
} 