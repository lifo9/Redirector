<template>
  <div>
    <div
      class="flex gap-2 p-3.5 mb-4 text-center bg-blue-600 rounded-sm text-xl justify-center items-center cursor-pointer select-none"
      @click="handleSaveRules"
    >
      Save rules <SaveIcon />
    </div>
    <RTable :columns="columns" :data="data">
      <template #origin="{ item }">
        <EditRule
          :value="item.origin"
          placeholder="https://domain.tld/*"
          @input="handleUpdateRule({ id: item.id, origin: $event })"
        />
      </template>
      <template #redirectHost="{ item }">
        <EditRule
          :value="item.redirectHost"
          placeholder="new-domain.tld"
          @input="handleUpdateRule({ id: item.id, redirectHost: $event })"
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
  getRedirects,
  saveRedirects,
  removeUnusedPermissions
} from '@/services/RedirectService'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'
import EditRule from '@/components/EditRule.vue'

const columns: Columns = {
  id: { label: 'ID', align: 'center', shrink: true },
  origin: { label: 'Origin', width: '50%' },
  redirectHost: { label: 'Redirect host', width: '50%' },
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

function createRule() {
  const lastRule = data.value[data.value.length - 1]

  const blankRule: RedirectItem = {
    id: lastRule ? lastRule.id + 1 : 1,
    origin: '',
    redirectHost: '',
    active: false
  }

  data.value.push(blankRule)
}

function handleUpdateRule({
  id,
  origin = undefined,
  redirectHost = undefined,
  active = undefined
}: RedirectItemUpdate) {
  const rule = data.value.find((rule) => rule.id === id)

  if (rule) {
    data.value.splice(rule.id - 1, 1, {
      id: id,
      origin: origin ? origin : rule.origin,
      redirectHost: redirectHost ? redirectHost : rule.redirectHost,
      active: active !== undefined ? active : rule.active
    })
  }
}

async function handleSaveRules() {
  const origins = data.value
    .filter((rule) => rule.origin.length > 0)
    .map((rule) => rule.origin)

  // Permissions must be requested from inside a user gesture, like a button's
  // click handler.
  // We cannot e.g. wrap the chrome.permissions.request into promise
  // or move this logic into RedirectService :(
  try {
    // eslint-disable-next-line no-undef
    chrome.permissions.request(
      {
        origins: origins
      },
      async (granted: boolean) => {
        if (granted) {
          await removeUnusedPermissions(origins)
          await saveRedirects(data.value)
        }
      }
    )
  } catch (e) {
    alert(`Invalid origins: ${origins.join(' | ')}`)
  }
}

async function handleDeleteRule(id: number) {
  data.value.splice(id - 1, 1)

  let counter = 1
  data.value = data.value.map((rule) => {
    return {
      ...rule,
      ...{ id: counter++ }
    }
  })
}
</script>
