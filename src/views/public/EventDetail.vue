<template>
<div class="h-[80px]"></div>
  <div class="max-w-4xl mx-auto bg-zinc-900 rounded-xl shadow-md mb-12 text-gray-200 relative overflow-hidden w-[98%]">
    <button class="vissza mb-4 text-sm text-gray-200 absolute top-5 left-5 text-l bg-gray-800 hover:bg-gray-600 cursor-pointer z-10" @click="goBack">← Vissza</button>

    <div v-if="!event" class="text-center py-12">Betöltés…</div>

    <div v-else class="bg-zinc-900 rounded-xl shadow overflow-hidden z-1">
      <div
        class="h-100 bg-cover bg-top relative z-1"
        :style="{ backgroundImage: `url(${imageSrc(event)})` }"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 opacity-100 bottom-0"></div>
      </div>
      <div class="p-6 relative z-10 -mt-10">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-5xl md:text-6xl font-bold mb-1 -mt-10 rubik-dirt-regular">{{ event.nev || event.title }}</h1>
            <div class="text-lg text-gray-200">
              {{ formatDate(event.datum_ido || event.date || event.start) }}
            </div>
          </div>
          <div>
            <span
              :class="['px-3 py-1 rounded text-sm font-semibold text-gray-100 ml-2', categoryClass(event.kategoria)]"
            >
              {{ event.kategoria || 'egyéb' }}
            </span>
          </div>
        </div>

        <div class="prose mb-4 text-gray-200 text-lg text-justify">
          <p v-if="event.leiras || event.description">{{ event.leiras || event.description }}</p>
          <p v-else class="text-lg text-gray-600">Nincs részletes leírás.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <h3 class="text-lg font-semibold mb-1">Helyszín</h3>
            <div class="text-md text-red-600">Trafó Club</div>
          </div>
          <div class="justify-self-end">
            <div>
              <a
                v-if="event.tixa_link"
                :href="event.tixa_link"
                class="btn-primary inline-block px-4 py-2 bg-red-700 hover:bg-red-800 text-gray-200 font-semibold rounded"
                target="_blank"
                rel="noopener"
                >Jegyvásárlás a TIXA-n</a
              >
              <span v-else class="text-sm text-gray-500">Nincs jegylink megadva</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as eventsApi from '@/api/events'

const route = useRoute()
const router = useRouter()
const rawId = route.params.id
const id = Array.isArray(rawId) ? rawId[0] : rawId

const event = ref<any | null>(null)

async function loadEvent() {
  try {
    if (!id) {
      event.value = null
      return
    }

    // try direct fetch by id first
    try {
      const ev = await eventsApi.getEvent(id)
      if (ev) {
        event.value = ev
        return
      }
    } catch (_) {
      // ignore and fallback
    }

    // fallback: fetch all events and try to match by common fields
    const list = await eventsApi.getEvents()
    if (!Array.isArray(list)) {
      event.value = null
      return
    }

    const sid = String(id)
    const found = list.find((ev: any) => {
      if (!ev) return false
      // compare against several potential unique fields
      return (
        String(ev.id) === sid ||
        String(ev._id) === sid ||
        String(ev.slug) === sid ||
        String(ev.nev || ev.title || '').toLowerCase() === sid.toLowerCase()
      )
    })

    event.value = found || null
  } catch (e) {
    console.error('Failed to load event', e)
    event.value = null
  }
}

onMounted(loadEvent)

function goBack() {
  router.back()
}

function formatDate(s: string | undefined) {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function imageSrc(ev: any) {
  const k = ev?.kep || ev?.image || ev?.img || ev?.picture || ev?.thumbnail
  if (!k) return '/placeholder.png'
  try {
    const s = String(k)
    if (/^https?:\/\//.test(s)) return s
    if (s.startsWith('/')) return s
    return '/' + s.replace(/^\.?\//, '')
  } catch (_) {
    return '/placeholder.png'
  }
}

function categoryClass(cat: string | undefined) {
  const c = (cat || '').toString().toLowerCase()
  if (c.includes('koncert')) return 'bg-red-700'
  if (c.includes('buli')) return 'bg-purple-700'
  if (c.includes('egy')) return 'bg-teal-600'
  return 'bg-blue-600'
}
</script>

<style scoped>
.btn-primary {
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
.vissza{
  border-radius: 4px;
  padding:0.2rem 0.5rem;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
.vissza:hover{
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
</style>
