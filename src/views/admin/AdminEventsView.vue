<template>
  <div class="admin-events max-w-4xl mx-auto p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Admin — Events</h1>
      <button
        @click="startCreate"
        class="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Create new event
      </button>
    </header>

    <section v-if="loading" class="text-gray-600">Loading events...</section>

    <section v-else>
      <div class="grid grid-cols-4 gap-4 text-sm text-gray-500 font-medium px-3 py-2 border-b">
        <div>#</div>
        <div>Név</div>
        <div>Kategória</div>
        <div class="text-right">Dátum / Idő</div>
      </div>

      <div class="space-y-2 mt-2">
        <div
          v-for="ev in events"
          :key="ev.id"
          class="rounded overflow-hidden border transition-shadow"
          :class="expandedId === ev.id ? 'shadow-md' : ''"
          :style="categoryRowStyle(ev.kategoria)"
        >
          <div class="grid grid-cols-4 gap-4 items-center bg-white p-3">
            <div class="text-sm text-gray-600 font-medium">#{{ ev.id }}</div>
            <div class="text-sm text-gray-800 truncate">{{ ev.nev ?? '-' }}</div>
            <div class="text-sm text-gray-700 font-medium">{{ ev.kategoria ?? '-' }}</div>
            <div class="text-right text-sm text-gray-600">
              <div class="flex items-center justify-end gap-2">
                <div>{{ ev.datum_ido ?? '-' }}</div>
                <button
                  @click="toggleExpand(ev)"
                  class="inline-flex items-center px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                >
                  {{ expandedId === ev.id ? 'Close' : 'Modify' }}
                </button>
              </div>
            </div>
          </div>

          <!-- inline editor -->
          <transition name="expand">
            <div v-if="expandedId === ev.id" class="bg-gray-50 p-4 border-t">
              <form @submit.prevent="submit" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Név</label>
                    <input v-model="edited.nev" class="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Kategória</label>
                    <input v-model="edited.kategoria" class="w-full px-3 py-2 border rounded" />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-semibold text-gray-700">Dátum / Idő</label>
                    <input v-model="edited.datum_ido" class="w-full px-3 py-2 border rounded" />
                  </div>
                </div>

                <div v-for="(value, key) in otherFields(edited)" :key="key" class="space-y-1">
                  <label class="block text-sm font-semibold text-gray-700">{{ key }}</label>
                  <input v-model="edited[key]" class="w-full px-3 py-2 border rounded" />
                </div>

                <div class="flex items-center gap-3">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    @click="cancelInline"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    @click="deleteEvent(edited.id)"
                    class="ml-auto px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- create new event panel -->
    <section v-if="isNew" class="mt-6 bg-white p-5 rounded border shadow-sm">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Create new event</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div v-for="(value, key) in edited" :key="key" class="space-y-1">
          <label :for="key" class="block text-sm font-semibold text-gray-700">{{ key }}</label>
          <textarea
            v-if="isLongField(key)"
            :id="key"
            v-model="edited[key]"
            rows="3"
            class="w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-200"
          ></textarea>
          <input
            v-else
            :id="key"
            v-model="edited[key]"
            class="w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div class="flex gap-2 items-center">
          <input
            v-model="newFieldKey"
            placeholder="new field key"
            class="w-1/3 px-2 py-1 border rounded"
          />
          <input
            v-model="newFieldValue"
            placeholder="new field value"
            class="w-1/3 px-2 py-1 border rounded"
          />
          <button
            type="button"
            @click="addField"
            class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add field
          </button>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create
          </button>
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</section>
    <section v-if="info" class="mt-4 text-sm text-green-600">{{ info }}</section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as eventsApi from '@/api/events'

const events = ref([])
const loading = ref(false)
const error = ref('')
const info = ref('')
const expandedId = ref(null)
const isNew = ref(false)
const edited = reactive({})
const newFieldKey = ref('')
const newFieldValue = ref('')

async function loadEvents() {
  loading.value = true
  try {
    events.value = await eventsApi.getEvents()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function toggleExpand(ev) {
  if (expandedId.value === ev.id) return cancelInline()
  expandedId.value = ev.id
  isNew.value = false
  Object.assign(edited, ev)
}

function cancelInline() {
  expandedId.value = null
  Object.keys(edited).forEach((k) => delete edited[k])
}

function otherFields(obj) {
  const out = {}
  for (const k in obj) {
    if (['id', 'nev', 'kategoria', 'datum_ido'].includes(k)) continue
    out[k] = obj[k]
  }
  return out
}

function hashHue(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}

function categoryRowStyle(cat) {
  const h = hashHue(String(cat ?? ''))
  return {
    backgroundColor: `hsla(${h}, 70%, 95%, 0.7)`,
    borderLeft: `6px solid hsla(${h}, 70%, 45%, 0.9)`,
  }
}

function startCreate() {
  expandedId.value = null
  isNew.value = true
  Object.assign(edited, { nev: '', kategoria: '', datum_ido: '' })
}

function cancelEdit() {
  isNew.value = false
  Object.keys(edited).forEach((k) => delete edited[k])
}

function addField() {
  if (!newFieldKey.value) return
  edited[newFieldKey.value] = newFieldValue.value
  newFieldKey.value = ''
  newFieldValue.value = ''
}

function isLongField(key) {
  return ['leiras', 'description', 'content', 'notes'].includes(key.toLowerCase())
}

async function submit() {
  error.value = ''
  info.value = ''
  try {
    if (isNew.value) {
      const payload = { ...edited }
      delete payload.id
      await eventsApi.createEvent(payload)
      info.value = 'Esemény létrehozva.'
      alert('Sikeres létrehozás.')
    } else {
      await eventsApi.updateEvent(edited.id, edited)
      info.value = 'Esemény frissítve.'
      alert('Sikeres frissítés.')
    }
    await loadEvents()
    cancelInline()
    cancelEdit()
  } catch (e) {
    error.value = e.message || 'Save failed'
    alert(`Mentés sikertelen: ${error.value}`)
  }
}

async function deleteEvent(id) {
  if (!confirm(`Biztosan törli az eseményt (#${id})?`)) return
  try {
    await eventsApi.deleteEvent(id)
    info.value = 'Esemény törölve.'
    alert('Sikeres törlés.')
    await loadEvents()
  } catch (e) {
    error.value = e.message || 'Törlés sikertelen.'
    alert(`Törlés sikertelen: ${error.value}`)
  }
}

onMounted(loadEvents)
</script>

<style scoped>
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}
.expand-enter-to,
.expand-leave-from {
  max-height: 600px;
  opacity: 1;
  transform: translateY(0);
}
.expand-enter-active,
.expand-leave-active {
  transition: all 220ms ease;
}
</style>
