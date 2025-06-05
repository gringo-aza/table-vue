import { ref } from 'vue';
import moment from 'moment';
import useTokenStore from '@/stores/TokenStore';

const expireDate = useTokenStore();
const currentDate = ref(moment().format('MM-DD-YYYY'));
const expireDateVar = ref(
  moment(expireDate.TokenStore.value.expires).format('MM-DD-YYYY')
);

export function useExpireCompare() {
  // If currentDate > expires
  // Logout()

  const intervalCompare = () => {
    setInterval(() => {
      if (currentDate.value !== expireDateVar.value) {
        console.log('worked!!!!');
      }
    }, 1000);
  };

  return {
    expireDateVar,
    currentDate,
    intervalCompare
  };
}
