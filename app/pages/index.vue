<script setup lang="ts">
import UserForm from "~/components/lobby/UserForm.vue";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import type { User } from "~/utils/types";

const userNameStore = useUserNameStore();

function setUserName(userData: User) {
  userNameStore.saveToCookies(userData);

  navigateTo(`/lobby`);
}

if (userNameStore.isLoggedIn()) navigateTo(`/lobby`);
</script>

<template>
  <div
    class="mx-auto min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 font-sans"
  >
    <Toaster close-button rich-colors position="top-right" />

    <UserForm
      class="mb-6 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md"
      @submit="(args: User) => setUserName(args)"
    />
  </div>
</template>

<style scoped></style>
