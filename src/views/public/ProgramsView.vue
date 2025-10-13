<script setup lang="ts">
import { ref } from 'vue'
import EventCalendar from '@/components/EventCalendar.vue'
import EventList from '@/components/EventList.vue'

const viewMode = ref<'calendar' | 'list'>('calendar')
function setView(mode: 'calendar' | 'list') {
  viewMode.value = mode
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="text-lg font-semibold">Programs</div>

      <!-- Toggle buttons -->
      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="setView('list')"
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none',
            viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800',
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
            'inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none',
            viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800',
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

<style scoped></style>
