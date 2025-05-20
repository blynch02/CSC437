"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var player_svc_exports = {};
__export(player_svc_exports, {
  default: () => player_svc_default
});
module.exports = __toCommonJS(player_svc_exports);
var import_mongoose = require("mongoose");
const PlayerSchema = new import_mongoose.Schema({
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
const PlayerModel = (0, import_mongoose.model)("Player", PlayerSchema);
function index() {
  return PlayerModel.find();
}
function get(fullName) {
  return PlayerModel.findOne({ fullName }).exec();
}
var player_svc_default = { index, get };
