import dotenv from "dotenv";
import express, {
  Request,
  Response
} from "express";
import jwt from "jsonwebtoken";
import path from "path"; // Import path module

import credentialsService from "../services/credential-svc"; // Renamed import

const router = express.Router();

// Explicitly configure dotenv path
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

// Diagnostic log
console.log(`Attempting to load .env from: ${envPath}`);
console.log("TOKEN_SECRET from process.env after explicit dotenv.config():", process.env.TOKEN_SECRET);

const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_DEFAULT_SECRET_CHANGE_ME_NOW"; // Fallback, but .env should be used

if (TOKEN_SECRET === "NOT_A_DEFAULT_SECRET_CHANGE_ME_NOW") {
  console.warn("Security Warning: TOKEN_SECRET is using a default fallback value. Please ensure it is set in your .env file for production.");
}

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" }, // Token expires in 1 day
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

router.post("/register", (req: Request, res: Response): void | express.Response => {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    // Explicitly return the response to satisfy the linter for void | express.Response
    return res.status(400).send("Bad request: Invalid input data. Username and password are required strings.");
  }

  credentialsService.create(username, password)
    .then(createdCredential => generateAccessToken(createdCredential.username))
    .then(token => {
      // Explicitly return the response
      return res.status(201).send({ token: token });
    })
    .catch(err => {
      if (err.message && err.message.startsWith("Username exists")) {
        // Explicitly return the response
        return res.status(409).send({ error: err.message });
      } else {
        console.error("Registration Error:", err);
        // Explicitly return the response
        return res.status(500).send({ error: "Registration failed due to an internal error." });
      }
    });
});

router.post("/login", (req: Request, res: Response): void | express.Response => {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    return res.status(400).send("Bad request: Invalid input data. Username and password are required strings.");
  }

  credentialsService.verify(username, password)
    .then(verifiedUsername => generateAccessToken(verifiedUsername))
    .then(token => {
      return res.status(200).send({ token: token });
    })
    .catch(err => {
      // Log the error for server-side debugging, but send a generic 401 for security
      console.error(`Login attempt failed for ${username}:`, err.message);
      return res.status(401).send({ error: "Unauthorized: Invalid username or password." });
    });
});

// Middleware to authenticate users based on JWT
export function authenticateUser(
  req: Request,
  res: Response,
  next: express.NextFunction // Explicitly type NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN_STRING"

  if (!token) {
    // No token provided
    res.status(401).send({ error: "Unauthorized: No token provided." });
    return; // Ensure no further processing
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      // Token is invalid (e.g., expired, tampered, wrong secret)
      console.error("JWT Verification Error:", error.message);
      res.status(403).send({ error: "Forbidden: Invalid or expired token." });
      return; // Ensure no further processing
    }
    // Token is valid, proceed to the next middleware or route handler
    // Optionally, you could attach the decoded payload to the request if needed by subsequent handlers
    // (req as any).user = decoded; // Example: if you want to access decoded.username later
    next();
  });
}

export default router; 