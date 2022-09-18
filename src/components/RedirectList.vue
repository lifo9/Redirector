<template>
  <div>
    <div
      class="flex gap-2 p-3.5 mb-4 text-center bg-blue-600 rounded-sm text-xl justify-center items-center cursor-pointer select-none"
      @click="handleSaveRules"
    >
      Save rules <SaveIcon />
    </div>
    <RTable :columns="columns" :data="data">
      <template #filter="{ item }">
        <EditRule
          :value="item.filter"
          @input="handleUpdateRule({ id: item.id, filter: $event })"
        />
      </template>
      <template #redirectUrl="{ item }">
        <EditRule
          :value="item.redirectUrl"
          @input="handleUpdateRule({ id: item.id, redirectUrl: $event })"
        />
      </template>
      <template #active="{ item }">
        <RToggle
          :value="item.active"
          @change="handleUpdateRule({ id: item.id, active: $event })"
        />
      </template>
      <template #actions="{ item }"
        ><DeleteAction
          class="w-full mx-auto"
          @click="handleDeleteRule(item.id)"
      /></template>
    </RTable>
    <div
      class="flex gap-2 p-3.5 mt-4 text-center bg-green-900 rounded-sm text-xl justify-center items-center cursor-pointer select-none"
      @click="createRule"
    >
      Add rule <PlusIcon />
    </div>
  </div>
</template>

<script lang="ts" setup>
import RTable, { type Columns } from '@/components/RTable.vue'
import type { RedirectList, RedirectItem, RedirectItemUpdate } from '@/types'
import { onMounted, ref, type Ref } from 'vue'
import RToggle from '@/components/RToggle.vue'
import DeleteAction from '@/components/DeleteAction.vue'
import {
  deleteRule,
  getRedirects,
  saveRedirects
} from '@/services/RedirectService'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'
import EditRule from '@/components/EditRule.vue'

const columns: Columns = {
  id: { label: 'ID', align: 'center', shrink: true },
  filter: { label: 'Filter', width: '50%' },
  redirectUrl: { label: 'Redirect URL', width: '50%' },
  active: { label: 'Active', align: 'center', shrink: true },
  actions: { label: 'Actions', align: 'center', shrink: true }
}

const data: Ref<RedirectList> = ref([])

onMounted(() => {
  loadRules()
})

async function loadRules() {
  data.value = await getRedirects()
}

async function createRule() {
  const lastRule = data.value[data.value.length - 1]

  const blankRule: RedirectItem = {
    id: lastRule ? lastRule.id + 1 : 1,
    filter: '',
    redirectUrl: '',
    active: false
  }

  data.value.push(blankRule)
}

async function handleUpdateRule({
  id,
  filter = undefined,
  redirectUrl = undefined,
  active = undefined
}: RedirectItemUpdate) {
  const rule = data.value.find((rule) => rule.id === id)

  if (rule) {
    data.value.splice(rule.id - 1, 1, {
      id: id,
      filter: filter ? filter : rule.filter,
      redirectUrl: redirectUrl ? redirectUrl : rule.redirectUrl,
      active: active !== undefined ? active : rule.active
    })
  }
}

async function handleSaveRules() {
  const filters = data.value
    .filter((rule) => rule.filter.length > 0)
    .map((rule) => rule.filter)

  // Permissions must be requested from inside a user gesture, like a button's
  // click handler.
  try {
    // eslint-disable-next-line no-undef
    chrome.permissions.request(
      {
        origins: filters
      },
      (granted: boolean) => {
        if (granted) {
          saveRedirects(data.value)
        }
      }
    )
  } catch (e) {
    alert(`Invalid filters: ${filters.join(' | ')}`)
  }
}

async function handleDeleteRule(id: number) {
  await deleteRule(id)
  await loadRules()
}
</script>
