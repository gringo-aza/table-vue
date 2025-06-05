<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <n-form @submit.prevent="handleLogin" ref="formRef">
        <div class="mb-4">
          <label class="block mb-1 font-medium" for="login">Login</label>
          <n-input
            id="login"
            v-model:value="loginParams.login"
            type="text"
            placeholder="Enter your login"
            :status="loginError && !loginParams.login ? 'error' : undefined"
          />
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-medium" for="password">Password</label>
          <n-input
            id="password"
            v-model:value="loginParams.password"
            type="password"
            show-password-on="click"
            placeholder="Enter your password"
            :status="loginError && !loginParams.password ? 'error' : undefined"
          />
        </div>

        <n-button
          type="primary"
          class="w-full"
          @click="handleLogin"
          :loading="loading"
          icon-placement="left"
        >
          Login
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { NButton, NForm, NInput, useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/UserStore.js';
import { usePlacementStore } from '@/stores/PlacementStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const message = useMessage();

const formRef = ref(null);
const loading = ref(false);

const loginParams = ref({
  login: '',
  password: '',
});

const authStore = useUserStore();
const placementStore = usePlacementStore();
placementStore.placementFunc('bottom');

const handleLogin = async () => {
  if (!loginParams.value.login || !loginParams.value.password) {
    message.error('Please fill in all fields!');
    return;
  }

  loading.value = true;
  const result = await authStore.Login(loginParams.value);
  if (result && result.code === 200) {
    message.success('Login successful!');
    localStorage.setItem('loginData', JSON.stringify(result.data));
    router.push('/home');
  } else if (authStore.loginError) {
    message.error(authStore.loginError);
  } else {
    message.error('An unknown error occurred!');
  }

  loading.value = false;
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
