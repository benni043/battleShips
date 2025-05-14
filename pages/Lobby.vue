<script setup lang="ts">
import {GameCreationError, type GameCreationResponse, GameJoinError, type GameJoinResponse} from "#shared/types";
import {useSocket} from "~/utils/useSocketIO";
import LobbyForm from "~/components/LobbyForm.vue";
import LobbyList from "~/components/LobbyList.vue";

const socket = useSocket();

function createGame(gameName: string) {
  socket.emit("create-game", gameName, lobbyCreationResponse);
}

function lobbyCreationResponse(gameCreationResponse: GameCreationResponse) {
  if (gameCreationResponse.success) {
    console.log(gameCreationResponse);
    return;
  }

  switch (gameCreationResponse.errorType) {
    case GameCreationError.ALREADY_TAKEN: {
      console.error("Dieser Lobbyname wird bereits verwendet!")
      break;
    }
    case GameCreationError.INVALID: {
      console.error("Dieser Lobbyname ist nicht erlaubt!")
      break;
    }
    default: {
      console.error("Unbekannter Fehler")
      break;
    }
  }
}

function joinGame(gameName: string) {
  socket.emit("join-game", gameName, gameJoinResponse);
}

function gameJoinResponse(gameJoinResponse: GameJoinResponse) {
  if (gameJoinResponse.success) {
    console.log(gameJoinResponse);
    return;
  }

  switch (gameJoinResponse.errorType) {
    case GameJoinError.FULL: {
      console.error("Dieses Spiel ist bereits voll!");
      break;
    }
    default: {
      console.error("Unbekannter Fehler")
      break;
    }
  }
}

onBeforeUnmount(() => {
  console.log(`Disconnect ${socket.id}`);
  socket?.disconnect();
})
</script>

<template>
  <div>
    <LobbyForm @submit="args => createGame(args)"/>
    <LobbyList @submit="args => joinGame(args)"/>
  </div>
</template>

<style scoped>

</style>