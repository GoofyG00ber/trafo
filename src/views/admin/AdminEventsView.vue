<template>
  <div class="admin-events max-w-4xl mx-auto p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Admin — Események</h1>
      <button
        @click="startCreate"
        class="uj inline-flex items-center px-3 py-2 bg-green-600 text-gray-100 rounded-md hover:bg-green-700"
      >
        Új esemény létrehozása
      </button>
    </header>

    <!-- moved: create panel now appears immediately under the header -->
    <section v-if="isNew" class="mt-0 mb-6 bg-gray-100 p-5 rounded border shadow-sm">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Új esemény létrehozás</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- fixed fields always present -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Név</label>
            <input v-model="edited.nev" class="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Kategória</label>
            <div class="flex gap-2 items-center">
              <select v-model="edited.kategoria" class="w-full px-3 py-2 border rounded">
                <option v-for="opt in kategoriak" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <!-- custom kategoria input appears only when "egyéb" is selected -->
            <div v-if="edited.kategoria === 'egyéb'" class="mt-2">
              <input
                v-model="customKategoria"
                placeholder="Egyéb kategória megadása"
                class="w-full px-3 py-2 border rounded"
              />
              <p class="text-xs text-gray-500 mt-1">
                Az itt megadott érték csak az aktuális eseményhez kerül mentésre, nem lesz opcióként
                eltárolva.
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Kép (fájl kiválasztása)</label>
            <input
              type="file"
              accept="image/*"
              @change="onKepChange"
              class="w-full px-3 py-2 border rounded"
            />
            <p class="text-xs text-gray-500 mt-1">
              A kiválasztott kép fájlneve kerül mentésre az adatbázisba. A kép feltöltése a public
              mappába külön történik.
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Státusz</label>
            <!-- removed add-status UI; only select remains -->
            <select v-model="edited.status" class="w-full px-3 py-2 border rounded">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700">Dátum / Idő</label>
            <input
              type="datetime-local"
              v-model="edited.datum_ido_local"
              class="w-full px-3 py-2 border rounded"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700">Leírás</label>
            <textarea
              v-model="edited.description"
              rows="3"
              class="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700">Tixa link</label>
            <input v-model="edited.tixa_link" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <!-- other dynamic fields -->
        <div v-for="(value, key) in otherFields(edited)" :key="key" class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">{{ key }}</label>
          <input v-model="edited[key]" class="w-full px-3 py-2 border rounded" />
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
            Hozzáadás
          </button>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-700">
            Létrehozás
          </button>
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Vissza
          </button>
        </div>
      </form>
    </section>

    <section v-if="loading" class="text-gray-300">Események betöltése...</section>

    <section v-else>
      <!-- changed to 4 columns: Név | Kategória | Dátum / Idő | Művelet -->
      <div class="grid grid-cols-4 gap-4 text-sm text-gray-300 font-medium px-3 py-2 border-b">
        <div>Név</div>
        <div>Kategória</div>
        <div class="text-right">Dátum / Idő</div>
        <div class="text-right">Művelet</div>
      </div>

      <div class="space-y-2 mt-2">
        <div
          v-for="ev in events"
          :key="ev.id"
          class="rounded overflow-hidden border transition-shadow"
          :class="[
            expandedId === ev.id ? 'shadow-md' : '',
            ev.id === newEventId ? 'bg-green-50 border-green-300' : '',
          ]"
          :style="categoryRowStyle(ev.kategoria)"
        >
          <!-- row now has 4 columns (name, category, date, actions) -->
          <div class="grid grid-cols-4 gap-4 items-center bg-gray-100 p-3">
            <div class="text-sm text-gray-800 truncate">{{ ev.nev ?? '-' }}</div>
            <div class="text-sm text-gray-700 font-medium">{{ ev.kategoria ?? '-' }}</div>
            <div class="text-right text-sm text-gray-600">
              {{ formatDate(ev.datum_ido) }}
            </div>
            <div class="text-right">
              <button
                @click="toggleExpand(ev)"
                class="modosit inline-flex items-center px-2 py-1 bg-yellow-400 text-gray-100 rounded-md hover:bg-yellow-500"
              >
                {{ expandedId === ev.id ? 'Bezárás' : 'Módosítás' }}
              </button>
            </div>
          </div>

          <!-- inline editor -->
          <transition name="expand">
            <div v-if="expandedId === ev.id" class="bg-gray-50 p-4 border-t">
              <form @submit.prevent="submit" class="space-y-3">
                <!-- fixed fields for editing -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Név</label>
                    <input v-model="edited.nev" class="w-full px-3 py-2 border rounded" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Kategória</label>
                    <div class="flex gap-2">
                      <select v-model="edited.kategoria" class="w-full px-3 py-2 border rounded">
                        <option v-for="opt in kategoriak" :key="opt" :value="opt">{{ opt }}</option>
                      </select>

                      <!-- add-new-option UI (keeps kategoriak list editable) -->
                      <input
                        v-model="newKategoriOption"
                        placeholder="Új opció"
                        class="px-2 py-1 border rounded w-28"
                      />
                      <button
                        type="button"
                        @click="addKategoriOption"
                        class="px-2 py-1 bg-gray-200 rounded"
                      >
                        Hozzáadás
                      </button>
                    </div>

                    <!-- custom kategoria input appears only when "egyéb" is selected -->
                    <div v-if="edited.kategoria === 'egyéb'" class="mt-2">
                      <input
                        v-model="customKategoria"
                        placeholder="Egyéb kategória megadása"
                        class="w-full px-3 py-2 border rounded"
                      />
                      <p class="text-xs text-gray-500 mt-1">
                        Az itt megadott érték csak az aktuális eseményhez kerül mentésre, nem lesz
                        opcióként eltárolva.
                      </p>
                    </div>
                  </div>

                  <div class="col-span-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Kép (fájl kiválasztása)</label
                    >
                    <input
                      type="file"
                      accept="image/*"
                      @change="onKepChange"
                      class="w-full px-3 py-2 border rounded"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      A kiválasztott kép fájlneve kerül mentésre az adatbázisba. A kép feltöltése a
                      public mappába külön történik.
                    </p>
                  </div>

                  <div class="col-span-2">
                    <label class="block text-sm font-semibold text-gray-700">Dátum / Idő</label>
                    <input
                      type="datetime-local"
                      v-model="edited.datum_ido_local"
                      class="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div class="col-span-2">
                    <label class="block text-sm font-semibold text-gray-700">Leírás</label>
                    <textarea
                      v-model="edited.description"
                      rows="3"
                      class="w-full px-3 py-2 border rounded"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Tixa link</label>
                    <input v-model="edited.tixa_link" class="w-full px-3 py-2 border rounded" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700">Státusz</label>
                    <div class="flex gap-2">
                      <select v-model="edited.status" class="w-full px-3 py-2 border rounded">
                        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- other dynamic fields -->
                <div v-for="(value, key) in otherFields(edited)" :key="key" class="space-y-1">
                  <label class="block text-sm font-semibold text-gray-700">{{ key }}</label>
                  <input v-model="edited[key]" class="w-full px-3 py-2 border rounded" />
                </div>

                <div class="flex items-center gap-3">
                  <button
                    type="submit"
                    class="mentes px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-700"
                  >
                    Mentés
                  </button>

                  <button
                    type="button"
                    @click="cancelInline"
                    class="vissza px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Vissza
                  </button>

                  <button
                    type="button"
                    @click="deleteEvent(edited.id)"
                    class="torol ml-auto px-3 py-2 bg-red-600 text-gray-300 rounded hover:bg-red-700"
                  >
                    Törlés
                  </button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </div>
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

