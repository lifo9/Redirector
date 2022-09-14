<script setup lang="ts">
function handlePermissions() {
  chrome.permissions.request(
    { origins: ['https://filo.dev/*'] },
    function (granted) {
      console.log('permision:', granted)
    }
  )
}
</script>

<template>
  <div
    class="flex flex-col h-screen overflow-hidden bg-gray-800 w-screen p-4 text-white"
  >
    <header class="w-full text-center p-4">
      <h1 class="text-3xl font-bold tracking-wider">REDIRECTOR</h1>
    </header>
    <main class="flex-1 overflow-y-auto max-w-5xl w-full mx-auto">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="handlePermissions"
      >
        CLICK ME!
      </button>
    </main>
    <footer class="w-full text-center p-4">
      <p class="text-sm">
        Created by
        <a class="text-blue-400" href="https://filo.dev">Jakub Filo</a>
      </p>
    </footer>
  </div>
</template>

<style>
@import '@/assets/main.css';
</style>
