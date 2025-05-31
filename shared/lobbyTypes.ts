export type Lobby = {
  lobbyName: string;
  id: string;
  player1Id: string;
  player2Id: string | undefined;
};

export type LobbyResponse = {
  lobbyId: string;
  lobbyName: string;
};

export enum LobbyError {
  INVALID_GAME = "INVALID_GAME",
  INVALID_ID = "INVALID_ID",
  FULL = "FULL",
}