// new: store id of last created event (highlight until full page refresh)
const newEventId = ref(null)

// dropdown option lists and new-option inputs
const kategoriak = ref(['Koncert', 'Buli', 'Egyéb'])
const statuses = ref(['Aktív', 'Láthatatlan', 'Lemondott'])
const newKategoriOption = ref('')
// removed newStatusOption and addStatusOption state

// new: custom input used only when 'egyéb' selected (not saved into kategoriak)
const customKategoria = ref('')

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

function addKategoriOption() {
  const v = (newKategoriOption.value || '').trim()
  if (!v) return
  if (!kategoriak.value.includes(v)) kategoriak.value.push(v)
  newKategoriOption.value = ''
}

/* remove addStatusOption function and any references */

function toggleExpand(ev) {
  if (expandedId.value === ev.id) return cancelInline()
  expandedId.value = ev.id
  isNew.value = false
  Object.keys(edited).forEach((k) => delete edited[k])
  Object.assign(edited, ev)
  // coerce id to a number if present
  if (edited.id !== undefined && edited.id !== null) {
    const n = Number(edited.id)
    if (!Number.isNaN(n)) edited.id = n
  }
  // populate local datetime value for the datetime-local input
  edited.datum_ido_local = ev.datum_ido ? toInputDatetime(ev.datum_ido) : ''
  edited.kep = edited.kep ?? ''
  edited.description = edited.description ?? ''
  edited.tixa_link = edited.tixa_link ?? ''
  // if ev.kategoria is one of the known options, use it; otherwise select 'egyéb' and put the value into customKategoria
  if (ev.kategoria && kategoriak.value.includes(ev.kategoria)) {
    edited.kategoria = ev.kategoria
    customKategoria.value = ''
  } else if (ev.kategoria) {
    edited.kategoria = 'egyéb'
    customKategoria.value = ev.kategoria
  } else {
    edited.kategoria = kategoriak.value[0]
    customKategoria.value = ''
  }
  edited.status = edited.status ?? statuses.value[0]
}

