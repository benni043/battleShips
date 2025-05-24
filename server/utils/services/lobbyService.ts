import { LobbyError } from "#shared/lobbyTypes";

export class LobbyService {
  getAvailableLobbies() {
    return lobbyRepository.getAvailableLobbies();
  }

  createLobby(lobbyName: string, id: string) {
    if (!this.isLobbyNameAvailable(lobbyName)) return LobbyError.ALREADY_TAKEN;

    if (!this.isLobbyNameValid(lobbyName)) return LobbyError.INVALID_GAME;

    return lobbyRepository.createLobby(lobbyName, id);
  }

  joinLobby(lobbyName: string, id: string) {
    const lobby = lobbyRepository.getLobbyByName(lobbyName);

    if (!lobby) return LobbyError.INVALID_GAME;
    if (lobby.player2Id !== undefined) return LobbyError.FULL;

    return lobbyRepository.joinLobby(lobbyName, id);
  }

  private isLobbyNameAvailable(lobbyName: string) {
    const lobbies = lobbyRepository.getAvailableLobbies();

    return !lobbies.includes(lobbyName);
  }

  private isLobbyNameValid(lobbyName: string): boolean {
    const minLength = 3;
    const maxLength = 20;
    const validNameRegex = /^[a-zA-Z0-9]+$/;

    return (
      lobbyName.length >= minLength &&
      lobbyName.length <= maxLength &&
      validNameRegex.test(lobbyName)
    );
  }

  checkData(lobbyName: string, id: string) {
    const lobby = lobbyRepository.getLobbyByName(lobbyName);

    if (!lobby) return LobbyError.INVALID_GAME;

    if (lobby.player1Id !== id && lobby.player2Id !== id)
      return LobbyError.INVALID_ID;
  }

  //
  // setGrid(id: string, gameName: string, grid: Cell[][]) {
  //   return lobbyRepository.setGrid(id, gameName, grid);
  // }
  //
  // setSocket(id: string, gameName: string, socket: Socket) {
  //   return lobbyRepository.setSocket(id, gameName, socket);
  // }
  //
  // removeGame( gameName: string) {
  //   return lobbyRepository.removeGame(gameName);
  // }
}

export const lobbyService = new LobbyService();
