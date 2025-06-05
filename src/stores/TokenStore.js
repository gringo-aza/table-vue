import { computed, watch } from 'vue';
import { useStorage } from '@vueuse/core';

const tokenLocalStore = useStorage('token', {}, undefined, {
  serializer: {
    read: (v) => (v ? JSON.parse(v) : null),
    write: (v) => JSON.stringify(v)
  }
});

const tokenStore = computed({
  get() {
    return tokenLocalStore.value;
  },
  set(val) {
    if (val == null) {
      tokenLocalStore.value = null;
      return (location.href = '/login');
    }
    tokenLocalStore.value = val;
  }
});

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === '{}';
};

export default function useTokenStore() {
  return {
    TokenStore: tokenStore
  };
}
