<template>
  <table class="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th
          v-for="(column, key) in normalizedColumns"
          :key="key"
          class="p-3 font-bold text-left text-slate-300"
          :class="{
            'text-right': column.align === 'right',
            'text-center': column.align === 'center',
            'w-1 whitespace-nowrap': column.shrink
          }"
          :width="column.width"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="(item, index) in data" :key="index">
        <td
          v-for="(column, key) in normalizedColumns"
          :key="key"
          class="py-4 px-3 whitespace-nowrap"
          :class="{
            'text-right': column.align === 'right',
            'text-center': column.align === 'center',
            'w-1 whitespace-nowrap': column.shrink
          }"
        >
          <slot :name="key" v-bind="{ item }">
            {{ getCellValue(item, key) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup generic="RowType extends object">
import { computed } from 'vue'

export type Column = {
  label?: string
  placeholder?: string
  align?: 'left' | 'right' | 'center'
  width?: string
  shrink?: boolean
}

export type Columns = {
  [key: string]: string | Column
}

const props = withDefaults(
  defineProps<{
    columns?: Columns
    data?: RowType[]
  }>(),
  {
    columns: () => ({}),
    data: () => []
  }
)

function getCellValue(row: RowType, columnKey: string): unknown {
  return (row as Record<string, unknown>)[columnKey]
}

const normalizedColumns = computed<Record<string, Column>>(() =>
  Object.entries(props.columns).reduce<Record<string, Column>>(
    (accumulatedColumns, [columnKey, columnOptions]) => ({
      ...accumulatedColumns,
      [columnKey]:
        typeof columnOptions === 'string'
          ? { label: columnOptions }
          : columnOptions
    }),
    {}
  )
)
</script>

<style scoped>
@reference "tailwindcss";

tbody tr:hover {
  @apply bg-slate-700;
}
</style>
