<script setup lang="ts">
defineProps<{
  header: string | null | undefined;
}>();
</script>

<template>
  <h1 class="h-6 text-center text-xl leading-6 font-semibold text-gray-700">
    {{ header }}
  </h1>

  <div
    class="grid aspect-square w-dvw max-w-[500px] grid-cols-11 grid-rows-11 overflow-hidden p-2 pr-4"
  >
    <div class="col-span-10 col-start-2 flex w-full">
      <div
        v-for="n in 10"
        :key="'top-' + n"
        class="xs:text-xl flex flex-1 items-start justify-center font-medium text-gray-700"
      >
        {{ String.fromCharCode(64 + n) }}
      </div>
    </div>

    <div class="col-start-1 row-span-10 flex h-full flex-col justify-between">
      <div
        v-for="n in 10"
        :key="'top-' + n"
        class="xs:text-xl flex flex-1 items-center justify-start font-medium text-gray-700"
      >
        {{ n }}
      </div>
    </div>

    <div
      class="relative col-span-10 row-span-10 flex flex-1 items-center justify-center"
    >
      <slot></slot>

      <div class="absolute w-[120%]">
        <img
          src="../../../assets/img/border.png"
          alt="border"
          class="w-full"
          style="image-rendering: pixelated"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
