<script setup lang="ts">
import {GameCreationError, type GameCreationOrJoinResponse, GameJoinError} from "#shared/types";
import {useSocket} from "~/utils/useSocketIO";
import LobbyForm from "~/components/lobby/LobbyForm.vue";
import LobbyList from "~/components/lobby/LobbyList.vue";

const socket = useSocket();

function createGame(gameName: string) {
  socket.emit("create-game", gameName, lobbyCreationResponse);
}

function lobbyCreationResponse(gameCreationResponse: GameCreationOrJoinResponse | GameCreationError) {
  switch (gameCreationResponse) {
    case GameCreationError.ALREADY_TAKEN: {
      console.error("Dieser Lobbyname wird bereits verwendet!")
      break;
    }
    case GameCreationError.INVALID: {
      console.error("Dieser Lobbyname ist nicht erlaubt!")
      break;
    }
    default: {
      navigateTo(`/game/place/${gameCreationResponse.gameName}`)
      break;
    }
  }
}

function joinGame(gameName: string) {
  socket.emit("join-game", gameName, gameJoinResponse);
}

function gameJoinResponse(gameJoinResponse: GameCreationOrJoinResponse | GameJoinError) {
  switch (gameJoinResponse) {
    case GameJoinError.FULL: {
      console.error("Dieses Spiel ist bereits voll!");
      break;
    }
    default: {
      console.log(gameJoinResponse);
      navigateTo(`/game/place/${gameJoinResponse.gameName}`)
      break;
    }
  }
}

// onBeforeUnmount(() => {
//   console.log(`Disconnect ${socket.id}`);
//   socket?.disconnect();
// })
</script>

<template>
  <div>
    <LobbyForm @submit="args => createGame(args)"/>
    <LobbyList @submit="args => joinGame(args)"/>
  </div>
</template>

<style scoped>

</style>