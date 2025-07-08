import Player from "./Player";

export default interface Game {
    player1?: Player;
    player2?: Player;
    playerAllowed?: string;
    gameState: number[][];
    positionRemove?: number[];
  }