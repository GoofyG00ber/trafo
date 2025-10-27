<template>
  <div class="event-list max-w-6xl mx-auto p-6 mb-[80px]">
    <!-- Filters: search and date range -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div class="relative flex-1 min-w-[200px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          v-model="query"
          type="search"
          placeholder="Keresés (név, leírás, hely, kategória...)"
          class="w-full bg-[#2a2a2a] text-gray-200 placeholder-gray-500 pl-9 pr-3 py-2 rounded-md border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition"
          aria-label="Keresés események között"
        />
      </div>
      <div class="sm:w-auto">
        <div class="flex items-center gap-1 border border-transparent rounded-md bg-[#2a2a2a] px-1 py-1 focus-within:border-red-600 transition">
          <input
            v-model="startDate"
            type="date"
            class="px-1 py-1 bg-transparent text-gray-200 outline-none"
            aria-label="Kezdő dátum"
          />
          <span class="text-gray-500">—</span>
          <input
            v-model="endDate"
            type="date"
            class="px-1 py-1 bg-transparent text-gray-200 outline-none"
            aria-label="Vég dátum"
          />
        </div>
      </div>
      <button
        type="button"
        @click="clearFilters"
        :class="[
          'px-3 py-2 rounded-md inline-flex items-center justify-center transition focus:outline-none',
          filtersActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#2a2a2a] text-gray-400 hover:text-white',
        ]"
        aria-label="Szűrők törlése"
        title="Szűrők törlése"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ev in filteredEvents"
        :key="ev.id"
        class="card bg-gray-800 text-white rounded overflow-hidden shadow transition-transform relative"
      >
        <button
          type="button"
          class="img-link block h-44 bg-cover bg-center w-full"
          :style="{ backgroundImage: `url(${imageSrc(ev)})` }"
          @click="openDetail(ev)"
          aria-label="Esemény részletei"
        ></button>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span
              :class="['px-2 py-1 rounded text-xs font-semibold', categoryClass(ev.kategoria)]"
              >{{ ev.kategoria || 'egyéb' }}</span
            >
            <div class="text-xs text-gray-300">
              {{ formatDate(ev.datum_ido || ev.date || ev.start) }}
            </div>
          </div>
          <h3 class="text-lg font-extrabold tracking-wider mb-2 pb-[40px] rubik-dirt-regular text-gray-200">{{ ev.nev || ev.title }}</h3>
          <div class="flex items-center justify-end gap-3 pt-4 absolute bottom-3 right-4">
            <button class="btn-secondary hoverable bg-zinc-700 py-1 px-3 hover:bg-gray-600" @click="openDetail(ev)">részletek ›</button>
            <a
              v-if="ev.tixa_link"
              :href="ev.tixa_link"
              class="btn-primary hoverable-link bg-red-700 hover:bg-red-800 py-1 px-3"
              target="_blank"
              rel="noopener"
              >jegyvásárlás ›</a
            >
            <button v-else class="btn-primary" disabled>jegyvásárlás ›</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredEvents.length === 0" class="text-center text-gray-500 mt-6">
      Nincs találat a megadott szűrőkkel.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getEvents } from '@/api/events'
import { useRouter } from 'vue-router'

// placeholder is placed in /public so we can reference it at runtime
const placeholder = '/placeholder.png'

const events = ref<any[]>([])
const query = ref('')
const category = ref('')

function formatInputDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date()
const defaultStart = formatInputDate(today)
// end of next month: move two months ahead and take day 0
const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0)
const defaultEnd = formatInputDate(endOfNextMonth)

const startDate = ref(defaultStart)
const endDate = ref(defaultEnd)

function clearFilters() {
  query.value = ''
  startDate.value = defaultStart
  endDate.value = defaultEnd
  category.value = ''
}

function getEventDate(ev: any): Date | null {
  const candidates = [ev.datum_ido, ev.date, ev.start, ev.datum, ev.day]
  for (const c of candidates) {
    if (!c) continue
    try {
      // allow numeric timestamps too
      if (typeof c === 'number') {
        const d = new Date(c)
        if (!isNaN(d.getTime())) return d
        continue
      }
      const s = String(c).trim()
      if (!s) continue
      const d = new Date(s)
      if (!isNaN(d.getTime())) return d
    } catch (_) {
      continue
    }
  }
  return null
}

