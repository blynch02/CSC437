import { Player } from "server/models";

export interface Model {
  player?: Player;
  players?: Player[];
  profile?: {
    username: string;
    // Add other profile properties as needed
  };
  loading?: boolean;
}

export const init: Model = {}; 