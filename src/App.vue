<script setup>
import { RouterView } from 'vue-router';
import {NMessageProvider, NModalProvider} from 'naive-ui'
import { usePlacementStore } from '@/stores/PlacementStore.js'
const placementStore = usePlacementStore()

const themeOverrides = {
  common: {
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    primaryColor: '#3b82f6', // Tailwind blue-500
  },
};
</script>

<template>
  <n-message-provider :placement="'top'">
    <n-modal-provider>
    <div class="min-h-screen flex flex-col overflow-hidden bg-gray-50 text-gray-800 font-sans">
      <!-- Header -->
      <header class="shadow bg-white shrink-0 z-10">
        <router-view name="Navbar" />
      </header>

      <!-- Main content -->
      <main class="flex-1 overflow-hidden">
        <router-view name="Default" />
      </main>

      <footer class="bg-gray-100 text-center py-4 text-sm text-gray-500 shrink-0">
        <router-view name="Footer" />
      </footer>

    </div>
    </n-modal-provider>
  </n-message-provider>
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.h-screen {
  min-height: calc(100vh - 22px);

}
</style>
