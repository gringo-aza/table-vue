<template>
  <main class="flex justify-center items-center mt-4">
    <n-spin :show="loading">
      <div class="p-4 w-full max-w-6xl">
        <h2 class="text-lg font-bold mb-4">Partners</h2>
        <div class="flex justify-between items-center mb-4">
          <div>
            <n-input
              v-model:value="textValue"
              type="text"
              placeholder="Search by card code"
              class="mr-4"
              style="width: 200px;"
            />
            <n-input
              v-model:value="paramsPartners.cardName"
              type="text"
              placeholder="Search by card name"
              class="mr-4"
              style="width: 200px;"
            />
            <n-input
              v-model:value="paramsPartners.address"
              type="text"
              placeholder="Search by address"
              class="mr-4"
              style="width: 200px;"
            />
          </div>

          <n-button type="success" @click="showAddModal">
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </g>
              </svg>
            </n-icon>
            <span class="ml-2">Add</span>
          </n-button>
        </div>

        <!-- Table -->

        <PartnersTable :partners="partners" @edit="openEditModal" @remove="openRemoveModal" />


        <div v-if="!partners.length && !loading" class="text-gray-500 mt-4">
          No data available.
        </div>

        <!-- Modal: Add Partner -->
        <AddPartnerModal
          v-model:show="showModal"
          v-model:postParams="postParams"
          :errors="errors"
          :optionsSelect="optionsSelect"
          :optionsSelectCurrency="optionsSelectCurrency"
          :bodyStyle="{ width: '600px' }"
          @save="addItemBusiness"
          @close="resetForm"
        />

        <!-- Modal: Edit Partner -->

        <EditPartnerModal
          v-model:show="editModal"
          :form="editParams"
          :errors="errors"
          :optionsSelect="optionsSelect"
          :bodyStyle="bodyStyle"
          @close="resetForm"
          @save="editItemBusiness"
        />

        <!-- Modal: remove Partner -->
        <n-modal
          v-model:show="confirmDeleteModal"
          class="custom-card"
          preset="dialog"
          title="Confirm Deletion"
          :bordered="false"
          size="medium"
          :closable="false"
        >
          <template #default>
            <div class="text-base">
              Are you sure you want to delete this partner?
            </div>
          </template>

          <template #action>
            <n-space justify="end">
              <n-button @click="confirmDeleteModal = false" tertiary>
                Cancel
              </n-button>
              <n-button type="error" @click="handleDelete">
                Yes, Delete
              </n-button>
            </n-space>
          </template>
        </n-modal>


      </div>
    </n-spin>
  </main>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { NButton, NIcon, NInput, NModal, NSelect, NSpace, NSpin, NTable, useMessage } from 'naive-ui';
import { useBusinessPartnersStore } from '@/stores/BusinessPartnersStore.js';
import PartnersTable from '@/components/PartnersTable.vue';
import AddPartnerModal from '@/components/AddPartnerModal.vue';
import EditPartnerModal from '@/components/EditPartnerModal.vue';

const partnersStore = useBusinessPartnersStore();


import { usePartners } from '@/composables/usePartners.js';

const {
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
} = usePartners();


const showModal = ref(false);


const optionsSelect = [
  { label: 'Yes', value: 'tYES' },
  { label: 'No', value: 'tNO' }
];

const optionsSelectCurrency = [
  { label: 'Rubl', value: 'руб' },
  { label: 'Som', value: 'som' },
  { label: 'Dollar', value: 'dollar' }
];



const bodyStyle = ref({ width: '400px' });
const message = useMessage();


const textValue = ref('');
const nameValue = ref('');
const editModal = ref(false);
const confirmDeleteModal = ref(false);
const handleDeleteData = ref(null);

const showAddModal = () => {
  showModal.value = true;
};

const openEditModal = (item) => {
  console.log('item', item);
  editParams.value.cardName = item.cardName;
  editParams.value.cardCode = item.cardCode;
  editParams.value.phone1 = item.phone1;
  editParams.value.valid = item.valid;
  editParams.value.groupCode = item.groupCode;
  editParams.value.address = item.address;
  editModal.value = true;
};

const openRemoveModal = (item) => {
  console.log(item);
  handleDeleteData.value = item;
  confirmDeleteModal.value = true;
};

