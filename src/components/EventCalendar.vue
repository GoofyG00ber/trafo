<template>
  <div class="calendar max-w-5xl mx-auto p-6 bg-black rounded-xl shadow-xl">
    <header class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button class="nav text-red-500 font-bold" @click="goToMonth(-1)">‹</button>
        <h2 class="text-xl font-bold text-gray-300">{{ monthTitle }}</h2>
        <button class="nav text-red-500 font-bold" @click="goToMonth(1)">›</button>
      </div>
      <!--<span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: '#8b1a1a' }"></span><span class="text-sm text-gray-600 mr-3">Koncert</span>
      <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: '#7c2bdc' }"></span><span class="text-sm text-gray-600 mr-3">Buli</span>
      <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: '#0ea5a4' }"></span><span class="text-sm text-gray-600 mr-3">Egyéb</span>
      <div class="text-sm text-gray-600">Programok: {{ events.length }}</div>-->
    </header>

    <div class="grid grid-cols-7 gap-1 text-sm">
      <div
        v-for="day in weekDays"
        :key="day"
        class="weekday bg-gray-200 text-gray-300 py-2 text-center"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 mt-1">
      <div v-for="blank in blanks" :key="`b-${blank}`" class="day empty"></div>

      <div v-for="d in daysInMonth" :key="d" class="day">
        <div class="day-number">{{ d }}</div>
        <div class="events-list">
          <div
            v-for="ev in eventsByDay[d] || []"
            :key="ev.id"
            class="event-box relative flex flex-col"
            :class="categoryClass(ev.kategoria || ev.kategoria_name || ev.type)"
            @click="openEvent(ev)"
            title="{{ ev.nev || ev.title }}"
          >
            <div class="event-label absolute top-1 left-1">{{ ev.kategoria || ev.kategoria_name || ev.type }}</div>
            <div class="event-title block mt-5 max-w-[120px]">{{ ev.nev || ev.title }}</div>
            <div class="chev self-end">›</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getEvents } from '@/api/events'
import { useRouter } from 'vue-router'

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

const events = ref<any[]>([])

async function loadEvents() {
  try {
    const data = await getEvents()
    events.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load events', e)
    events.value = []
  }
}

onMounted(() => {
  loadEvents()
})

// restore saved calendar view if present
onMounted(() => {
  try {
    const raw = sessionStorage.getItem(PROGRAMS_STATE_KEY)
    if (!raw) return
    const s = JSON.parse(raw)
    if (!s) return
    if (s.source === 'calendar') {
      if (typeof s.viewYear === 'number') viewYear.value = s.viewYear
      if (typeof s.viewMonth === 'number') viewMonth.value = s.viewMonth
    }
  } catch (_) {}
})

function monthTitleFmt(year: number, month: number) {
  return new Date(year, month).toLocaleString('hu-HU', { year: 'numeric', month: 'long' })
}

const monthTitle = computed(() => monthTitleFmt(viewYear.value, viewMonth.value))

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

const daysInMonthCount = computed(() => getDaysInMonth(viewYear.value, viewMonth.value))

const firstWeekday = computed(() => new Date(viewYear.value, viewMonth.value, 1).getDay())
// in JS, getDay: 0=Sunday. We want Monday-first like picture: shift
const blanks = computed(() => {
  const jsDay = firstWeekday.value // 0..6 (Sun..Sat)
  // Convert to Monday-first (1..7) where Monday=0 blanks
  const mondayIndex = (jsDay + 6) % 7 // now 0..6 where 0 = Monday
  return Array.from({ length: mondayIndex }, (_, i) => i)
})

const daysInMonth = computed(() => Array.from({ length: daysInMonthCount.value }, (_, i) => i + 1))

const weekDays = ['HÉTFŐ', 'KEDD', 'SZERDA', 'CSÜTÖRTÖK', 'PÉNTEK', 'SZOMBAT', 'VASÁRNAP']

const eventsByDay = computed(() => {
  const map: Record<number, any[]> = {}
  for (const ev of events.value) {
    // try multiple field names for date
    const dStr = ev.datum_ido || ev.date || ev.start || ev.datum || ev.day
    if (!dStr) continue
    const dt = new Date(dStr)
    if (isNaN(dt.getTime())) continue
    if (dt.getFullYear() === viewYear.value && dt.getMonth() === viewMonth.value) {
      const day = dt.getDate()
      map[day] = map[day] || []
      map[day].push(ev)
    }
  }
  // sort events by date/time
  Object.values(map).forEach((arr) =>
    arr.sort(
      (a: any, b: any) =>
        new Date(a.datum_ido || a.date || a.start).getTime() -
        new Date(b.datum_ido || b.date || b.start).getTime(),
    ),
  )
  return map
})

function categoryClass(cat: string | undefined) {
  if (!cat) return 'cat-default'
  const c = (cat || '').toString().toLowerCase()
  if (c.includes('koncert')) return 'cat-koncert'
  if (c.includes('buli') || c.includes('party')) return 'cat-buli'
  if (c.includes('egy') || c.includes('egyéb') || c.includes('other')) return 'cat-egy'
  return 'cat-default'
}

function goToMonth(delta: number) {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m < 0) {
    m = 11
    y -= 1
  }
  if (m > 11) {
    m = 0
    y += 1
  }
  viewMonth.value = m
  viewYear.value = y
}

const router = useRouter()
const PROGRAMS_STATE_KEY = 'trafo:programs-state'

function saveProgramsStateForCalendar() {
  try {
    const state = {
      source: 'calendar',
      viewYear: viewYear.value,
      viewMonth: viewMonth.value,
    }
    sessionStorage.setItem(PROGRAMS_STATE_KEY, JSON.stringify(state))
  } catch (_) {}
}

function openEvent(ev: any) {
  if (!ev) return
  saveProgramsStateForCalendar()
  const id = ev.id || ev._id || ev.slug || ev.name || ev.title
  router.push({ name: 'EventDetail', params: { id } }).catch(() => {})
}

// expose
</script>

<style scoped>
.calendar {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
}
.nav {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.weekday {
  background: #2b2b2b;
}
.day {
  min-height: 96px;
  background: #2b2b2b;
  color: #e5e7eb;
  padding: 6px;
  border-radius: 4px;
  position: relative;
}
.day.empty {
  background: transparent;
}
.day-number {
  position: absolute;
  top: 1px;
  right: 8px;
  font-weight: 700;
}
.events-list {
  margin-top: 20px;
  gap: 6px;
}
.event-box {
  padding: 6px 8px;
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background-color 0.2s;  
}
.event-title {
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}
.event-label {
  font-size: 0.7rem;
  opacity: 0.9;
}
.chev {
  margin-left: 6px;
  opacity: 0.85;
}
.cat-koncert {
  background: #8b1a1a;
}
.cat-buli {
  background: #7c2bdc;
}
.cat-egy {
  background: #0ea5a4;
}
.cat-default {
  background: #1f6feb;
}

/* responsive */
@media (min-width: 1024px) {
  .day {
    min-height: 120px;
  }
}
</style>
