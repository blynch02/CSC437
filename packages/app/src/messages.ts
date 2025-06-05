import { Player } from "server/models";

export type Msg =
  | ["player/select", { fullName: string }]
  | ["players/load-all", {}]
  | ["profile/load", { username: string }]
  | ["player/save", { fullName: string; player: Player }]
  | ["loading/set", { loading: boolean }]; 