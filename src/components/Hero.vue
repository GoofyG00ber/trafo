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
                baseFrequency="0.08"
                numOctaves="3"
            />
            <feDisplacementMap
                id="displacement"
                in="SourceGraphic"
                scale="5"
            />
        </filter>
    </defs>
</svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true">
  <defs>
    <!-- Noise source -->
    <filter id="noise-filter" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise"
                    baseFrequency="0.13"
                    numOctaves="4"
                    seed="15"
                    stitchTiles="stitch"
                    result="noise"/>
      <!-- Optional: strengthen contrast of the noise -->
      <feComponentTransfer in="noise">
        <feFuncA type="gamma" amplitude="1" exponent="1.4" offset="0"/>
      </feComponentTransfer>
    </filter>

    <!-- Actual mask: white keeps, black hides -->
    <mask id="squiggle-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
      <!-- Full area visible by default -->
      <rect x="0" y="0" width="1" height="1" fill="#fff"/>

      <!-- Lay noise on top as *black* with some opacity so it only nibbles -->
      <!-- Tune opacity (0.15–0.5) to control how much is eaten away -->
      <rect x="0" y="0" width="1" height="1" fill="#000" opacity="0.28" filter="url(#nnnoise-filter)"/>
    </mask>
  </defs>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="0" height="0" opacity="1"><defs><filter id="nnnoise-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
	<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
	<feSpecularLighting surfaceScale="40" specularConstant="0.5" specularExponent="20" lighting-color="#aaaaaa" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting">
    		<feDistantLight azimuth="3" elevation="40"></feDistantLight>
  	</feSpecularLighting>

</filter></defs></svg>
  <div class="px-6">
    <div class="hero relative mx-auto my-6 h-128 max-w-7xl">
      <button @click="prev(true)" class="nav prev rubik-dirt-regular text-9xl absolute top-1/2 -left-8 text-red-700" aria-label="Previous slide">‹</button>
      <div class="absolute inset-0 bg-neutral-900 squiggle shadow-lg overflow-hidden bg-[url(src\components\imgs\black-concrete-textured-background.jpg)] bg-cover"></div>
      <div v-if="upcomingEvents.length" class="relative events h-full w-full flex flex-col justify-center items-center overflow-hidden">
        <div class="carousel h-8/10" @mouseenter="paused = true" @mouseleave="paused = true">
          <ul class="event-track h-full" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <li v-for="(event, i) in upcomingEvents" :key="event.id" class="event-item group hover:cursor-pointer">
              <div class="grid grid-cols-2 gap-0" @click="openDetail(event)">
                <div class="w-full h-full aspect-square grayscale group-hover:grayscale-0 transition duration-150 ease-in-out align-middle ">
                    <img :src="event.kep" alt="event" class="absolute z-0 w-full h-full [mask-image:linear-gradient(to_right,black,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]"/>
                </div>

                <div class="relative z-10 flex flex-col justify-center -ml-20 pr-10">
                  <h3 class="rowdies-regular break-normal text-white text-6xl tracking-wider object-center
                  group-hover:text-red-700 transition duration-150 ease-in-out order-3
                  my-1">{{ event.nev }}</h3>
                  <p class="rowdies-light text-red-700 text-5xl order-2">{{ formatDate(event.datum_ido) }}</p>
                  <p class="rowdies-light text-xl text-white order-1 my-3"><span class="px-3 py-2 rounded-md" :class="categoryClass(event.kategoria)">{{ event.kategoria }}</span></p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="upcomingEvents.length > 1" class="mt-4 flex justify-center gap-2 z-20">
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
      <button @click="next(true)" class="nav next rubik-dirt-regular text-9xl absolute top-1/2 -right-8 text-red-500" aria-label="Next slide">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getEvents } from '@/api/events'
import { useRouter } from 'vue-router'

const upcomingEvents = ref([])
const currentIndex = ref(0)
const paused = ref(false)
let autoInterval = null
const AUTO_MS = 4000
const router = useRouter()

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

function categoryClass(cat) {
  const c = (cat || '').toString().toLowerCase()
  if (c.includes('koncert')) return 'bg-red-700'
  if (c.includes('party')) return 'bg-purple-700'
  if (c.includes('egy')) return 'bg-teal-600'
  return 'bg-blue-600'
}
function openDetail(ev) {
  if (!ev) return
  // prefer id property; fall back to index-like id or slug
  const id = ev.id || ev._id || ev.slug || ev.name || ev.title
  router.push({ name: 'EventDetail', params: { id } }).catch(() => {})
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

  align-items: center;
  gap: 1rem;
  text-align: left;
}

.event-item img {
  /*width: 80px;
  height: 80px;*/
  object-fit: cover;
  background: #fdd;
}

.nav {
  transform: translateY(-50%);
  background: transparent;
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


.squiggle {
    filter: url(#squiggle);
}
.noise{
    filter: url(#nnnoise-filter);
}
</style>
