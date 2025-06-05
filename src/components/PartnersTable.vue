<template>
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
        <abbr title="Edit">Edit</abbr>
        <abbr title="Remove">Del</abbr>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="bp in partners" :key="bp.cardCode">
      <td>{{ bp.cardCode }}</td>
      <td><n-ellipsis>{{ bp.cardName || '—' }}</n-ellipsis></td>
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
          <n-icon class="cursor-pointer" @click="$emit('edit', bp)">
            <!-- edit icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"/>
              <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3"/>
              <path d="M16 5l3 3"/>
            </svg>
          </n-icon>
          <n-icon class="cursor-pointer" @click="$emit('remove', bp)">
            <!-- remove icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red">
              <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41L19.59 22L21 20.59L18.41 18L21 15.41L19.59 14L17 16.59L14.41 14L13 15.41L15.59 18L13 20.59L14.41 22z"/>
            </svg>
          </n-icon>
        </n-space>
      </td>
    </tr>
    </tbody>
  </n-table>
</template>

<script setup>
import { NIcon, NSpace, NTable } from 'naive-ui';

defineProps({
  partners: {
    type: Array,
    required: true
  }
});
defineEmits(['edit', 'remove']);
</script>
