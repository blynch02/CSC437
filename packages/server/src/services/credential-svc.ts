import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true // Ensure usernames are unique
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);

const CredentialModel = model<Credential>(
  "Credential",
  credentialSchema
);

function create(username: string, password: string): Promise<Credential> {
  // First, check if the username already exists
  return CredentialModel.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        throw new Error(`Username exists: ${username}`);
      }
      // If username doesn't exist, proceed to hash password and save
      return bcrypt.genSalt(10)
        .then((salt: string) => bcrypt.hash(password, salt))
        .then((hashedPassword: string) => {
          const newUserCredential = new CredentialModel({
            username,
            hashedPassword
          });
          return newUserCredential.save();
        });
    });
}

function verify(username: string, password: string): Promise<string> {
  return CredentialModel.findOne({ username })
    .exec()
    .then((foundUser) => {
      if (!foundUser) {
        throw new Error("Invalid username or password");
      }
      return bcrypt.compare(password, foundUser.hashedPassword)
        .then((match: boolean) => {
          if (!match) {
            throw new Error("Invalid username or password");
          }
          return foundUser.username; // Return username on successful verification
        });
    });
}

export default { create, verify }; 