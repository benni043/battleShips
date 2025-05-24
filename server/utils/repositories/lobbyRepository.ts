import type { Lobby } from "#shared/lobbyTypes";

export class LobbyRepository {
  private readonly lobbies = new Map<string, Lobby>();

  getAvailableLobbies(): string[] {
    return this.lobbies.keys().toArray();
  }

  createLobby(lobbyName: string, id: string) {
    const lobby = {
      lobbyName: lobbyName,
      player1Id: id,
      player2Id: undefined,
    } as Lobby;

    this.lobbies.set(lobbyName, lobby);

    return lobbyName;
  }

  joinLobby(lobbyName: string, id: string) {
    const lobby = this.lobbies.get(lobbyName)!;

    lobby.player2Id = id;

    return lobbyName;
  }

  getLobbyByName(lobbyName: string) {
    return this.lobbies.get(lobbyName);
  }

  //
  // setGrid(id: string, gameName: string, field: Cell[][]) {
  //   const game = this.games.get(gameName);
  //
  //   if (!game) return GameError.INVALID_GAME;
  //
  //   if (id === game.player1.id) {
  //     game.player1.field = field;
  //   } else if (id === game.player2.id) {
  //     game.player2.field = field;
  //   } else {
  //     return GameError.INVALID_ID;
  //   }
  //
  //   if (game.player1.field && game.player2.field)
  //     game.state = GameState.STARTED;
  // }
  //
  // setSocket(id: string, gameName: string, socket: Socket) {
  //   const game = this.games.get(gameName);
  //
  //   if (!game) return GameError.INVALID_GAME;
  //
  //   if (id === game.player1.id) {
  //     game.player1.socket = socket;
  //   } else if (id === game.player2.id) {
  //     game.player2.socket = socket;
  //   } else {
  //     return GameError.INVALID_ID;
  //   }
  // }
  //
  // removeGame(gameName: string) {
  //   const game = this.games.get(gameName);
  //
  //   if (!game) return GameError.INVALID_GAME;
  //
  //   this.games.delete(gameName);
  // }
}

export const lobbyRepository = new LobbyRepository();
