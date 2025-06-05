import { ref, watch, onMounted } from 'vue';
import debounce from 'lodash.debounce';
import { useBusinessPartnersStore } from '@/stores/BusinessPartnersStore';
import { useMessage } from 'naive-ui';

export function usePartners() {
  const partnersStore = useBusinessPartnersStore();
  const message = useMessage();
  const partners = ref([]);
  const mainData = ref(null);
  const loading = ref(false);

  const postParams = ref({
    cardCode: '',
    cardName: '',
    phone1: '',
    valid: null,
    currency: null,
    groupCode: '',
    token: '',
    address: '',
  });

  const editParams = ref({
    cardCode: '',
    cardName: '',
    phone1: '',
    valid: null,
    groupCode: '',
    address: '',
  });

  const paramsPartners = ref({
    cardName: '',
    phone1: '',
    address: '',
    skip: '',
    limit: '20',
  });

  const errors = ref({
    cardCode: false,
    cardName: false,
    phone1: false,
    valid: false,
    currency: false,
    address: false,
    groupCode: false,
  });

  const fetchPartners = async () => {
    try {
      loading.value = true;
      await partnersStore.Partners(paramsPartners.value, mainData.value);
      partners.value = partnersStore?.partnersData?.data?.data || [];
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const searchPartners = debounce(async (val) => {
    if (!val) {
      await fetchPartners();
    } else if (val.length > 3) {
      loading.value = true;
      try {
        await partnersStore.PartnersById(val, mainData.value);
        const found = partnersStore?.partnersData?.data?.data;
        partners.value = found ? [found] : [];
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    }
  }, 500);

  const validateAddForm = () => {
    errors.value.cardCode = !postParams.value.cardCode.trim();
    errors.value.cardName = !postParams.value.cardName.trim();
    errors.value.phone1 = !postParams.value.phone1.trim();
    errors.value.valid = !postParams.value.valid;
    errors.value.currency = !postParams.value.currency;
    errors.value.groupCode = !postParams.value.groupCode.trim();
    return !Object.values(errors.value).some(Boolean);
  };

  const validateEditForm = () => {
    errors.value.cardName = !editParams.value.cardName;
    errors.value.groupCode = !editParams.value.groupCode;
    errors.value.valid = !editParams.value.valid;
    errors.value.phone1 = !editParams.value.phone1;
    errors.value.address = !editParams.value.address;
    return !Object.values(errors.value).some(Boolean);
  };

  const addItem = async () => {
    if (!validateAddForm()) {
      message.error('Please fill in all required fields.');
      return;
    }
    try {
      await partnersStore.PartnersAdd(postParams.value, mainData.value);
      message.success('Partner added!');
      await fetchPartners();
      resetForm();
    } catch {
      message.error('Failed to add partner.');
    }
  };

  const editItem = async () => {
    if (!validateEditForm()) {
      message.error('Please fill in all required fields.');
      return;
    }
    try {
      await partnersStore.PartnersEdit(editParams.value, mainData.value.token);
      message.success('Partner updated!');
      await fetchPartners();
      resetForm();
    } catch {
      message.error('Failed to edit partner.');
    }
  };

  const resetForm = () => {
    postParams.value = { ...postParams.value, cardCode: '', cardName: '', phone1: '', valid: null, currency: null, groupCode: '', address: '' };
    editParams.value = { cardCode: '', cardName: '', phone1: '', valid: null, groupCode: '', address: '' };
    Object.keys(errors.value).forEach((key) => (errors.value[key] = false));
  };

  onMounted(() => {
    const localData = localStorage.getItem('loginData');
    if (localData) {
      mainData.value = JSON.parse(localData);
      postParams.value.token = mainData.value.token;
      fetchPartners();
    }
  });

  return {
    partners,
    postParams,
    editParams,
    errors,
    searchPartners,
    addItem,
    editItem,
    resetForm,
    loading,
    mainData,
    paramsPartners,
  };
}
