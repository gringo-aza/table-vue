import axios from 'axios';
import useTokenStore from '@/stores/TokenStore.js';

const { TokenStore } = useTokenStore();

console.log('TokenStore', TokenStore);

const instance = axios.create({
  baseURL: import.meta.env.VITE_ACCESS_API
});

instance.interceptors.request.use(
  function (config) {
    if (TokenStore.value.access_token) {
      config.headers.Authorization = `Bearer ${TokenStore.value.access_token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status == 401) {
      TokenStore.value = null;
    }
    console.log('error in axios', error);
    return Promise.reject(error);
  }
);

export default instance;
