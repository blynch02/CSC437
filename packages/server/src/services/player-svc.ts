import { Schema, model } from "mongoose";
import { Player } from "../models/player";

const PlayerSchema = new Schema<Player>({
  sectionTitle: { type: String },
  iconRef: { type: String },
  fullName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  yearsActive: { type: String, required: true, trim: true },
  teams: { type: String, required: true, trim: true },
  jerseyNumber: { type: String, required: true, trim: true },
  hofInductionYear: { type: String, required: true, trim: true },
  nicknames: { type: String }
}, { collection: "players" });

const PlayerModel = model<Player>("Player", PlayerSchema);

function index(): Promise<Player[]> {
  return PlayerModel.find();
}

function get(fullName: string): Promise<Player | null> {
  return PlayerModel.findOne({ fullName }).exec();
}

function create(playerData: Player): Promise<Player> {
  const newPlayer = new PlayerModel(playerData);
  return newPlayer.save();
}

function update(fullName: string, playerData: Partial<Player>): Promise<Player | null> {
  return PlayerModel.findOneAndUpdate({ fullName }, playerData, { new: true }).exec();
}

async function remove(fullName: string): Promise<void> {
  const result = await PlayerModel.findOneAndDelete({ fullName }).exec();
  if (!result) {
    throw new Error(`Player with fullName '${fullName}' not found for deletion.`);
  }
}

export default { index, get, create, update, remove };
