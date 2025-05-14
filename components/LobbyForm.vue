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
  <form @submit.prevent="handleSubmit">
    <h2>Lobby erstellen</h2>

    <div>
      <label for="lobbyName">Lobby-Name</label>
      <input
          id="lobbyName"
          v-model="lobbyName"
          type="text"
          placeholder="z.B. MeineLobby123"
      >
      <p v-if="error">{{ error }}</p>
    </div>

    <button type="submit">
      Erstellen
    </button>
  </form>
</template>

<style scoped>

</style>