const handleDelete = async () => {
  loading.value = true;

  try {
    await partnersStore.PartnersDelete(handleDeleteData.value, mainData.value.token);

    if (!partnersStore.partnersDeleteError) {
      message.success('Partner successfully deleted!');
      closeModal();

      await partnersStore.Partners(paramsPartners.value, mainData.value); // reload updated list
      partners.value = partnersStore?.partnersData?.data?.data || [];
    } else {
      message.error('Failed to delete partner.');
    }

  } catch (error) {
    console.error('Delete error:', error);
    message.error('Something went wrong while deleting.');
  } finally {
    loading.value = false;
  }
};



const closeModal = () => {
  showModal.value = false;
  editModal.value = false;
  confirmDeleteModal.value = false;
  resetForm();
};

const addItemBusiness = async () => {
  errors.value.cardCode = !postParams.value.cardCode.trim();
  errors.value.cardName = !postParams.value.cardName.trim();
  errors.value.phone1 = !postParams.value.phone1.trim();
  errors.value.valid = !postParams.value.valid;
  errors.value.currency = !postParams.value.currency;
  errors.value.groupCode = !postParams.value.groupCode.trim();

  if (Object.values(errors.value).some(err => err)) {
    message.error('Please fill in all required fields.');
    return;
  }

  try {
    await partnersStore.PartnersAdd(postParams.value, mainData.value);
    message.success('Partner added!');
    showModal.value = false;

    await partnersStore.Partners(paramsPartners.value, mainData.value);
    partners.value = partnersStore?.partnersData?.data?.data || [];

    resetForm();
  } catch (error) {
    message.error('Failed to add partner.');
    console.error(error);
  }
};

const validateForm = () => {
  errors.value.cardName = !editParams.value.cardName;
  errors.value.groupCode = !editParams.value.groupCode;
  errors.value.valid = !editParams.value.valid;
  errors.value.phone1 = !editParams.value.phone1;
  errors.value.address = !editParams.value.address;

  return (
    !errors.value.cardName &&
    !errors.value.groupCode &&
    !errors.value.valid &&
    !errors.value.phone1 &&
    !errors.value.address
  );
};

const editItemBusiness = async () => {
  if (!validateForm()) {
    message.error('There are errors in the form.');
    console.log('editParams with error', editParams.value);
    return;
  }

  try {
    const response = await partnersStore.PartnersEdit(editParams.value, mainData.value.token);

    console.log('partnersStore.partnersError.length', partnersStore.partnersError.length);
    if (!partnersStore.partnersError.length) {
      message.success('Partner updated!');
      await partnersStore.Partners(paramsPartners.value, mainData.value); // get updated data
      partners.value = partnersStore?.partnersData?.data?.data || [];
      closeModal();
    } else {
      message.error('Failed to update partner.');
      console.warn('Edit response not successful:', response);
    }

  } catch (error) {
    message.error('Failed to edit partner.');
    console.error(error);
  }
};



// Debounced search function
const debouncedSearch = debounce(async (val, params) => {
  if (!val) {
    loading.value = true;
    try {
      await partnersStore.Partners(paramsPartners.value, mainData.value);
      partners.value = partnersStore?.partnersData?.data?.data || [];
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
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



watch(
  () => textValue.value,
  newTextValue => {
    debouncedSearch(newTextValue);
  }
);

watch(
  () => paramsPartners.value,
  newTextValue => {
    debouncedSearch();
  },{
    deep: true
  }
);

watch(() => partnersStore.partnersError, async (err) => {
  if (err?.length > 3) {
    message.error(err || 'Partners error');
    loading.value = false;
  } else if (!err?.length) {
    loading.value = true;
    try {
      await partnersStore.Partners(paramsPartners.value, mainData.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
  }
});

watch(() => partnersStore.partnersData, (data) => {
  if (data?.status === '200') {
    message.success('Partners loaded successfully!');
    partners.value = data?.data?.data || [];
    loading.value = false;
  }
});

onMounted(async () => {
  const localData = localStorage.getItem('loginData');
  if (localData) {
    mainData.value = JSON.parse(localData);
    postParams.value.token = mainData.value.token;
    loading.value = true;
    try {
      await partnersStore.Partners(paramsPartners.value, mainData.value);
      partners.value = partnersStore?.partnersData?.data?.data || [];
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      loading.value = false;
    }
  }
});
</script>