function cancelInline() {
  expandedId.value = null
  Object.keys(edited).forEach((k) => delete edited[k])
}

function otherFields(obj) {
  const out = {}
  for (const k in obj) {
    if (
      [
        'id',
        'nev',
        'kategoria',
        'datum_ido',
        'datum_ido_local',
        'kep',
        'description',
        'tixa_link',
        'status',
      ].includes(k)
    )
      continue
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
  // clear previous edited state to avoid reusing an id
  Object.keys(edited).forEach((k) => delete edited[k])
  // default keys expected by your UI
  edited.nev = ''
  edited.kategoria = kategoriak.value[0]
  customKategoria.value = ''
  edited.kep = ''
  edited.datum_ido = ''
  edited.datum_ido_local = ''
  edited.description = ''
  edited.tixa_link = ''
  edited.status = statuses.value[0]
  newFieldKey.value = ''
  newFieldValue.value = ''
  info.value = ''
  error.value = ''
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
  return ['leiras', 'description', 'content', 'notes'].includes(String(key || '').toLowerCase())
}

/* new: date helpers to map between stored ISO and input value */
function toInputDatetime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  // produce yyyy-MM-ddTHH:mm
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fromInputDatetime(val) {
  if (!val) return ''
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? val : d.toISOString()
}

/* new: date formatter used in template */
function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function submit() {
  error.value = ''
  info.value = ''
  try {
    if (isNew.value) {
      // compute next numeric id (max existing id + 1)
      const maxId = events.value.reduce((m, x) => {
        const n = Number(x?.id)
        return Number.isFinite(n) ? Math.max(m, n) : m
      }, 0)
      const nextId = maxId + 1
      const payload = { ...edited }
      // ensure STRING id
      payload.id = String(nextId)
      // map local datetime to ISO
      if (payload.datum_ido_local) payload.datum_ido = fromInputDatetime(payload.datum_ido_local)
      delete payload.datum_ido_local
      // kategoria handling for 'egyéb'
      if (payload.kategoria === 'egyéb') {
        payload.kategoria = (customKategoria.value || 'egyéb').trim()
      }
      const created = await eventsApi.createEvent(payload)
      // determine created id (server may return id)
      const createdId = Number(created?.id ?? nextId)
      if (!Number.isNaN(createdId)) newEventId.value = createdId
      info.value = 'Event created'
      alert(`Sikeres létrehozás${created?.id ? ` (#${created.id})` : ''}.`)
    } else {
      if (edited.id === undefined || edited.id === null) throw new Error('No id on event to update')
      const idNum = Number(edited.id)
      if (Number.isNaN(idNum)) throw new Error('Invalid numeric id')

      const payload = { ...edited }
      if (payload.datum_ido_local) payload.datum_ido = fromInputDatetime(payload.datum_ido_local)
      delete payload.datum_ido_local
      // kategoria handling for 'egyéb'
      if (payload.kategoria === 'egyéb') {
        payload.kategoria = (customKategoria.value || 'egyéb').trim()
      }

      try {
        // try updating first (PUT) — do not fallback to creating on 404
        const updated = await eventsApi.updateEvent(idNum, { ...payload, id: idNum })
        info.value = 'Event updated'
        alert(`Sikeres frissítés${updated?.id ? ` (#${updated.id})` : ''}.`)
      } catch (e) {
        const msg = String(e?.message || e)
        if (msg.includes('404')) {
          error.value = 'Update failed: resource not found on server (404).'
          alert(`Frissítés sikertelen: az esemény nem található a szerveren (404).`)
        } else {
          throw e
        }
      }
    }

    await loadEvents()
    // reset UI
    expandedId.value = null
    isNew.value = false
    // clear edited
    Object.keys(edited).forEach((k) => delete edited[k])
    customKategoria.value = ''
  } catch (e) {
    console.error(e)
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

// updated: upload file to public folder and set filename in db
async function onKepChange(event) {
  const file = event.target.files[0]
  if (file) {
    try {
      const filename = await eventsApi.uploadImage(file)
      edited.kep = filename // save uploaded filename to db
    } catch (e) {
      alert('Kép feltöltése sikertelen: ' + e.message)
    }
  }
}

onMounted(loadEvents)
</script>

<style scoped>
button.uj{
  background: linear-gradient(to bottom, #42cf00, #057c01);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
button.modosit{
  background: linear-gradient(to bottom, #ffc15d, #d18400);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
button.mentes{
  background: linear-gradient(to bottom, #42a5f5, #1565c0);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
button.vissza{
  background: linear-gradient(to bottom, #e0e0e0, #9e9e9e);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
button.torol{
  background: linear-gradient(to bottom, #f44336, #b71c1c);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

}
button:hover{
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
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
/* small highlight tweak when newEventId matches */
.bg-green-50 {
  background-color: rgba(220, 253, 231, 1);
}
.border-green-300 {
  border-color: rgba(134, 239, 172, 1);
}
</style>
