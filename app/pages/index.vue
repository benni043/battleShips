<script setup lang="ts">
import LobbyForm from "~/components/lobby/LobbyForm.vue";
import LobbyList from "~/components/lobby/LobbyList.vue";
import { io } from "socket.io-client";
import { LobbyError, type LobbyResponse } from "#shared/lobbyTypes";

const socket = io({
  path: "/api/socket.io",
});

const games: Ref<string[]> = ref([]);
const uuid: Ref<string> = ref("");

function createLobby(lobbyName: string) {
  socket.emit("create-game", lobbyName, uuid.value, lobbyResponse);
}

function joinLobby(lobbyName: string) {
  socket.emit("join-game", lobbyName, uuid.value, lobbyResponse);
}

function lobbyResponse(response: LobbyResponse | LobbyError) {
  console.log(response);

  switch (response) {
    case LobbyError.ALREADY_TAKEN: {
      alert("Dieser Lobbyname wird bereits verwendet!");
      break;
    }
    case LobbyError.INVALID_GAME: {
      alert("Dieser Lobbyname ist nicht erlaubt!");
      break;
    }
    case LobbyError.FULL: {
      alert("Diese Lobby ist voll!");
      break;
    }
    case LobbyError.INVALID_ID: {
      alert("Ungültige ID!");
      break;
    }
    default: {
      navigateTo(`/game/${response.lobbyName}/place/${uuid.value}`);
      break;
    }
  }
}

socket.emit("join-lobby", getLobbies);

function getLobbies(initGames: string[]) {
  games.value = initGames;
}

socket.on("new-game", (lobbyName: string) => {
  games.value.push(lobbyName);
});

socket.on("remove-game", (lobbyName: string) => {
  console.log("sdfgiu");
  const index = games.value.indexOf(lobbyName);

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

  uuid.value = uuidGen;
}

generateUUID();

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<template>
  <div class="p-2">
    <LobbyForm @submit="(args) => createLobby(args)" />
    <LobbyList :games="games" @submit="(args) => joinLobby(args)" />
  </div>
</template>

<style scoped></style>
