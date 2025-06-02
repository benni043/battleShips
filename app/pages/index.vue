<script setup lang="ts">
import UserForm from "~/components/lobby/UserForm.vue";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import type { User } from "~/utils/types";

const uuidCookie = useCookie("uuid");
const userNameCookie = useCookie("userName");

function setUserName(userData: User) {
  uuidCookie.value = userData.uuid;
  userNameCookie.value = userData.userName;

  navigateTo(`/lobby`);
}

if (userNameCookie.value !== null) navigateTo(`/lobby`);
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
