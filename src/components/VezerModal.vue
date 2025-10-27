<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center"
    @keydown.esc="close"
    @click.self="close"
    tabindex="-1"
  >
    <div class="relative bg-neutral-900 text-gray-300 w-full max-w-xl rounded-xl shadow-2xl ring-1 ring-gray-300/10 overflow-hidden">
      <button
        class="close absolute top-3 left-3 z-50 bg-black/50 hover:bg-black/60 text-gray-300/90 hover:text-gray-300 transition-colors rounded-md px-2 py-1"
        @click="close"
        aria-label="close"
      >
        ×
      </button>

      <div class="relative h-64 md:h-72">
        <div class="absolute inset-0 bg-center bg-cover" :style="posterStyle"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div class="absolute bottom-4 left-4 pr-24">
          <div class="uppercase font-extrabold tracking-wide drop-shadow text-2xl md:text-3xl">
            {{ displayTitle }}
          </div>
        </div>

        <div v-if="displayDate" class="absolute top-3 right-3">
          <div class="bg-black/60 rounded-md w-20 p-2 text-center shadow">
            <div class="text-[11px] font-bold tracking-wide">{{ monthName(displayDate) }}</div>
            <div class="text-3xl font-black leading-none -mt-1">{{ dayNumber(displayDate) }}</div>
          </div>
        </div>
      </div>

      <div class="px-4 pt-4 pb-2">
        <p v-if="displayContent" class="text-neutral-300 mb-4 whitespace-pre-line">
          {{ displayContent }}
        </p>
        <div class="flex items-center justify-end gap-3 mt-auto pt-4">
          <router-link
            v-if="linkedEvent"
            :to="eventDetailRoute(linkedEvent)"
            class="secondary inline-flex items-center justify-center min-w-[130px] px-4 py-2 rounded-md font-bold uppercase text-sm shadow bg-gray-200 hover:bg-gray-100 text-red-500 hover:text-red-600 transition-colors"
            @click="close"
          >
            RÉSZLETEK
          </router-link>
          <a
            v-if="linkedEvent && linkedEvent.tixa_link"
            :href="linkedEvent.tixa_link"
            target="_blank"
            rel="noopener"
            class="primary inline-flex items-center justify-center min-w-[130px] px-4 py-2 rounded-md font-bold uppercase text-sm shadow bg-red-500 hover:bg-red-600 transition-colors"
            @click="close"
          >
            JEGYEK &gt;&gt;
          </a>
        </div>

        <div v-if="!displayTitle" class="text-neutral-400 py-6 text-center">
          Nincs megjeleníthető adat
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEvents } from '@/api/events'

/* --- Állapotok --- */
const isOpen = ref(false)
const isAutomatic = ref(true)
const manualData = ref({})
const selectedEventData = ref(null)
const eventsLocal = ref([])
const router = useRouter()

/* --- Segédfüggvények --- */
function monthName(date) {
  if (!date) return ''
  const monthsHu = [
    'JANUÁR','FEBRUÁR','MÁRCIUS','ÁPRILIS','MÁJUS','JÚNIUS',
    'JÚLIUS','AUGUSZTUS','SZEPTEMBER','OKTÓBER','NOVEMBER','DECEMBER'
  ]
  return monthsHu[date.getMonth()]
}
function dayNumber(date) {
  if (!date) return ''
  return date.getDate()
}
function close() {
  isOpen.value = false
}
function eventDetailRoute(ev) {
  if (!ev) return { path: '/' }
  if (ev.id) return { name: 'EventDetail', params: { id: ev.id } }
  return { path: `/eventdetail/${ev.slug || ev.title}` }
}

/* --- Betöltés --- */
onMounted(async () => {
  const manualMode = JSON.parse(localStorage.getItem('trafo:vezerMode') || 'false')
  isAutomatic.value = !manualMode
  const manual = JSON.parse(localStorage.getItem('trafo:vezer') || '{}')
  manualData.value = manual || {}

  try {
    const data = await getEvents()
    eventsLocal.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Események betöltése sikertelen:', e)
  }

  if (manualMode && manual.selectedEvent) {
    const ev = eventsLocal.value.find((x) => Number(x.id) === Number(manual.selectedEvent))
    if (ev) selectedEventData.value = ev
  }

  if (isAutomatic.value || manual.title || selectedEventData.value) {
    isOpen.value = true
  }
})

/* --- Következő automatikus esemény --- */
const nextEvent = computed(() => {
  if (!isAutomatic.value) return null
  const arr = eventsLocal.value || []
  if (!arr.length) return null
  const now = new Date()
  const parsed = arr
    .map((e) => {
      const d = e.datum_ido || e.date || e.start || e.day
      const dt = d ? new Date(d) : null
      return { ...e, _date: dt && !isNaN(dt) ? dt : null }
    })
    .filter((e) => e._date)
    .sort((a, b) => a._date - b._date)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const candidate = parsed.find((e) => {
    const ed = new Date(e._date.getFullYear(), e._date.getMonth(), e._date.getDate())
    return ed >= today
  })
  return candidate || parsed[0] || null
})

/* --- Megjelenítendő adatok --- */
const displayTitle = computed(() => {
  if (isAutomatic.value) return nextEvent.value?.nev || nextEvent.value?.title || 'N/A'
  if (selectedEventData.value) return selectedEventData.value.nev || selectedEventData.value.title
  return manualData.value.title || ''
})
const displayContent = computed(() => {
  if (isAutomatic.value) return nextEvent.value?.description || ''
  if (selectedEventData.value) return selectedEventData.value.description || ''
  return manualData.value.content || ''
})
const displayDate = computed(() => {
  if (isAutomatic.value) return nextEvent.value?._date || null
  if (selectedEventData.value?.datum_ido) return new Date(selectedEventData.value.datum_ido)
  return null
})
const posterStyle = computed(() => {
  let img = ''
  if (isAutomatic.value) img = nextEvent.value?.kep || ''
  else if (selectedEventData.value) img = selectedEventData.value.kep || ''
  else img = localStorage.getItem('trafo:vezerImage') || ''
  const safe = img ? `url('${img}')` : `linear-gradient(135deg,#444,#222)`
  return { backgroundImage: safe }
})

const linkedEvent = computed(() => {
  if (isAutomatic.value && nextEvent.value) return nextEvent.value
  if (selectedEventData.value) return selectedEventData.value
  return null
})
</script>
<style scoped>
.primary {
  background: linear-gradient(to bottom, #da4a4a, #b22222);
  color: white;
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
.secondary {
  background: linear-gradient(to bottom, #444, #222);
  color: #ddd;
  padding: 0.45rem 0.7rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
}
.close {
  font-size: 1.25rem;
  line-height: 1;
}
.close:hover {
  background: black/70;
  cursor:pointer;
}
.primary:hover,
.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
</style>