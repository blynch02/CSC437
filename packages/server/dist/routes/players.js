"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var players_exports = {};
__export(players_exports, {
  default: () => players_default
});
module.exports = __toCommonJS(players_exports);
var import_express = __toESM(require("express"));
var import_player_svc = __toESM(require("../services/player-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_player_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:fullName", (req, res) => {
  const { fullName } = req.params;
  import_player_svc.default.get(fullName).then((player) => {
    if (player) {
      res.json(player);
    } else {
      res.status(404).send("Player not found");
    }
  }).catch((err) => {
    console.error(`Error fetching player ${fullName}:`, err);
    res.status(500).send("Error retrieving player data");
  });
});
router.post("/", (req, res) => {
  const newPlayerData = req.body;
  import_player_svc.default.create(newPlayerData).then((createdPlayer) => {
    res.status(201).json(createdPlayer);
  }).catch((err) => {
    console.error("Error creating player:", err);
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).send("Error creating player");
    }
  });
});
router.put("/:fullName", (req, res) => {
  const { fullName } = req.params;
  const updatedPlayerData = req.body;
  import_player_svc.default.update(fullName, updatedPlayerData).then((updatedPlayer) => {
    if (updatedPlayer) {
      res.json(updatedPlayer);
    } else {
      res.status(404).send("Player not found for update");
    }
  }).catch((err) => {
    console.error(`Error updating player ${fullName}:`, err);
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).send("Error updating player");
    }
  });
});
router.delete("/:fullName", (req, res) => {
  const { fullName } = req.params;
  import_player_svc.default.remove(fullName).then(() => {
    res.status(204).end();
  }).catch((err) => {
    console.error(`Error deleting player ${fullName}:`, err);
    if (err.message && err.message.includes("not found for deletion")) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send("Error deleting player");
    }
  });
});
var players_default = router;
