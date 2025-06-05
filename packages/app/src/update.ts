import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Player } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "player/select":
      loadPlayer(message[1], user)
        .then((player) =>
          apply((model) => ({ ...model, player, loading: false }))
        )
        .catch((error) => {
          console.error("Failed to load player:", error);
          apply((model) => ({ ...model, loading: false }));
        });
      apply((model) => ({ ...model, loading: true }));
      break;

    case "players/load-all":
      loadAllPlayers(message[1], user)
        .then((players) =>
          apply((model) => ({ ...model, players, loading: false }))
        )
        .catch((error) => {
          console.error("Failed to load players:", error);
          apply((model) => ({ ...model, loading: false }));
        });
      apply((model) => ({ ...model, loading: true }));
      break;

    case "profile/load":
      loadProfile(message[1], user)
        .then((profile) =>
          apply((model) => ({ ...model, profile, loading: false }))
        )
        .catch((error) => {
          console.error("Failed to load profile:", error);
          apply((model) => ({ ...model, loading: false }));
        });
      apply((model) => ({ ...model, loading: true }));
      break;

    case "loading/set":
      apply((model) => ({ ...model, loading: message[1].loading }));
      break;

    case "player/save":
      savePlayer(message[1], user)
        .then((player) =>
          apply((model) => ({ ...model, player, loading: false }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true }));
      break;

    case "profile/save":
      saveProfile(message[1], user)
        .then((profile) =>
          apply((model) => ({ ...model, profile, loading: false }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true }));
      break;

    default:
      const unhandled: never = message;
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

function loadPlayer(
  payload: { fullName: string },
  user: Auth.User
): Promise<Player | undefined> {
  return fetch(`/api/players/${payload.fullName}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Player:", json);
        return json as Player;
      }
    });
}

function loadAllPlayers(
  _payload: {},
  user: Auth.User
): Promise<Player[]> {
  return fetch("/api/players", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return [];
    })
    .then((json: unknown) => {
      console.log("All Players:", json);
      return (json as Player[]) || [];
    });
}

function loadProfile(
  payload: { username: string },
  _user: Auth.User
): Promise<{ username: string } | undefined> {
  // For now, just return user info from the auth token
  // In the future, this could load additional profile data from an API
  return Promise.resolve({
    username: payload.username
  });
}

function savePlayer(
  payload: { 
    fullName: string; 
    player: Player; 
    onSuccess?: () => void; 
    onFailure?: (err: Error) => void;
  },
  user: Auth.User
): Promise<Player> {
  return fetch(`/api/players/${payload.fullName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.player)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to save player: ${response.status}`);
    })
    .then((json: unknown) => {
      console.log("Saved Player:", json);
      return json as Player;
    });
}

function saveProfile(
  payload: { 
    userid: string; 
    profile: { username: string }; 
    onSuccess?: () => void; 
    onFailure?: (err: Error) => void;
  },
  _user: Auth.User
): Promise<{ username: string }> {
  // For now, just return the profile data (no actual API call)
  return Promise.resolve(payload.profile);
}

// savePlayer function will be implemented in next phase 