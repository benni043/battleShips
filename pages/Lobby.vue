<script setup lang="ts">
import {GameCreationError, type LobbyCreationResponse} from "#shared/types";
import {ref} from "vue";
import {useSocket} from "~/utils/useSocketIO";

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

onBeforeUnmount(() => {
  console.log(`Disconnect ${socket.id}`);
  socket?.disconnect();
})

const lobbyName = ref("")
const error = ref("")

function isLobbyNameValid(name: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/
  return name.length >= 3 && name.length <= 20 && regex.test(name)
}

function handleSubmit() {
  if (!isLobbyNameValid(lobbyName.value)) {
    error.value = "Der Name darf nur Buchstaben und Zahlen enthalten (3–20 Zeichen)."
    return
  }

  console.log(lobbyName.value)
  socket.emit("create-game", lobbyName.value, lobbyCreationResponse);
}
</script>

<template>
  <form class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md" @submit.prevent="handleSubmit">
    <h2 class="text-xl font-semibold mb-4 text-center">Lobby erstellen</h2>

    <div class="mb-4">
      <label for="lobbyName" class="block text-sm font-medium text-gray-700 mb-1">Lobby-Name</label>
      <input
          id="lobbyName"
          v-model="lobbyName"
          type="text"
          class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z.B. MeineLobby123"
      >
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </div>

    <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
    >
      Erstellen
    </button>
  </form>
</template>

<style scoped>

</style>