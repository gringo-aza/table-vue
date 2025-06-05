import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('userStore', () => {
  const loginError = ref(null);
  const userData = ref(null);

  const Login = async (params) => {
    loginError.value = null;
    userData.value = null;
    try {
      const res = await axios.post('http://localhost:5149/api/accounts/login', {
        login: params.login,
        password: params.password,
      });
      userData.value = res.data;
      return res.data;
    } catch (error) {
      loginError.value = error?.response?.data?.message || 'Login failed';
      setTimeout(() => {
        loginError.value = null;
      }, 3000);
      return null;
    }
  };

  return {
    Login,
    loginError,
    userData,
  };
});
