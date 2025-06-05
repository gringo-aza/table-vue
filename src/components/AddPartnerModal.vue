<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    title="Add Partner"
    :bordered="false"
    size="huge"
    @close="handleClose"
  >
    <n-space vertical>
      <n-input
        v-model:value="localPostParams.cardCode"
        class="my-2"
        type="text"
        placeholder="Card code"
        :status="errors.cardCode ? 'error' : ''"
        :status-message="errors.cardCode ? 'Card code is required' : ''"
      />
      <n-input
        v-model:value="localPostParams.cardName"
        class="my-2"
        type="text"
        placeholder="Card name"
        :status="errors.cardName ? 'error' : ''"
        :status-message="errors.cardName ? 'Card name is required' : ''"
      />
      <n-input
        v-model:value="localPostParams.phone1"
        class="my-2"
        type="text"
        placeholder="Phone"
        :status="errors.phone1 ? 'error' : ''"
        :status-message="errors.phone1 ? 'Phone is required' : ''"
      />
      <n-input
        v-model:value="localPostParams.address"
        class="my-2"
        type="text"
        placeholder="Address"
        :status="errors.address ? 'error' : ''"
        :status-message="errors.address ? 'Address is required' : ''"
      />
      <n-select
        v-model:value="localPostParams.valid"
        class="my-2"
        :options="optionsSelect"
        placeholder="Is valid"
        clearable
        :status="errors.valid ? 'error' : ''"
        :status-message="errors.valid ? 'Please select validity' : ''"
      />
      <n-select
        v-model:value="localPostParams.currency"
        class="my-2"
        :options="optionsSelectCurrency"
        placeholder="Currency"
        clearable
        :status="errors.currency ? 'error' : ''"
        :status-message="errors.currency ? 'Please select currency' : ''"
      />
      <n-input
        v-model:value="localPostParams.groupCode"
        class="my-2"
        type="text"
        placeholder="Group code"
        :status="errors.groupCode ? 'error' : ''"
        :status-message="errors.groupCode ? 'Group code is required' : ''"
      />
    </n-space>

    <template #footer>
      <div class="w-full flex justify-between">
        <n-button class="w-32" type="error" @click="handleClose">
          Cancel
        </n-button>
        <n-button class="w-32" type="success" @click="handleSave">
          Save
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { watch, reactive, toRefs } from 'vue';
import { NButton, NInput, NModal, NSelect, NSpace } from 'naive-ui';

const props = defineProps({
  show: Boolean,
  postParams: Object,
  errors: Object,
  optionsSelect: Array,
  optionsSelectCurrency: Array,
  bodyStyle: Object
});

const emit = defineEmits(['update:show', 'update:postParams', 'save', 'close']);

const localPostParams = reactive({ ...props.postParams });

watch(
  () => props.postParams,
  (newVal) => {
    Object.assign(localPostParams, newVal);
  }
);

watch(
  localPostParams,
  (newVal) => {
    emit('update:postParams', { ...newVal });
  },
  { deep: true }
);

function handleClose() {
  emit('update:show', false);
  emit('close');
}

function handleSave() {
  emit('save');
}
</script>
