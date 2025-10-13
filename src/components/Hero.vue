<template>
  <div class="hero">
    <div v-if="upcomingEvents.length" class="events">
      <h2>Közelgő események</h2>

      <div class="carousel" @mouseenter="paused = true" @mouseleave="paused = false">
        <button @click="prev(true)" class="nav prev" aria-label="Previous slide">‹</button>

        <ul class="event-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <li v-for="(event, i) in upcomingEvents" :key="event.id" class="event-item">
            <img :src="event.kep" alt="event" />
            <div>
              <h3>{{ event.nev }}</h3>
              <p>{{ formatDate(event.datum_ido) }}</p>
              <p>{{ event.kategoria }}</p>
            </div>
          </li>
        </ul>

        <button @click="next(true)" class="nav next" aria-label="Next slide">›</button>
      </div>
      <div v-if="upcomingEvents.length > 1" class="mt-4 flex justify-center gap-2">
        <button
          v-for="(e, i) in upcomingEvents"
          :key="e.id || i"
          @click="goTo(i, true)"
          :aria-label="`Go to slide ${i + 1}`"
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            currentIndex === i ? 'bg-red-600' : 'bg-gray-300',
            'cursor-pointer',
          ]"
        ></button>
      </div>
    </div>
    <div v-else>Jelenleg nincs közelgő esemény.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getEvents } from '@/api/events'

const upcomingEvents = ref([])
const currentIndex = ref(0)
const paused = ref(false)
let autoInterval = null
const AUTO_MS = 4000

function startAuto() {
  stopAuto()
  autoInterval = setInterval(() => {
    if (!paused.value && upcomingEvents.value.length) next(false)
  }, AUTO_MS)
}

function stopAuto() {
  if (autoInterval) {
    clearInterval(autoInterval)
    autoInterval = null
  }
}

function resetAuto() {
  startAuto()
}

onMounted(async () => {
  try {
    const data = await getEvents()
    const now = new Date()
    upcomingEvents.value = (data || [])
      .filter((e) => new Date(e.datum_ido) > now)
      .sort((a, b) => new Date(a.datum_ido).getTime() - new Date(b.datum_ido).getTime())
      .slice(0, 5)
  } catch (e) {
    upcomingEvents.value = []
    console.error('Failed to load upcoming events', e)
  }
  startAuto()
})

onUnmounted(() => {
  stopAuto()
})

function next(manual = false) {
  if (!upcomingEvents.value.length) return
  if (currentIndex.value < upcomingEvents.value.length - 1) currentIndex.value++
  else currentIndex.value = 0
  if (manual) resetAuto()
}

function prev(manual = false) {
  if (!upcomingEvents.value.length) return
  if (currentIndex.value > 0) currentIndex.value--
  else currentIndex.value = upcomingEvents.value.length - 1
  if (manual) resetAuto()
}

function goTo(i, manual = false) {
  if (i < 0 || i >= upcomingEvents.value.length) return
  currentIndex.value = i
  if (manual) resetAuto()
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.hero {
  margin: 4rem auto;
  width: 80%;
  max-width: 900px;
  min-height: 180px;
  background: #fafafa;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  text-align: center;
}

.events h2 {
  margin-bottom: 1.5rem;
  color: #b22222;
}

.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.event-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.event-track {
  position: relative;
  z-index: 10;
}

.event-item {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.event-item img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #fdd;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: #b22222;
  border: none;
  font-size: 2rem;
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 40;
  transition:
    transform 0.12s ease,
    color 0.12s ease;
}

.nav:hover {
  transform: translateY(-50%) scale(1.05);
  color: #8b1a1a;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}
</style>
