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
      <!-- table-like header: only nev, kategoria, datum_ido -->
      <div class="grid grid-cols-4 gap-4 text-sm text-gray-500 font-medium px-3 py-2 border-b">
        <div>#</div>
        <div>Név</div>
        <div>Kategória</div>
        <div class="text-right">Datum / Ido</div>
      </div>

      <!-- rows with inline expandable editor -->
      <div class="space-y-2 mt-2">
        <div
          v-for="ev in events"
          :key="ev.id"
          class="rounded overflow-hidden border"
          :class="['transition-shadow', expandedId === ev.id ? 'shadow-md' : '']"
          :style="categoryRowStyle(ev.kategoria)"
        >
          <div class="grid grid-cols-4 gap-4 items-center bg-white p-3">
            <div class="text-sm text-gray-600 font-medium">#{{ ev.id }}</div>

            <div class="text-sm text-gray-800 truncate">
              {{ ev.nev ?? ev.title ?? '-' }}
            </div>

            <div class="text-sm text-gray-700 font-medium">
              {{ ev.kategoria ?? '-' }}
            </div>

            <div class="text-right text-sm text-gray-600">
              <div class="flex items-center justify-end gap-2">
                <div class="text-right">
                  {{ ev.datum_ido ?? ev.date ?? '-' }}
                </div>
                <button
                  @click="toggleExpand(ev)"
                  class="inline-flex items-center px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                >
                  {{ expandedId === ev.id ? 'Close' : 'Modify' }}
                </button>
              </div>
            </div>
          </div>

          <!-- expandable editor: opens in-place, does not move item -->
          <transition name="expand">
            <div v-if="expandedId === ev.id" class="bg-gray-50 p-4 border-t">
              <form @submit.prevent="submit" class="space-y-3">
                <!-- make edited bound to the currently-expanded event -->
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
                    <label class="block text-sm font-semibold text-gray-700">Datum / Ido</label>
                    <input v-model="edited.datum_ido" class="w-full px-3 py-2 border rounded" />
                  </div>
                </div>

                <!-- any other fields remain editable below -->
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

                  <!-- Delete only visible in modify/expanded mode -->
                  <button
                    type="button"
                    @click="deleteEvent(edited)"
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

    <!-- keep create panel separate and above list if isNew -->
    <section v-if="isNew" class="mt-6 bg-white p-5 rounded border shadow-sm">
      <div class="flex items-start justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-800">
          {{ isNew ? 'Create event' : 'Edit event #' + (edited.id ?? '') }}
        </h2>

        <div class="flex items-center gap-2">
          <span v-if="!isNew" class="text-sm text-gray-500">Editing existing</span>
          <button @click="cancelEdit" class="text-sm text-gray-500 hover:underline">Close</button>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div v-for="(value, key) in edited" :key="key" class="space-y-1">
          <label :for="key" class="block text-sm font-semibold text-gray-700">{{ key }}</label>

          <textarea
            v-if="isLongField(key)"
            :id="key"
            v-model="edited[key]"
            rows="3"
            class="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          ></textarea>

          <input
            v-else
            :id="key"
            v-model="edited[key]"
            class="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
            {{ isNew ? 'Create' : 'Save' }}
          </button>

          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <!-- Delete only visible in modify mode -->
          <button
            v-if="!isNew"
            type="button"
            @click="deleteEvent(edited)"
            class="ml-auto px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
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

const expandedId = ref(null) // id of the expanded/modified row (keeps item in place)
const isNew = ref(false)
const edited = reactive({})
const newFieldKey = ref('')
const newFieldValue = ref('')

// helper: when opening inline editor, populate edited with a shallow copy
function toggleExpand(ev) {
  if (expandedId.value === ev.id) {
    // closing
    cancelInline()
    return
  }
  expandedId.value = ev.id
  isNew.value = false
  Object.keys(edited).forEach((k) => delete edited[k])
  for (const k in ev) edited[k] = ev[k]
  newFieldKey.value = ''
  newFieldValue.value = ''
  info.value = ''
  error.value = ''
}

function cancelInline() {
  expandedId.value = null
  Object.keys(edited).forEach((k) => delete edited[k])
  newFieldKey.value = ''
  newFieldValue.value = ''
}

// only show keys other than the three main ones
function otherFields(obj) {
  const out = {}
  for (const k in obj) {
    if (k === 'nev' || k === 'kategoria' || k === 'datum_ido' || k === 'id') continue
    out[k] = obj[k]
  }
  return out
}

// category coloring: subtle bg + colored left border
function categoryRowStyle(cat) {
  const c = String(cat ?? '').trim()
  const h = hashHue(c)
  // subtle background with light alpha and a stronger left border
  return {
    backgroundColor: `hsla(${h}, 70%, 95%, 0.7)`,
    borderLeft: `6px solid hsla(${h}, 70%, 45%, 0.9)`,
  }
}
function hashHue(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}

async function loadEvents() {
  loading.value = true
  error.value = ''
  info.value = ''
  try {
    const data = await eventsApi.getEvents()
    events.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

function selectForEdit(ev) {
  // kept for backward compatibility: open inline editor for this event
  toggleExpand(ev)
}

function startCreate() {
  // open the create panel (separate from inline expanded rows)
  expandedId.value = null
  isNew.value = true
  Object.keys(edited).forEach((k) => delete edited[k])
  // default keys expected by your UI
  edited.nev = ''
  edited.kategoria = ''
  edited.datum_ido = ''
  newFieldKey.value = ''
  newFieldValue.value = ''
  info.value = ''
  error.value = ''
}

function cancelEdit() {
  // cancel create panel
  isNew.value = false
  Object.keys(edited).forEach((k) => delete edited[k])
  newFieldKey.value = ''
  newFieldValue.value = ''
}

function addField() {
  const key = (newFieldKey.value || '').trim()
  if (!key) return
  edited[key] = newFieldValue.value
  newFieldKey.value = ''
  newFieldValue.value = ''
}

async function submit() {
  error.value = ''
  info.value = ''
  try {
    if (isNew.value) {
      await eventsApi.createEvent(edited)
      info.value = 'Event created'
    } else {
      if (!edited.id) throw new Error('No id on event to update')
      await eventsApi.updateEvent(edited.id, edited)
      info.value = 'Event updated'
    }
    await loadEvents()
    // reset UI
    expandedId.value = null
    isNew.value = false
    Object.keys(edited).forEach((k) => delete edited[k])
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Save failed'
  }
}

async function deleteEvent(ev) {
  if (!confirm('Delete event #' + ev.id + ' ?')) return
  error.value = ''
  info.value = ''
  try {
    await eventsApi.deleteEvent(ev.id)
    info.value = 'Event deleted'
    await loadEvents()
    // close any open editor for that item
    if (expandedId.value === ev.id) expandedId.value = null
    isNew.value = false
    Object.keys(edited).forEach((k) => delete edited[k])
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Delete failed'
  }
}

onMounted(loadEvents)
</script>

<style scoped>
/* small expand/collapse animation */
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
.admin-events {
  /* Tailwind covers most styling; keep this only for safety */
}
</style>
