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

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 mr-2">Dátumtartomány</label>
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

      <button type="button" @click="clearFilters" class="px-3 py-1 bg-gray-200 rounded ml-auto">
        Töröl
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ev in filteredEvents"
        :key="ev.id"
        class="card bg-gray-800 text-white rounded overflow-hidden shadow"
      >
        <div
          class="img-wrap h-44 bg-cover bg-center"
          :style="{ backgroundImage: `url(${imageSrc(ev)})` }"
        ></div>
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
            <button class="btn-secondary">részletek ›</button>
            <button class="btn-primary">jegyvásárlás ›</button>
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

// placeholder is placed in /public so we can reference it at runtime
const placeholder = '/placeholder.png'

const events = ref<any[]>([])
const query = ref('')

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
</style>
