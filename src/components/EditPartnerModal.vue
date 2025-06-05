<script setup lang="ts">
const emit = defineEmits(['update:show', 'save']);
import { NButton, NInput, NModal, NSelect, NSpace } from 'naive-ui';


const { show, form, errors, optionsSelect, bodyStyle } = defineProps<{
  show: boolean;
  form: any;
  errors: Record<string, string>;
  optionsSelect: any[];
  bodyStyle?: Record<string, string>;
}>();

const onClose = () => emit('update:show', false);
const onSave = () => emit('save');
</script>

<template>
  <n-modal
    :show="show"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    title="Edit Partner"
    size="huge"
    :bordered="false"
    @close="onClose"
  >
    <n-space vertical>
      <n-input v-model:value="form.cardName" placeholder="Card name"
               :status="errors.cardName ? 'error' : ''"
               :status-message="errors.cardName" />
      <n-input v-model:value="form.groupCode" placeholder="Group code"
               :status="errors.groupCode ? 'error' : ''"
               :status-message="errors.groupCode" />
      <n-input v-model:value="form.address" placeholder="Address"
               :status="errors.address ? 'error' : ''"
               :status-message="errors.address" />
      <n-select v-model:value="form.valid" :options="optionsSelect" placeholder="Is valid" clearable
                :status="errors.valid ? 'error' : ''"
                :status-message="errors.valid" />
      <n-input v-model:value="form.phone1" placeholder="Phone"
               :status="errors.phone1 ? 'error' : ''"
               :status-message="errors.phone1" />
    </n-space>

    <template #footer>
      <div class="w-full flex justify-between">
        <n-button class="w-32" type="error" @click="onClose">Cancel</n-button>
        <n-button class="w-32" type="success" @click="onSave">Save</n-button>
      </div>
    </template>
  </n-modal>
</template>
