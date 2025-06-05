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
        <n-table :bordered="true" :single-line="false">
          <thead>
          <tr>
            <th>Card Code</th>
            <th>Card Name</th>
            <th>Card Type</th>
            <th>Currency</th>
            <th>Default Currency</th>
            <th>Group Code</th>
            <th>Is Valid</th>
            <th>Current Account Balance</th>
            <th>Phone</th>
            <th>Address</th>
            <th>
              <abbr title="Edit">
                Edit
              </abbr>
              <abbr title="Remove">
                Del
              </abbr>
            </th>

          </tr>
          </thead>
          <tbody>
          <tr v-for="bp in partners" :key="bp.cardCode">
            <td>{{ bp.cardCode }}</td>
            <td>{{ bp.cardName || '—' }}</td>
            <td>{{ bp.cardType }}</td>
            <td>{{ bp.currency }}</td>
            <td>{{ bp.defaultCurrency || '—' }}</td>
            <td>{{ bp.groupCode || '—' }}</td>
            <td>{{ bp.valid || '—' }}</td>
            <td>{{ bp.currentAccountBalance || '—' }}</td>
            <td>{{ bp.phone1 || '—' }}</td>
            <td>{{ bp.address || '—' }}</td>
            <td>
              <n-space justify="end">
                <n-icon class="cursor-pointer" @click="openEditModal(bp)">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round">
                      <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"></path>
                      <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3"></path>
                      <path d="M16 5l3 3"></path>
                    </g>
                  </svg>
                </n-icon>
                <n-icon class="cursor-pointer" @click="openRemoveModal(bp)">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 24 24">
                    <path
                      d="M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41L19.59 22L21 20.59L18.41 18L21 15.41L19.59 14L17 16.59L14.41 14L13 15.41L15.59 18L13 20.59L14.41 22z"
                      fill="red"></path>
                  </svg>
                </n-icon>
              </n-space>
            </td>
          </tr>
          </tbody>
        </n-table>

        <div v-if="!partners.length && !loading" class="text-gray-500 mt-4">
          No data available.
        </div>

        <!-- Modal: Add Partner -->
        <n-modal
          v-model:show="showModal"
          class="custom-card"
          preset="card"
          :style="bodyStyle"
          title="Add Partner"
          :bordered="false"
          size="huge"
          @close="resetForm"
        >
          <n-space vertical>
            <n-input
              class="my-2"
              v-model:value="postParams.cardCode"
              type="text"
              placeholder="Card code"
              :status="errors.cardCode ? 'error' : ''"
              :status-message="errors.cardCode ? 'Card code is required' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="postParams.cardName"
              type="text"
              placeholder="Card name"
              :status="errors.cardName ? 'error' : ''"
              :status-message="errors.cardName ? 'Card name is required' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="postParams.phone1"
              type="text"
              placeholder="Phone"
              :status="errors.phone1 ? 'error' : ''"
              :status-message="errors.phone1 ? 'Phone is required' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="postParams.address"
              type="text"
              placeholder="Address"
              :status="errors.address ? 'error' : ''"
              :status-message="errors.address ? 'Address is required' : ''"
            />
            <n-select
              class="my-2"
              v-model:value="postParams.valid"
              :options="optionsSelect"
              placeholder="Is valid"
              clearable
              :status="errors.valid ? 'error' : ''"
              :status-message="errors.valid ? 'Please select validity' : ''"
            />
            <n-select
              class="my-2"
              v-model:value="postParams.currency"
              :options="optionsSelectCurrency"
              placeholder="Currency"
              clearable
              :status="errors.currency ? 'error' : ''"
              :status-message="errors.currency ? 'Please select currency' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="postParams.groupCode"
              type="text"
              placeholder="Group code"
              :status="errors.groupCode ? 'error' : ''"
              :status-message="errors.groupCode ? 'Group code is required' : ''"
            />
          </n-space>

          <template #footer>
            <div class="w-full flex justify-between">
              <n-button class="w-32" type="error" @click="closeModal">
                Cancel
              </n-button>
              <n-button class="w-32" type="success" @click="addItemBusiness">
                Save
              </n-button>
            </div>
          </template>
        </n-modal>

        <!-- Modal: Edit Partner -->
        <n-modal
          v-model:show="editModal"
          class="custom-card"
          preset="card"
          :style="bodyStyle"
          title="Add Partner"
          :bordered="false"
          size="huge"
          @close="resetForm"
        >
          <n-space vertical>

            <n-input
              class="my-2"
              v-model:value="editParams.cardName"
              type="text"
              placeholder="Card name"
              :status="errors.cardName ? 'error' : ''"
              :status-message="errors.cardName ? 'Card name is required' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="editParams.groupCode"
              type="text"
              placeholder="Group code"
              :status="errors.phone1 ? 'error' : ''"
              :status-message="errors.phone1 ? 'Group code is required' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="editParams.address"
              type="text"
              placeholder="Address code"
              :status="errors.address ? 'error' : ''"
              :status-message="errors.address ? 'Address code is required' : ''"
            />
            <n-select
              class="my-2"
              v-model:value="editParams.valid"
              :options="optionsSelect"
              placeholder="Is valid"
              clearable
              :status="errors.valid ? 'error' : ''"
              :status-message="errors.valid ? 'Please select validity' : ''"
            />
            <n-input
              class="my-2"
              v-model:value="editParams.phone1"
              type="text"
              placeholder="Phone"
              :status="errors.cardCode ? 'error' : ''"
              :status-message="errors.cardCode ? 'phone is required' : ''"
            />
          </n-space>
          <template #footer>
            <div class="w-full flex justify-between">
              <n-button class="w-32" type="error" @click="closeModal">
                Cancel
              </n-button>
              <n-button class="w-32" type="success" @click="editItemBusiness">
                Save
              </n-button>
            </div>
          </template>
        </n-modal>

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

const partnersStore = useBusinessPartnersStore();

const bodyStyle = ref({ width: '400px' });
const loading = ref(false);
const message = useMessage();

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
  address: '',
  cardName: '',
  groupCode: '',
  valid: null,
  phone1: '',
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

const partners = ref([]);
const textValue = ref('');
const nameValue = ref('');
const showModal = ref(false);
const editModal = ref(false);
const confirmDeleteModal = ref(false);
const mainData = ref(null);
const handleDeleteData = ref(null);

const optionsSelect = ref([
  { label: 'Yes', value: 'tYES' },
  { label: 'No', value: 'tNO' },
]);

const optionsSelectCurrency = ref([
  { label: 'rubl', value: 'руб' },
  { label: 'som', value: 'som' },
  { label: 'dollar', value: 'dollar' },
]);

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


const resetForm = () => {
  // Clear fields
  postParams.value = {
    cardCode: '',
    cardName: '',
    phone1: '',
    valid: null,
    currency: null,
    groupCode: '',
    token: postParams.value.token, // keep token
  };

  postParams.value = {
    cardCode: '',
    cardName: '',
    groupCode: '',
    valid: null,
    phone1: '',
  };
  // Clear errors
  Object.keys(errors.value).forEach(key => (errors.value[key] = false));
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

const paramsPartners = ref({
  cardName: "",
  phone1: "",
  address: "",
  skip: "",
  limit: "20",
})


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
