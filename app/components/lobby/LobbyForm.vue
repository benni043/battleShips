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
  <form
    class="mx-auto max-w-md rounded-lg bg-white p-6 shadow"
    @submit.prevent="handleSubmit"
  >
    <h2 class="pb-4 text-2xl font-semibold text-gray-800">Lobby erstellen</h2>

    <div class="mb-4 flex flex-col">
      <label for="lobbyName" class="mb-1 font-medium text-neutral-600"
        >Lobby-Name</label
      >
      <input
        id="lobbyName"
        v-model="lobbyName"
        type="text"
        placeholder="z.B. MeineLobby123"
        class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>

    <button
      type="submit"
      class="w-full rounded-md bg-blue-600 py-2 text-white transition hover:cursor-pointer hover:bg-blue-700"
    >
      Erstellen
    </button>
  </form>
</template>

<style scoped></style>
