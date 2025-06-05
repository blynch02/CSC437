import { Player } from "server/models";

export type Msg =
  | ["player/select", { fullName: string }]
  | ["players/load-all", {}]
  | ["profile/load", { username: string }]
  | ["player/save", { 
      fullName: string; 
      player: Player; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void;
    }]
  | ["profile/save", { 
      userid: string; 
      profile: { username: string }; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void;
    }]
  | ["loading/set", { loading: boolean }]; 