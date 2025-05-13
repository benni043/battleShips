<script setup lang="ts">
import {GameCreationError, type LobbyCreationResponse} from "#shared/types";
import {useSocket} from "~/utils/useSocketIO";
import LobbyForm from "~/components/LobbyForm.vue";

const socket = useSocket();

function lobbyCreationResponse(lobbyCreationResponse: LobbyCreationResponse) {
  if (!lobbyCreationResponse.success) {
    switch (lobbyCreationResponse.errorType) {
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
    return;
  }

  console.log(lobbyCreationResponse);
}

socket.on("new-game", (gameName: string) => {
  console.log("new-game", gameName);
})

onBeforeUnmount(() => {
  console.log(`Disconnect ${socket.id}`);
  socket?.disconnect();
})

function createGame(gameName: string) {
  socket.emit("create-game", gameName, lobbyCreationResponse);
}

</script>

<template>
  <LobbyForm @submit="args => createGame(args)"/>
</template>

<style scoped>

</style>