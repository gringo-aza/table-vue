<template>
  <nav class="flex gap-4 justify-between items-center p-4 bg-gray-100">
    <RouterLink to="/">
      <span class="font-bold">Business</span>
    </RouterLink>
    <n-button type="error" @click="logOut">logout</n-button>

  </nav>
</template>

<script setup>
import { NButton, NForm, NInput, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router'
const router = useRouter()

const logOut = () => {
  router.push('/login');
}


</script>

<style scoped>

</style>