const filteredEvents = computed(() => {
  const q = (query.value || '').toString().trim().toLowerCase()
  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null

  return events.value.filter((ev) => {
    // category filter
    if (category.value) {
      const c = (ev.kategoria || ev.kategoria_name || ev.type || '').toString().toLowerCase()
      if (!c.includes(category.value.toLowerCase())) return false
    }
    // date filtering
    const evDate = getEventDate(ev)
    if (start && evDate) {
      // compare only date portions (ignore time) by setting to midnight
      const evD = new Date(evDate.getFullYear(), evDate.getMonth(), evDate.getDate())
      const sD = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      if (evD < sD) return false
    }
    if (end && evDate) {
      const evD = new Date(evDate.getFullYear(), evDate.getMonth(), evDate.getDate())
      const eD = new Date(end.getFullYear(), end.getMonth(), end.getDate())
      if (evD > eD) return false
    }

    // search across all event attributes by stringifying
    if (!q) return true
    try {
      const text = JSON.stringify(ev).toLowerCase()
      return text.includes(q)
    } catch (_) {
      // fallback: check common fields
      const combined = [ev.nev, ev.title, ev.leiras, ev.hely, ev.kategoria, ev.kep]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return combined.includes(q)
    }
  })
})

// derive category options from loaded events
const categoryOptions = computed(() => {
  const set = new Set<string>()
  for (const ev of events.value) {
    const c = ev.kategoria || ev.kategoria_name || ev.type || ''
    if (c) set.add(String(c))
  }
  return Array.from(set).sort()
})

const router = useRouter()
const PROGRAMS_STATE_KEY = 'trafo:programs-state'

const filtersActive = computed(() => {
  if ((query.value || '').trim() !== '') return true
  if ((category.value || '') !== '') return true
  if ((startDate.value || '') !== defaultStart) return true
  if ((endDate.value || '') !== defaultEnd) return true
  return false
})

function saveProgramsStateForList() {
  try {
    const state = {
      source: 'list',
      query: query.value,
      startDate: startDate.value,
      endDate: endDate.value,
      category: category.value,
    }
    sessionStorage.setItem(PROGRAMS_STATE_KEY, JSON.stringify(state))
  } catch (_) {}
}

function openDetail(ev: any) {
  if (!ev) return
  saveProgramsStateForList()
  // prefer id property; fall back to index-like id or slug
  const id = ev.id || ev._id || ev.slug || ev.name || ev.title
  router.push({ name: 'EventDetail', params: { id } }).catch(() => {})
}

async function loadEvents() {
  try {
    const data = await getEvents()
    events.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('failed to load events', e)
    events.value = []
  }
}

onMounted(loadEvents)

// restore saved filters if present
onMounted(() => {
  try {
    const raw = sessionStorage.getItem(PROGRAMS_STATE_KEY)
    if (!raw) return
    const s = JSON.parse(raw)
    if (s && s.source === 'list') {
      if (s.query) query.value = s.query
      if (s.startDate) startDate.value = s.startDate
      if (s.endDate) endDate.value = s.endDate
      if (s.category) category.value = s.category
    }
  } catch (_) {}
})

function categoryClass(cat: string | undefined) {
  const c = (cat || '').toString().toLowerCase()
  if (c.includes('koncert')) return 'bg-red-700'
  if (c.includes('buli')) return 'bg-purple-700'
  if (c.includes('egy')) return 'bg-teal-600'
  return 'bg-blue-600'
}

function formatDate(s: string | undefined) {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function imageSrc(ev: any) {
  const k = ev.kep || ev.image || ev.img || ev.picture || ev.thumbnail
  if (!k) return placeholder
  try {
    const s = String(k)
    if (/^https?:\/\//.test(s)) return s
    if (s.startsWith('/')) return s
    // otherwise assume it's a path under public or relative — serve from root
    return '/' + s.replace(/^\.?\//, '')
  } catch (_) {
    return placeholder
  }
}
</script>

<style scoped>
.card {
  background: #1f1f1f;
}
.img-wrap {
  background-color: #111;
}
.btn-primary {
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
.btn-secondary {
  color: #ddd;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
}

.btn-secondary:hover,
.btn-secondary:focus {
  transform: translateY(-2px);
  transition:
    transform 120ms ease,
    background 120ms ease;
}

.hoverable {
  cursor: pointer;
}
.hoverable:active {
  transform: translateY(0);
}

/* card hover scaling */
.card {
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.25);
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.3),
    0 12px 32px rgba(0, 0, 0, 0.35);
}

.img-link {
  cursor: pointer;
  background-color: #111;
  background-size: cover;
  background-position: center;
  border: none;
}

.btn-primary,
.btn-primary.hoverable-link {
  cursor: pointer;
  transition:
    transform 120ms ease,
    background 120ms ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
}
.btn-primary[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

a:hover {
  text-decoration: none;
}
</style>
