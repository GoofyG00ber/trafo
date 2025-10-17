<template>
<!-- SVG filter for squiggly effect -->
<svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    height="0"
    width="0"
>
    <defs>
        <filter id="squiggle">
            <feTurbulence
                type="fractalNoise"
                id="turbulence"
                baseFrequency=".50"
                numOctaves="4"
            />
            <feDisplacementMap
                id="displacement"
                in="SourceGraphic"
                scale="4"
            />
        </filter>
    </defs>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="0" height="0" opacity="1"><defs><filter id="nnnoise-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
	<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
	<feSpecularLighting surfaceScale="40" specularConstant="0.5" specularExponent="20" lighting-color="#aaaaaa" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting">
    		<feDistantLight azimuth="3" elevation="40"></feDistantLight>
  	</feSpecularLighting>
  
</filter></defs></svg>

  <div class="px-6">
    <div class="hero mx-auto my-6 h-96 max-w-7xl">
      <div v-if="upcomingEvents.length" class="relative events h-full w-full flex flex-col justify-center items-center">
        <div class="absolute inset-0 -z-10 bg-neutral-900 squiggle shadow-lg"></div>
        <div class="absolute inset-0 -z-9  noise"></div>
        <div class="carousel" @mouseenter="paused = true" @mouseleave="paused = false">
          <button @click="prev(true)" class="nav prev rubik-dirt-regular  text-7xl" aria-label="Previous slide">‹</button>

          <ul class="event-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <li v-for="(event, i) in upcomingEvents" :key="event.id" class="event-item">
              <img :src="event.kep" alt="event" class="absolute z-0 w-sm min-h-sm"/>
              <div class="relative z-10">
                <h3 class="rowdies-regular text-white text-4xl tracking-wider object-center">{{ event.nev }}</h3>
                <p class="rowdies-light text-red-700 text-2xl">{{ formatDate(event.datum_ido) }}</p>
                <p class="rowdies-light text-white">{{ event.kategoria }}</p>
              </div>
            </li>
          </ul>

          <button @click="next(true)" class="nav next rubik-dirt-regular  text-7xl" aria-label="Next slide">›</button>
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
@import url('https://fonts.googleapis.com/css2?family=Belanosima:wght@400;600;700&family=Rowdies:wght@300;400;700&family=Rubik+Dirt&display=swap');

.hero {
  /*margin: 4rem auto;
  width: 80%;
  max-width: 900px;
  min-height: 180px;
  background: #fafafa;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  text-align: center;*/
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
  /*width: 80px;
  height: 80px;*/
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

.rowdies-light {
  font-family: "Rowdies", sans-serif;
  font-weight: 300;
  font-style: normal;
}

.rowdies-regular {
  font-family: "Rowdies", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.rowdies-bold {
  font-family: "Rowdies", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.belanosima-regular {
  font-family: "Belanosima", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.belanosima-semibold {
  font-family: "Belanosima", sans-serif;
  font-weight: 600;
  font-style: normal;
}

.belanosima-bold {
  font-family: "Belanosima", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.rubik-dirt-regular {
  font-family: "Rubik Dirt", system-ui;
  font-weight: 400;
  font-style: normal;
}

.squiggle {
    filter: url(#squiggle);
}
.noise{
    filter: url(#nnnoise-filter);
}
</style>
