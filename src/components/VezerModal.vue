<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm md:backdrop-blur flex items-center justify-center"
    @keydown.esc="close"
    @click.self="close"
    tabindex="-1"
  >
    <div
      class="relative bg-neutral-900 text-white w-full max-w-xl rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden"
    >
      <!-- added top-left X close button (now above poster) -->
      <button
        class="absolute top-3 left-3 z-50 bg-black/50 hover:bg-black/60 text-white/90 hover:text-white transition-colors rounded-md px-2 py-1"
        @click="close"
        aria-label="close"
      >
        ×
      </button>

      <div class="relative h-64 md:h-72">
        <div class="absolute inset-0 bg-center bg-cover" :style="posterStyle"></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        ></div>

        <div class="absolute bottom-4 left-4 pr-24">
          <div class="uppercase font-extrabold tracking-wide drop-shadow text-2xl md:text-3xl">
            {{ nextEvent?.nev || nextEvent?.title || 'N/A' }}
          </div>
        </div>

        <div v-if="nextEvent" class="absolute top-3 right-3">
          <div class="bg-black/60 rounded-md w-20 p-2 text-center shadow">
            <div class="text-[11px] font-bold tracking-wide">{{ monthName(nextEventDate) }}</div>
            <div class="text-3xl font-black leading-none -mt-1">{{ dayNumber(nextEventDate) }}</div>
          </div>
        </div>
      </div>

      <div class="px-4 pt-4 pb-2">
        <div class="flex gap-3">
          <router-link
            v-if="nextEvent"
            :to="eventDetailRoute(nextEvent)"
            class="inline-flex items-center justify-center min-w-[130px] px-4 py-2 rounded-md font-bold uppercase text-sm shadow bg-gray-200 hover:bg-gray-100 text-red-500 hover:text-red-600 transition-colors"
            @click="close"
          >
            RÉSZLETEK
          </router-link>

          <a
            v-if="nextEvent && nextEvent.tixa_link"
            :href="nextEvent.tixa_link"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center min-w-[130px] px-4 py-2 rounded-md font-bold uppercase text-sm shadow bg-red-500 hover:bg-red-600 transition-colors"
            @click="close"
          >
            JEGYEK &gt;&gt;
          </a>
        </div>

        <router-link
          v-if="nextEvent"
          :to="eventDetailRoute(nextEvent)"
          class="text-[11px] text-neutral-300 mt-3 inline-flex items-center gap-1 hover:text-white transition-colors"
          @click="close"
        >
          TOVÁBB AZ OLDALRA <span aria-hidden>›</span>
        </router-link>
        <div v-if="!nextEvent" class="text-neutral-200 py-6 text-center">
          Nincs elérhető esemény
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, onMounted, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getEvents } from '@/api/events'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  events: { type: Array, default: () => [] },
  fallbackImage: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const { events } = toRefs(props)
const loading = ref(false)
const error = ref('')

// detect if parent passed modelValue (controlled)
const inst = getCurrentInstance()
const vnodeProps = inst?.vnode?.props || {}
const controlled = Boolean(
  vnodeProps &&
    (Object.prototype.hasOwnProperty.call(vnodeProps, 'modelValue') ||
      Object.prototype.hasOwnProperty.call(vnodeProps, 'model-value')),
)

const isOpen = ref(Boolean(props.modelValue))
watch(
  () => props.modelValue,
  (v) => {
    if (controlled) isOpen.value = Boolean(v)
  },
)

// local fallback events array if parent didn't supply one or we can't mutate the prop
const eventsLocal = ref([])
const eventsSource = computed(() =>
  events.value && events.value.length ? events.value : eventsLocal.value,
)

onMounted(async () => {
  if (!eventsSource.value || !eventsSource.value.length) {
    loading.value = true
    try {
      const data = await getEvents()
      if (Array.isArray(data)) eventsLocal.value = data
    } catch (e) {
      // keep concise error handling
      error.value = e?.message || String(e)
      console.error('VezerModal failed to load events', e)
    } finally {
      loading.value = false
    }
  }
})

const nextEvent = computed(() => {
  const arr = eventsSource.value || []
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

  if (!parsed.length) return null
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const candidate = parsed.find((e) => {
    const ed = new Date(e._date.getFullYear(), e._date.getMonth(), e._date.getDate())
    return ed >= today
  })
  return candidate || parsed[0] || null
})

// auto-open when uncontrolled and we have a next event
watch(nextEvent, (ev) => {
  if (!controlled) isOpen.value = !!ev
})

const nextEventDate = computed(() => nextEvent.value?._date || null)
const router = useRouter()

function close() {
  isOpen.value = false
  if (controlled) emit('update:modelValue', false)
}

function eventDetailRoute(ev) {
  if (!ev) return { path: '/' }
  if (ev.id) return { name: 'EventDetail', params: { id: ev.id } }
  return { path: `/eventdetail/${ev.slug || ev.title}` }
}

function monthName(date) {
  if (!date) return ''
  const monthsHu = [
    'JANUÁR',
    'FEBRUÁR',
    'MÁRCIUS',
    'ÁPRILIS',
    'MÁJUS',
    'JÚNIUS',
    'JÚLIUS',
    'AUGUSZTUS',
    'SZEPTEMBER',
    'OKTÓBER',
    'NOVEMBER',
    'DECEMBER',
  ]
  return monthsHu[date.getMonth()]
}

function dayNumber(date) {
  if (!date) return ''
  return date.getDate()
}

// Use kep as primary background image, fallback to prop
const posterStyle = computed(() => {
  const img = (nextEvent.value && nextEvent.value.kep) || props.fallbackImage || ''
  const safe = img ? `url('${img}')` : `linear-gradient(135deg,#444,#222)`
  return {
    backgroundImage: safe,
  }
})
</script>

<style scoped>
/* Tailwind handles most styling. Keeping empty or minimal style block for SFC completeness. */
</style>
