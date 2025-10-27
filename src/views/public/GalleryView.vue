<script lang="ts"></script>

<template>
  <div class="gallery-page min-h-screen bg-black text-white flex flex-col items-center pt-16 pb-24">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-red-600 mb-10">
      Galéria
    </h1>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-12 max-w-7xl w-full"
    >
      <div
        v-for="(img, i) in images"
        :key="i"
        class="group relative overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        @click="openLightbox(i)"
      >
        <img
          :src="img"
          :alt="`Kép ${i + 1}`"
          class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div
          class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <p class="text-center font-bold tracking-wider text-lg text-white drop-shadow-md">
            BULI #{{ i + 1 }}
          </p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50"
      >
        <button
          @click="closeLightbox"
          class="absolute top-6 right-8 text-red-500 text-4xl font-bold hover:scale-110 transition-transform"
          aria-label="Bezárás"
        >
          ✕
        </button>

        <div class="flex items-center justify-center gap-6">
          <button
            @click="prevImage"
            class="text-red-500 text-5xl font-bold hover:scale-110 transition-transform"
          >
            <
          </button>

          <img
            :src="images[currentIndex]"
            :alt="`Kép ${currentIndex + 1}`"
            class="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg transition-all duration-500"
          />

          <button
            @click="nextImage"
            class="text-red-500 text-5xl font-bold hover:scale-110 transition-transform"
          >
            >
          </button>
        </div>

        <div class="flex items-center gap-4 mt-6">
          <button
            @click="toggleSlideshow"
            class="primary bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded text-white font-semibold uppercase text-sm tracking-wide"
          >
            {{ slideshowActive ? 'Megállítás' : 'Diavetítés' }}
          </button>
        </div>

        <p class="mt-4 text-gray-400 text-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const images = Array.from({ length: 20 }, (_, i) => `/placeholder${i + 1}.jpg`)

const lightboxOpen = ref(false)
const currentIndex = ref(0)
const slideshowActive = ref(false)
let slideshowInterval = null

function openLightbox(index) {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  slideshowActive.value = false
  clearInterval(slideshowInterval)
  document.body.style.overflow = ''
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + images.length) % images.length
}

function toggleSlideshow() {
  slideshowActive.value = !slideshowActive.value
  if (slideshowActive.value) {
    slideshowInterval = setInterval(() => {
      nextImage()
    }, 1500)
  } else {
    clearInterval(slideshowInterval)
  }
}

function handleKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<style scoped>
.gallery-page {
  background: radial-gradient(circle at top, #1a1a1a 0%, #000 80%);
}

/* Fade animáció a lightboxhoz */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
button:hover {
  cursor: pointer;
  transform: translateY(-2px);
}
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
</style>


