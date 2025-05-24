export type Lobby = {
  lobbyName: string;
  player1Id: string;
  player2Id: string | undefined;
};

export type LobbyResponse = {
  lobbyName: string;
};

export enum LobbyError {
  INVALID_GAME = "INVALID_GAME",
  INVALID_ID = "INVALID_ID",
  ALREADY_TAKEN = "ALREADY_TAKEN",
  FULL = "FULL"
}