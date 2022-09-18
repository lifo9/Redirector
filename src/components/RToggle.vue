<template>
  <label class="flex items-center cursor-pointer relative">
    <input
      type="checkbox"
      class="sr-only"
      :value="props.value"
      :checked="props.value"
      @change="emit('change', ($event.target! as HTMLInputElement).checked)"
    />
    <div
      class="toggle-bg bg-slate-300 border-2 border-slate-200 h-6 w-11 rounded-full"
    ></div>
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  value: { type: Boolean, required: true }
})

const emit = defineEmits(['change'])
</script>

<style scoped>
.toggle-bg:after {
  content: '';
  @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
}
input:checked + .toggle-bg:after {
  transform: translateX(100%);
  @apply border-white;
}
input:checked + .toggle-bg {
  @apply bg-green-600 border-green-600;
}
</style>
