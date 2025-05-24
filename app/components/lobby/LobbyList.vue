<script setup lang="ts">

const emit = defineEmits(["submit"]);

defineProps<{
  games: string[];
}>();

function handleSubmit(gameName: string) {
  emit("submit", gameName);
}
</script>

<template>
  <div>
    <div v-for="game in games" :key="game">
      <button
        class="mt-1 cursor-pointer rounded border-1 px-1 hover:bg-gray-300"
        @click="handleSubmit(game)"
      >
        {{ game }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
