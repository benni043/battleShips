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
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
    <div v-for="game in games" :key="game" class="mb-2">
      <button
        @click="handleSubmit(game)"
        class="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
      >
        {{ game }}
      </button>
    </div>
  </div>
</template>


<style scoped></style>
