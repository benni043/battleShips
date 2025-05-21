<script setup lang="ts">
import {
  GameCreationError,
  type GameCreationOrJoinResponse,
  GameJoinError,
} from "#shared/types";
import LobbyForm from "~/components/lobby/LobbyForm.vue";
import LobbyList from "~/components/lobby/LobbyList.vue";
import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket.io",
});

const games: Ref<string[]> = ref([]);
const uuid: Ref<string> = ref("");

function createGame(gameName: string) {
  socket.emit("create-game", uuid.value, gameName, lobbyCreationResponse);
}

function lobbyCreationResponse(
  gameCreationResponse: GameCreationOrJoinResponse | GameCreationError,
) {
  switch (gameCreationResponse) {
    case GameCreationError.ALREADY_TAKEN: {
      alert("Dieser Lobbyname wird bereits verwendet!");
      break;
    }
    case GameCreationError.INVALID: {
      alert("Dieser Lobbyname ist nicht erlaubt!");
      break;
    }
    default: {
      navigateTo(`/game/${gameCreationResponse.gameName}/place/${uuid.value}`);
      break;
    }
  }
}

function joinGame(gameName: string) {
  socket.emit("join-game", uuid.value, gameName, gameJoinResponse);
}

function gameJoinResponse(
  gameJoinResponse: GameCreationOrJoinResponse | GameJoinError,
) {
  switch (gameJoinResponse) {
    case GameJoinError.FULL: {
      alert("Dieses Spiel ist bereits voll!");
      break;
    }
    default: {
      navigateTo(`/game/${gameJoinResponse.gameName}/place/${uuid.value}`);
      break;
    }
  }
}

socket.emit("join-lobby", getLobbies);

function getLobbies(initGames: string[]) {
  games.value = initGames;
}

socket.on("new-game", (gameName: string) => {
  games.value.push(gameName);
});

socket.on("remove-game", (gameName: string) => {
  const index = games.value.indexOf(gameName);

  if (index !== -1) games.value.splice(index, 1);
});

function generateUUID() {
  const uuidGen = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char) => {
      const rand = (Math.random() * 16) | 0;
      const value = char === "x" ? rand : (rand & 0x3) | 0x8;
      return value.toString(16);
    },
  );

  console.log(uuid);
  uuid.value = uuidGen;
}

generateUUID();

onBeforeUnmount(() => {
  socket?.disconnect();
});

</script>

<template>
  <div class="p-2">
    <LobbyForm @submit="(args) => createGame(args)" />
    <LobbyList :games="games" @submit="(args) => joinGame(args)" />
  </div>
</template>

<style scoped></style>
