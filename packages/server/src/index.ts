import { connect } from "./services/mongo";
connect("nfl-dynasty"); // Use your actual db name
import express, { Request, Response } from "express";
import PlayersService from "./services/player-svc"; // Import the Player service
import playersRouter from "./routes/players"; // Import the players router

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/players", playersRouter); // Mount the players router

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

/* Commenting out the old route, as its functionality is now in playersRouter
app.get("/players/:fullName", (req: Request, res: Response) => {
  const { fullName } = req.params;

  PlayersService.get(fullName)
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
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
