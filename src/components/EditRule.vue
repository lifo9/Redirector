<template>
  <span
    v-show="!editing"
    class="cursor-pointer w-full block h-6"
    @click="editMode"
  >
    {{ props.value }}
  </span>
  <input
    v-show="editing"
    v-on:keydown.exact.tab="focusNext"
    v-on:keydown.shift.tab="focusPrevious"
    class="bg-slate-700 text-white w-full"
    :value="props.value"
    :placeholder="placeholder"
    ref="input"
    @input="handleEdit"
  />
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyPressed } from '@vueuse/core'
import { nextTick, ref } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['input'])

const editing = ref(false)
const input = ref()

onClickOutside(input, viewMode)
onKeyPressed('Enter', viewMode)

function focusNext(e: Event) {
  if (e.target) {
    const netxTd = (e.target as HTMLInputElement).parentElement
      ?.nextElementSibling

    focusElement(netxTd)
  }
}

function focusPrevious(e: Event) {
  if (e.target) {
    const prevTd = (e.target as HTMLInputElement).parentElement
      ?.previousElementSibling

    focusElement(prevTd)
  }
}

function focusElement(element: Element | null | undefined) {
  if ((element?.children[1] as HTMLInputElement)?.type === 'text') {
    ;(element?.children[0] as HTMLSpanElement)?.click()
    window.setTimeout(function () {
      ;(element?.children[1] as HTMLInputElement)?.focus()
    }, 0)
  }
}

function viewMode() {
  editing.value = false
}

function editMode() {
  editing.value = true

  if (editing.value === true) {
    nextTick(() => {
      ;(input.value! as HTMLInputElement).focus()
    })
  }
}

function handleEdit(event: Event) {
  emit('input', (event.target as HTMLInputElement).value)
}
</script>
