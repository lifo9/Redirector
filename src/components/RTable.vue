<template>
  <table class="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th
          v-for="(column, key) in normalizedColumns"
          :key="key"
          class="p-3 font-bold text-left text-slate-300"
          :class="{
            'text-right': (column as any).align === 'right',
            'text-center': (column as any).align === 'center',
            'w-1 whitespace-nowrap': (column as any).shrink,
          }"
          :width="(column as any).width"
        >
          {{ (column as any).label }}
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
            'text-right': (column as any).align === 'right',
            'text-center': (column as any).align === 'center',
            'w-1 whitespace-nowrap': (column as any).shrink,
          }"
        >
          <slot :name="key" v-bind="{ item }">
            {{ item[key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from "vue";

export type Columns = {
  [key: string]:
    | string
    | {
        label?: string;
        placeholder?: string;
        align?: "left" | "right" | "center";
        width?: string;
        shrink?: boolean;
      };
};

export interface Props {
  columns?: Columns;
  data?: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => {
    return {};
  },
  data: () => [],
});

const normalizedColumns = computed((): Columns => {
  return Object.entries(props.columns!).reduce(
    (result: any, [key, options]: any) => ({
      ...result,
      [key]: typeof options === "string" ? { label: options } : options,
    }),
    {}
  );
});
</script>

<style scoped>
@reference "tailwindcss";

tbody tr:hover {
  @apply bg-slate-700;
}
</style>
