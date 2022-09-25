<template>
  <div>
    <div class="flex flex-wrap my-4 gap-4 md:gap-20 justify-between">
      <div class="flex flex-wrap my-4 gap-4 md:gap-20 justify-between">
        <input
          type="file"
          accept=".json"
          ref="importFile"
          class="hidden"
          @change="handleImport"
        />
        <div
          class="flex gap-2 p-3.5 text-center bg-yellow-700 rounded-sm text-xl justify-center items-center cursor-pointer select-none min-w-1/4"
          @click="importFile.click()"
        >
          Import rules <UploadIcon />
        </div>
        <div
          class="flex gap-2 p-3.5 text-center bg-red-900 rounded-sm text-xl justify-center items-center cursor-pointer select-none min-w-1/4"
          @click="
            downloadRules(
              JSON.stringify(data),
              `rules_${new Date().getTime()}.json`
            )
          "
        >
          Export rules <DownloadIcon />
        </div>
      </div>
      <div
        class="flex gap-2 p-3.5 text-center bg-blue-600 rounded-sm text-xl justify-center items-center cursor-pointer select-none min-w-1/4"
        @click="handleSaveRules"
      >
        Save rules <SaveIcon />
      </div>
    </div>
    <RTable :columns="columns" :data="data">
      <template #origin="{ item }">
        <EditRule
          :value="item.origin"
          placeholder="https://domain.tld/*"
          @input="handleUpdateRule({ id: item.id, origin: $event })"
        />
      </template>
      <template #newHost="{ item }">
        <EditRule
          :value="item.newHost"
          placeholder="new-domain.tld"
          @input="handleUpdateRule({ id: item.id, newHost: $event })"
        />
      </template>
      <template #pathRegex="{ item }">
        <EditRule
          :value="item.pathRegex"
          @input="handleUpdateRule({ id: item.id, pathRegex: $event })"
        />
      </template>
      <template #pathValue="{ item }">
        <EditRule
          :value="item.pathValue"
          @input="handleUpdateRule({ id: item.id, pathValue: $event })"
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
  removeUnusedPermissions,
  downloadRules
} from '@/services/RedirectService'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'
import EditRule from '@/components/EditRule.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import UploadIcon from '@/components/icons/UploadIcon.vue'

const columns: Columns = {
  id: { label: 'ID', align: 'center', shrink: true },
  origin: { label: 'From origin', width: '25%' },
  newHost: { label: 'To host', width: '25%' },
  pathRegex: { label: 'Path regex', width: '25%' },
  pathValue: { label: 'New path', width: '25%' },
  active: { label: 'Active', align: 'center', shrink: true },
  actions: { label: 'Actions', align: 'center', shrink: true }
}

const data: Ref<RedirectList> = ref([])
const importFile = ref()

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
    newHost: '',
    pathRegex: '',
    pathValue: '',
    active: false
  }

  data.value.push(blankRule)
}

function handleUpdateRule({
  id,
  origin = undefined,
  newHost = undefined,
  pathRegex = undefined,
  pathValue = undefined,
  active = undefined
}: RedirectItemUpdate) {
  const rule = data.value.find((rule) => rule.id === id)

  if (rule) {
    data.value.splice(rule.id - 1, 1, {
      id: id,
      origin: origin || origin === '' ? origin : rule.origin,
      newHost: newHost || newHost === '' ? newHost : rule.newHost,
      pathRegex: pathRegex || pathRegex === '' ? pathRegex : rule.pathRegex,
      pathValue: pathValue || pathValue === '' ? pathValue : rule.pathValue,
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

function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.item(0)
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      data.value = JSON.parse(e.target!.result as string)
    }

    reader.readAsText(file)
  }
}
</script>
