<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EventCalendar from '@/components/EventCalendar.vue'
import EventList from '@/components/EventList.vue'

const viewMode = ref<'calendar' | 'list'>('calendar')
const PROGRAMS_STATE_KEY = 'trafo:programs-state'

function setView(mode: 'calendar' | 'list') {
  // user explicitly changed view: clear saved state so back doesn't override
  try {
    sessionStorage.removeItem(PROGRAMS_STATE_KEY)
  } catch (_) {}
  viewMode.value = mode
}

onMounted(() => {
  try {
    const raw = sessionStorage.getItem(PROGRAMS_STATE_KEY)
    if (!raw) return
    const s = JSON.parse(raw)
    if (!s) return
    if (s.source === 'calendar') viewMode.value = 'calendar'
    if (s.source === 'list') viewMode.value = 'list'
  } catch (_) {}
  // ensure when user navigates back via browser history we re-check saved state
  const onPop = () => {
    try {
      const raw2 = sessionStorage.getItem(PROGRAMS_STATE_KEY)
      if (!raw2) return
      const s2 = JSON.parse(raw2)
      if (!s2) return
      if (s2.source === 'calendar') viewMode.value = 'calendar'
      if (s2.source === 'list') viewMode.value = 'list'
    } catch (_) {}
  }
  window.addEventListener('popstate', onPop)
  // cleanup on unmount
  ;(window as any).__programs_pop = onPop
})

onBeforeUnmount(() => {
  try {
    const fn = (window as any).__programs_pop
    if (fn) window.removeEventListener('popstate', fn)
    delete (window as any).__programs_pop
  } catch (_) {}
})
</script>

<template>
  <div class="h-[80px]"></div>
  <div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <!-- Toggle buttons -->
      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="setView('list')"
          :class="[
            'relative overflow-hidden inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none',
            viewMode === 'list' ? 'text-gray-100' : 'text-gray-400 hover:scale-105 transition-all duration-200 hover:bg-animate-gray',
          ]"
          :aria-pressed="viewMode === 'list'"
          title="Lista nézet"
        >
          <!-- List icon -->
          <svg
            class="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="5" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="17" width="16" height="2" rx="1" fill="currentColor" />
          </svg>
          Lista nézet
        </button>

        <button
          type="button"
          @click="setView('calendar')"
          :class="[
            'relative overflow-hidden inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none',
            viewMode === 'calendar' ? 'text-gray-100' : 'text-gray-400 hover:scale-105 transition-all duration-200 hover:bg-animate-gray',
          ]"
          :aria-pressed="viewMode === 'calendar'"
          title="Naptár nézet"
        >
          <!-- Calendar icon -->
          <svg
            class="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
            <path
              d="M16 3v4M8 3v4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          Naptár nézet
        </button>
      </div>
    </div>

    <!-- Only show the selected view -->
    <div>
      <EventCalendar v-if="viewMode === 'calendar'" />
      <EventList v-else />
    </div>
  </div>
</template>

<style scoped>
/* animált háttér sáv */
.hover\:bg-animate-gray::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* mennyit fedjen le */
  height: 100%;
  background-color: rgba(128, 128, 128, 0.25);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1s ease;
  z-index: 0;
}

.hover\:bg-animate-gray:hover::before {
  transform: scaleX(1);
}
</style>
