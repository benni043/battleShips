<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const lobbyName = ref("");
const error = ref("");

function isLobbyNameValid(name: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  return name.length >= 3 && name.length <= 20 && regex.test(name);
}

function handleSubmit() {
  if (!isLobbyNameValid(lobbyName.value)) {
    error.value =
      "Der Name darf nur Buchstaben und Zahlen enthalten (3–20 Zeichen).";
    return;
  }

  emit("submit", lobbyName.value);
}
</script>

<template>
  <form class="max-w-md mx-auto p-6 bg-white rounded-lg shadow" @submit.prevent="handleSubmit">
    <h2 class="pb-4 text-2xl font-semibold text-gray-800">Lobby erstellen</h2>

    <div class="flex flex-col mb-4">
      <label for="lobbyName" class="mb-1 text-neutral-600 font-medium">Lobby-Name</label>
      <input
        id="lobbyName"
        v-model="lobbyName"
        type="text"
        placeholder="z.B. MeineLobby123"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      Erstellen
    </button>
  </form>
</template>


<style scoped></style>
