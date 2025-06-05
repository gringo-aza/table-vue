import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const usePlacementStore = defineStore('placementStore', () => {
  const placementRef = ref('top')
  const loading = ref(false)

  const placementFunc = async (params) => {
    loading.value = true

    placementRef.value = params

    loading.value = false
  }

  return {
    placementRef,
    placementFunc,
    usePlacementStore
  }
})
