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
  <form @submit.prevent="handleSubmit">
    <h2 class="pb-2 text-2xl">LobbyService erstellen</h2>

    <div class="flex flex-col">
      <label class="text-neutral-600" for="lobbyName">LobbyService-Name</label>
      <input
        id="lobbyName"
        v-model="lobbyName"
        class="w-min border-1"
        type="text"
        placeholder="z.B. MeineLobby123"
      />
      <p v-if="error" class="text-sm text-red-800">{{ error }}</p>
    </div>

    <button
      class="mt-1 cursor-pointer rounded border-1 px-1 hover:bg-gray-300"
      type="submit"
    >
      Erstellen
    </button>
  </form>
</template>

<style scoped></style>
