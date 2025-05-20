import express, { Request, Response } from "express";
import { Player } from "../models/player";
import PlayersService from "../services/player-svc"; // Renamed to avoid conflict with Player model

const router = express.Router();

router.get("/", (_, res: Response) => {
  PlayersService.index()
    .then((list: Player[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:fullName", (req: Request, res: Response) => {
  const { fullName } = req.params;

  PlayersService.get(fullName)
    .then((player: Player | null) => {
      if (player) {
        res.json(player);
      } else {
        res.status(404).send("Player not found");
      }
    })
    .catch((err) => {
      // Log the detailed error for server-side debugging
      console.error(`Error fetching player ${fullName}:`, err);
      // Send a generic error to the client
      res.status(500).send("Error retrieving player data");
    });
});

router.post("/", (req: Request, res: Response) => {
  const newPlayerData = req.body;
  PlayersService.create(newPlayerData)
    .then((createdPlayer: Player) => {
      res.status(201).json(createdPlayer);
    })
    .catch((err) => {
      console.error("Error creating player:", err);
      // Consider more specific error handling (e.g., validation errors vs. server errors)
      if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).send("Error creating player");
      }
    });
});

router.put("/:fullName", (req: Request, res: Response) => {
  const { fullName } = req.params;
  const updatedPlayerData = req.body;

  PlayersService.update(fullName, updatedPlayerData)
    .then((updatedPlayer: Player | null) => {
      if (updatedPlayer) {
        res.json(updatedPlayer);
      } else {
        res.status(404).send("Player not found for update");
      }
    })
    .catch((err) => {
      console.error(`Error updating player ${fullName}:`, err);
      if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).send("Error updating player");
      }
    });
});

router.delete("/:fullName", (req: Request, res: Response) => {
  const { fullName } = req.params;

  PlayersService.remove(fullName)
    .then(() => {
      res.status(204).end(); // 204 No Content on successful deletion
    })
    .catch((err) => {
      console.error(`Error deleting player ${fullName}:`, err);
      // Check if the error message indicates 'not found' from our service
      if (err.message && err.message.includes('not found for deletion')) {
        res.status(404).send(err.message);
      } else {
        res.status(500).send("Error deleting player");
      }
    });
});

export default router;
