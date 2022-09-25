<template>
  <div
    class="flex flex-col h-screen overflow-hidden bg-slate-900 w-screen p-4 text-white"
  >
    <header class="w-full text-center p-4">
      <h1
        class="text-3xl font-bold tracking-wider flex justify-center items-center select-none"
      >
        REDIRECTOR <img class="ml-4 w-12 invert" src="/icon.png" />
      </h1>
    </header>
    <main class="flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
      <RedirectList class="mt-4" />
    </main>
    <footer class="w-full text-center p-4 select-none">
      <p class="text-sm">
        Created by
        <a class="text-blue-400" href="https://filo.dev">Jakub Filo</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import RedirectList from '@/components/RedirectList.vue'
</script>

<style>
@import '@/assets/main.css';
</style>
