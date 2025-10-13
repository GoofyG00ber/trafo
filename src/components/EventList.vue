<template>
  <div class="event-list max-w-6xl mx-auto p-6">
    <!-- Filters: search and date range -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <input
        v-model="query"
        type="search"
        placeholder="Keresés (név, leírás, hely, kategória... )"
        class="flex-1 px-3 py-2 border rounded bg-white"
        aria-label="Keresés események között"
      />

      <div class="w-48">
        <select v-model="category" class="w-full px-2 py-2 border rounded bg-white">
          <option value="">Összes kategória</option>
          <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 border rounded bg-white px-2 py-1">
          <input
            v-model="startDate"
            type="date"
            class="px-2 py-1 bg-transparent outline-none"
            aria-label="Kezdő dátum"
          />
          <span class="text-gray-500">—</span>
          <input
            v-model="endDate"
            type="date"
            class="px-2 py-1 bg-transparent outline-none"
            aria-label="Vég dátum"
          />
        </div>
      </div>

      <button
        type="button"
        @click="clearFilters"
        :class="[
          'px-3 py-2 rounded ml-auto inline-flex items-center justify-center focus:outline-none',
          filtersActive ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800',
        ]"
        aria-label="Szűrők törlése"
        title="Szűrők törlése"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-linecap="round" />
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ev in filteredEvents"
        :key="ev.id"
        class="card bg-gray-800 text-white rounded overflow-hidden shadow transition-transform"
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
          <h3 class="text-lg font-extrabold tracking-tight mb-2">{{ ev.nev || ev.title }}</h3>
          <div class="flex items-center gap-3 mt-4">
            <button class="btn-secondary hoverable" @click="openDetail(ev)">részletek ›</button>
            <a
              v-if="ev.tixa_link"
              :href="ev.tixa_link"
              class="btn-primary hoverable-link"
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
    const res = await fetch('http://localhost:3000/events')
    const data = await res.json()
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
  background: #b22222;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}
.btn-secondary {
  background: #333;
  color: #ddd;
  padding: 0.45rem 0.7rem;
  border-radius: 4px;
}

.btn-secondary:hover,
.btn-secondary:focus {
  background: #444;
  transform: translateY(-1px);
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
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}
.card:hover {
  transform: scale(1.04);
  z-index: 4;
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
  transform: translateY(-1px);
  filter: brightness(1.05);
}
.btn-primary[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

a:hover {
  text-decoration: none;
}
</style>
