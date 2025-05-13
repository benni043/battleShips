<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits(["submit"]);

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

  emit("submit", lobbyName.value)
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