import { connect } from "./services/mongo";
connect("nfl-dynasty"); // Use your actual db name
import express, { Request, Response } from "express";
import Players from "./services/player-svc"; // Import the Player service

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/players/:fullName", (req: Request, res: Response) => {
  const { fullName } = req.params;

  Players.get(fullName)
    .then((player) => {
      if (player) {
        res.json(player);
      } else {
        res.status(404).send("Player not found");
      }
    })
    .catch((err) => {
      console.error("Error fetching player:", err);
      res.status(500).send("Error fetching player");
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
