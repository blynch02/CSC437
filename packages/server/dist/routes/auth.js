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
var auth_exports = {};
__export(auth_exports, {
  authenticateUser: () => authenticateUser,
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_path = __toESM(require("path"));
var import_credential_svc = __toESM(require("../services/credential-svc"));
const router = import_express.default.Router();
const envPath = import_path.default.resolve(process.cwd(), ".env");
import_dotenv.default.config({ path: envPath });
console.log(`Attempting to load .env from: ${envPath}`);
console.log("TOKEN_SECRET from process.env after explicit dotenv.config():", process.env.TOKEN_SECRET);
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_DEFAULT_SECRET_CHANGE_ME_NOW";
if (TOKEN_SECRET === "NOT_A_DEFAULT_SECRET_CHANGE_ME_NOW") {
  console.warn("Security Warning: TOKEN_SECRET is using a default fallback value. Please ensure it is set in your .env file for production.");
}
function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    import_jsonwebtoken.default.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      // Token expires in 1 day
      (error, token) => {
        if (error) {
          reject(error);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error("Token generation failed unexpectedly."));
        }
      }
    );
  });
}
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    return res.status(400).send("Bad request: Invalid input data. Username and password are required strings.");
  }
  import_credential_svc.default.create(username, password).then((createdCredential) => generateAccessToken(createdCredential.username)).then((token) => {
    return res.status(201).send({ token });
  }).catch((err) => {
    if (err.message && err.message.startsWith("Username exists")) {
      return res.status(409).send({ error: err.message });
    } else {
      console.error("Registration Error:", err);
      return res.status(500).send({ error: "Registration failed due to an internal error." });
    }
  });
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    return res.status(400).send("Bad request: Invalid input data. Username and password are required strings.");
  }
  import_credential_svc.default.verify(username, password).then((verifiedUsername) => generateAccessToken(verifiedUsername)).then((token) => {
    return res.status(200).send({ token });
  }).catch((err) => {
    console.error(`Login attempt failed for ${username}:`, err.message);
    return res.status(401).send({ error: "Unauthorized: Invalid username or password." });
  });
});
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send({ error: "Unauthorized: No token provided." });
    return;
  }
  import_jsonwebtoken.default.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.error("JWT Verification Error:", error.message);
      res.status(403).send({ error: "Forbidden: Invalid or expired token." });
      return;
    }
    next();
  });
}
var auth_default = router;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUser
});
