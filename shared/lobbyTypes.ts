export type LobbyResponse = {
  lobbyId: string;
  lobbyName: string;
};

export enum LobbyError {
  INVALID_GAME = "INVALID_GAME",
  INVALID_ID = "INVALID_ID",
  FULL = "FULL",
}