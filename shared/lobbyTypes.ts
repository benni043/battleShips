export type Lobby = {
  lobbyName: string;
  id: string;
  player1: LobbyPlayer;
  player2: LobbyPlayer | undefined;
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

export type LobbyPlayer = {
  name: string;
  id: string;
};
