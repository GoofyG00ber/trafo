<template>
  <div class="vezer max-w-4xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Vezér Modal</h2>

    <!-- 🔀 Toggle -->
    <div class="flex items-center gap-3 pb-4">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" v-model="isManual" class="sr-only" />
        <div
          class="w-12 h-6 bg-gray-400 rounded-full relative transition"
          :class="{ 'bg-red-600': isManual }"
        >
          <div
            class="absolute top-1 left-1 bg-gray-100 w-4 h-4 rounded-full transition-transform"
            :class="{ 'translate-x-6': isManual }"
          ></div>
        </div>
        <span class="ml-3 text-sm text-gray-400">
          {{ isManual ? 'Manuális feltöltés' : 'Automatikus mód' }}
        </span>
      </label>
    </div>

    <!-- ℹ️ Mód magyarázat -->
    <p v-if="!isManual" class="text-sm text-gray-800">
      Az automatikus mód a következő közelgő eseményt tölti be automatikusan a modálba.
    </p>

    <!-- 🧾 Manuális űrlap -->
    <div v-if="isManual" class="space-y-4 border-t border-gray-400 pt-4">
      <label class="block">
        <div class="text-sm text-gray-800">Modal Cím</div>
        <input
          v-model="title"
          class="mt-1 block w-full rounded border border-gray-500 bg-gray-100 text-gray-800 p-2"
        />
      </label>

      <label class="block">
        <div class="text-sm text-gray-800">Modal Tartalom</div>
        <textarea
          v-model="content"
          class="mt-1 block w-full rounded border border-gray-500 bg-gray-100 text-gray-800 p-2 h-32"
        ></textarea>
      </label>

      <div>
        <label class="block text-sm text-gray-800 mb-1">Kép (fájl kiválasztása)</label>
        <input
          type="file"
          accept="image/*"
          @change="onKepChange"
          class="w-full px-3 py-2 border border-gray-500 rounded bg-gray-100 text-gray-800"
        />
        <p class="text-xs text-gray-400 mt-1">
          A kiválasztott kép fájlneve kerül mentésre az adatbázisba.
        </p>
      </div>

      <div>
        <label class="block text-sm text-gray-800 mb-1">Vagy válassz eseményt</label>
        <select
          v-model="selectedEvent"
          class="w-full rounded border border-gray-500 bg-gray-100 text-gray-800 p-2"
        >
          <option value="">— Nincs kiválasztva —</option>
          <option v-for="e in events" :key="e.id" :value="e.id">
            {{ e.nev || e.title }}
          </option>
        </select>
      </div>

      <div class="actions mt-4 flex justify-between items-center">
        <button
          @click="save"
          class="mentes px-3 py-1 bg-red-700 text-gray-200 rounded cursor-pointer hover:bg-red-800 transition"
        >
          Mentés
        </button>
        <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getEvents } from '@/api/events'

interface EventData {
  id: string | number
  nev?: string
  title?: string
}

/* --- Állapotok --- */
const isManual = ref(false)
const title = ref('')
const content = ref('')
const message = ref('')
const selectedEvent = ref('')
const events = ref<EventData[]>([])

/* --- Alapadatok betöltése onMounted --- */
onMounted(async () => {
  // betöltés localStorage-ból
  const savedMode = JSON.parse(localStorage.getItem('trafo:vezerMode') || 'false')
  isManual.value = !!savedMode

  const savedData = JSON.parse(localStorage.getItem('trafo:vezer') || '{}')
  title.value = savedData.title || ''
  content.value = savedData.content || ''
  selectedEvent.value = savedData.selectedEvent || ''

  try {
    const data = await getEvents()
    events.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Események betöltése sikertelen:', err)
  }
})

/* --- Toggle figyelése és mentése --- */
watch(isManual, (val) => {
  localStorage.setItem('trafo:vezerMode', JSON.stringify(val))
})

/* --- Kép feltöltés --- */
async function onKepChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (file) {
    try {
      // A fájl fel van töltve
      console.log('Fájl kiválasztva:', file.name)
    } catch (e) {
      const error = e as Error
      alert('Kép feltöltése sikertelen: ' + error.message)
    }
  }
}

/* --- Mentés gomb --- */
async function save() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  const file = fileInput?.files?.[0]

  let imageData = ''
  if (file) {
    // fájl beolvasása base64-re
    imageData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    localStorage.setItem('trafo:vezerImage', imageData)
  }

  const data = {
    title: title.value,
    content: content.value,
    selectedEvent: selectedEvent.value,
  }

  localStorage.setItem('trafo:vezer', JSON.stringify(data))
  message.value = 'Sikeresen mentve!'
  setTimeout(() => (message.value = ''), 2000)
}
</script>

<style scoped>
.vezer {
  padding: 1rem;
}
button.mentes{
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}
button:hover{

}
</style>
