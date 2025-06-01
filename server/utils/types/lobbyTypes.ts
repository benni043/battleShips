export type Lobby = {
  lobbyName: string;
  id: string;
  player1: LobbyPlayer;
  player2: LobbyPlayer | undefined;
};

export type LobbyPlayer = {
  name: string;
  id: string;
};
