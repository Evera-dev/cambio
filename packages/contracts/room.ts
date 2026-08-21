import { Player } from "./player";

export interface Room {
  id: string;
  hostId: string;
  players: Player[];
}