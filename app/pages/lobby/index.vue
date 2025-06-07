<script setup lang="ts">
import LobbyForm from "~/components/lobby/LobbyForm.vue";
import LobbyList from "~/components/lobby/LobbyList.vue";
import { LobbyError, type LobbyResponse } from "#shared/lobbyTypes";
import { toast, Toaster } from "vue-sonner";
import { io } from "socket.io-client";

const socket = io("/lobby", {
  path: "/api/socket.io",
});

const games: Ref<LobbyResponse[]> = ref([]);
const myGames: Ref<LobbyResponse[]> = ref([]);

const uuidCookie = useCookie("uuid");
const userNameCookie = useCookie("userName");

function createLobby(lobbyName: string) {
  socket.emit(
    "create-game",
    lobbyName,
    uuidCookie.value,
    userNameCookie.value,
    createOrJoinResponse,
  );
}

function joinLobby(lobbyId: string) {
  socket.emit(
    "join-game",
    lobbyId,
    uuidCookie.value,
    userNameCookie.value,
    createOrJoinResponse,
  );
}

function createOrJoinResponse(
  error: boolean,
  lobbyRes: LobbyResponse | LobbyError,
) {
  if (error) {
    handleLobbyError(lobbyRes as LobbyError);
    return;
  }

  lobbyRes = lobbyRes as LobbyResponse;
  navigateTo(`/game/${lobbyRes.lobbyId}/player/${uuidCookie.value}/place`);
}

function handleLobbyError(error: LobbyError) {
  switch (error) {
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
  }
}

function rejoinLobby(lobbyId: string) {
  navigateTo(`/game/${lobbyId}/player/${uuidCookie.value}`);
}

function setOwnGames(ownGames: LobbyResponse[]) {
  myGames.value = ownGames;
}

function setGames(initGames: LobbyResponse[]) {
  games.value = initGames;
}

function fetch() {
  socket.emit("get-games", setGames);
  socket.emit("get-own-games", uuidCookie.value, setOwnGames);
}

socket.on("new-game", (lobbyData: LobbyResponse) => {
  games.value.push(lobbyData);
});

socket.on("remove-game", (lobbyId: string) => {
  for (let i = 0; i < games.value.length; i++) {
    if (games.value[i]!.lobbyId === lobbyId) games.value.splice(i, 1);
  }
});

socket.on("fetch", () => {
  fetch();
});

onMounted(() => {
  socket.emit("join");
});

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<template>
  <div
    class="mx-auto min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 font-sans"
  >
    <Toaster close-button rich-colors position="top-right" />

    <LobbyForm
      class="mb-6 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
      @submit="(args) => createLobby(args)"
    />

    <div class="flex items-center justify-center gap-5">
      <div class="flex w-full flex-col items-center justify-center">
        <h1 class="pb-4 text-2xl font-semibold text-gray-800">Lobbies</h1>
        <LobbyList
          :games="games"
          class="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
          @submit="(args) => joinLobby(args)"
        />
      </div>

      <div class="flex w-full flex-col items-center justify-center">
        <h1 class="pb-4 text-2xl font-semibold text-gray-800">Meine Lobbies</h1>
        <LobbyList
          :games="myGames"
          class="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
          @submit="(args) => rejoinLobby(args)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
