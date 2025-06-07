import { toast } from "vue-sonner";
import { GameError } from "#shared/gameTypes";

export function handleGameError<T>(err: GameError | T): T | undefined {
  switch (err) {
    case GameError.WRONG_PLAYER: {
      toast.warning(`Du bist nicht an der Reihe!`);
      return undefined;
    }
    case GameError.INVALID_CORD: {
      toast.error(`Ungültige Koordinaten`);
      return undefined;
    }
    case GameError.ALREADY_HIT: {
      toast.warning(`Auf dieses Feld hast du bereits geschossen!`);
      return undefined;
    }
    case GameError.NOT_STARTED: {
      toast.error(`Das Spiel hat noch nicht gestartet!`);
      return undefined;
    }
    case GameError.INVALID_ID: {
      toast.error(`Ungültige ID!`);
      return undefined;
    }
    case GameError.INVALID_GAME: {
      toast.error(`Ungültiges Spiel!`);
      return undefined;
    }
    case GameError.FINISHED: {
      toast.error(`Spiel ist bereits beendet!`);
      return undefined;
    }
    case GameError.ALREADY_JOINED: {
      toast.error(`Du bist bereits in diesem Spiel!`);
      return undefined;
    }
    default:
      return err;
  }
}