<template>
  <span
    v-if="!editing && props.value.length > 0"
    class="cursor-pointer w-full block h-6"
    @click="editing = true"
  >
    {{ props.value }}
  </span>
  <input
    v-else
    ref="cell"
    class="bg-slate-700 text-white w-full"
    :value="props.value"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { onClickOutside, onKeyStroke } from '@vueuse/core'

const props = defineProps({
  value: { type: String, required: true }
})
const emit = defineEmits(['input'])

const editing = ref(false)

const cell = ref()

onKeyStroke('Enter', handleEdit)
onClickOutside(cell, handleEdit)

function handleEdit() {
  editing.value = false
  if (cell.value) {
    const cellValue = (cell.value as HTMLInputElement).value
    if (cellValue) {
      emit('input', cellValue)
    }
  }
}
</script>
