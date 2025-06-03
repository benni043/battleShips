<script setup lang="ts">
defineProps<{
  header: string | null | undefined;
}>();
</script>

<template>
  <h1 class="h-6 text-center text-xl leading-6 font-semibold text-gray-700">
    {{ header }}
  </h1>

  <div class="m-[40px]">
    <div class="ml-[40px] flex">
      <div
        v-for="n in 10"
        :key="'top-' + n"
        class="flex h-[40px] w-[40px] items-center justify-center pb-7 text-xl font-medium text-gray-700"
      >
        {{ String.fromCharCode(64 + n) }}
      </div>
    </div>

    <div class="flex items-center justify-center">
      <div class="flex flex-col">
        <div
          v-for="n in 10"
          :key="'top-' + n"
          class="flex h-[40px] w-[40px] items-center justify-center pr-7 text-xl font-medium text-gray-700"
        >
          {{ n }}
        </div>
      </div>

      <div class="flex items-center justify-center">
        <slot></slot>

        <img
          src="../../../assets/img/border.png"
          alt="border"
          class="absolute h-[480px] w-[480px]"
          style="image-rendering: pixelated"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
