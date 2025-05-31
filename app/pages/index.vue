<script setup lang="ts">
import LobbyForm from "~/components/lobby/LobbyForm.vue";
import LobbyList from "~/components/lobby/LobbyList.vue";
import { io } from "socket.io-client";
import { LobbyError, type LobbyResponse } from "#shared/lobbyTypes";
import Username from "~/components/lobby/Username.vue";
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";
import { v4 as uuidv4 } from "uuid";

const socket = io({
  path: "/api/socket.io",
});

const userNameStore = useUserNameStore();

const games: Ref<string[]> = ref([]);

function createLobby(lobbyName: string) {
  socket.emit("create-game", lobbyName, userNameStore.uuid, lobbyResponse);
}

function joinLobby(lobbyName: string) {
  socket.emit("join-game", lobbyName, userNameStore.uuid, lobbyResponse);
}

function lobbyResponse(response: LobbyResponse | LobbyError) {
  switch (response) {
    case LobbyError.ALREADY_TAKEN: {
      toast.warning("Dieser Lobbyname wird bereits verwendet!");
      break;
    }
    case LobbyError.INVALID_GAME: {
      toast.warning("Dieser Lobbyname ist nicht erlaubt!");
      break;
    }
    case LobbyError.FULL: {
      toast.warning("Diese Lobby ist bereits voll!");
      break;
    }
    case LobbyError.INVALID_ID: {
      toast.error("Error: Ungültige ID!");
      break;
    }
    default: {
      navigateTo(
        `/game/${response.lobbyName}/player/${userNameStore.uuid}/place`,
      );
      break;
    }
  }
}

function getLobbies(initGames: string[]) {
  games.value = initGames;
}

function setUserName(usernameRes: string) {
  userNameStore.me = usernameRes;
  userNameStore.uuid = uuidv4();

  socket.emit("join-lobby", getLobbies);
}

socket.on("new-game", (lobbyName: string) => {
  games.value.push(lobbyName);
});

socket.on("remove-game", (lobbyName: string) => {
  const index = games.value.indexOf(lobbyName);

  if (index !== -1) games.value.splice(index, 1);
});

if (userNameStore.me.length !== 0) socket.emit("join-lobby", getLobbies);

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<template>
  <div
    class="mx-auto min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 font-sans"
  >
    <Toaster close-button rich-colors position="top-right" />

    <div v-if="userNameStore.me.length === 0">
      <Username
        class="mb-6 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        @submit="(args) => setUserName(args)"
      />
    </div>

    <div v-if="userNameStore.me.length !== 0">
      <LobbyForm
        class="mb-6 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        @submit="(args) => createLobby(args)"
      />
      <LobbyList
        :games="games"
        class="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        @submit="(args) => joinLobby(args)"
      />
    </div>
  </div>
</template>

<style scoped></style>
