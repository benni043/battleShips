<script setup lang="ts">
import type {Socket} from "socket.io-client";
import {io} from "socket.io-client";

const socket = ref<Socket>();

onMounted(() => {
  socket.value = io({
    path: '/api/socket.io'
  })

  socket.value.emit("create-lobby", callBack);
});

function callBack(value: string) {
  console.log(value);
}

onBeforeUnmount(() => {
  console.log('Disconnect Block');
  socket.value?.disconnect();
})

</script>

<template>
  <h1>Demo</h1>
</template>

<style scoped>

</style>