<template>
  <footer v-if="!hide" class="footer bg-zinc-100">
    <div class="footer-top">
      <div class="supporters mx-auto max-w-[500px] grid grid-cols-1 gap-4 md:grid-cols-3 justify-items-center">
        <div class="order-2">
          <img src="./logos/hangfoglalo.jpg" alt="Támogató 1" />
        </div>
        <div class="order-1">
          <img src="./logos/kodex_rgb.jpg" alt="Támogató 2" />
        </div>
        <div class="order-3">
          <img src="./logos/nka.png" alt="Támogató 3" />
        </div>
      </div>
    </div>

    <hr class="divider" />

    <div class="w-full md:w-[90%] py-5 px-10 footer-bottom grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-items-start">
      <div class="footer-map w-full h-full">
        <MapView />
      </div>
      <div class="footer-info">
        <p><b>TrafoClub Gödöllő Palotakert</b></p>
        <p class="small">Gödöllő Palotakert 2100</p>
        <p class="small">+36 70 310 9528</p>
        <p class="small">trafoclub@gmail.com</p>
        <p class="small">Rendezvénytehnika: +36 70 312 3557</p>
        <p>© {{ year }} Trafo. All rights reserved.</p>
        <p class="small"><router-link to="/ASZF" class="text-red-700">ÁSZF</router-link></p>
        <p class="small">
          <router-link to="/privacy-policy" class="text-red-700">Adatkezelési tájékoztató</router-link>
        </p>
        <p class="small"><router-link to="/hazirend" class="text-red-700">Házirend</router-link></p>
      </div>
      <div class="footer-info md:border-l md:pl-4 w-full">
        <p class="pb-2"><b>Nyitvatartás</b></p>
        <div class="grid grid-cols-2 gap-0 w-full">
          <div>
            Hétfő
          </div>
          <div>
            Zárva
          </div>
          <div>
            Kedd
          </div>
          <div>
            Zárva
          </div>
          <div>
            Szerda
          </div>
          <div>
            Zárva
          </div>
          <div>
            Csütörtök
          </div>
          <div>
            Zárva
          </div>
          <div>
            Péntek
          </div>
          <div>
            19:00-04:00
          </div>
          <div>
            Szombat
          </div>
          <div>
            19:00-04:00
          </div>
          <div>
            Vasárnap
          </div>
          <div>
            Zárva
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hide = ref(false)

const checkRoute = () => {
  hide.value = route.path.includes('admin')
}
watch(route, checkRoute, { immediate: true })

const year = new Date().getFullYear()
import MapView from '@/components/MapView.vue'
</script>

<style scoped>
.footer {
  border-top: 1px solid #3f3f3fff;
  padding: 1rem 0;
  display: flex;
  gap: 5px;
  flex-direction: column;
}

.footer-top {
  text-align: center;
}

.footer-top h3 {
  margin-bottom: 10px;
}

.supporters {
}

.supporters img {
  height: 60px;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.supporters img:hover {
  opacity: 1;
  transform: scale(1.05);
}

.divider {
  border: none;
  border-top: 1px solid #000000ff;
  margin: 10px 0;
}

.footer-bottom {
}

.footer-map {
}

.footer-info {
}

.footer-info p {
  margin: 4px 0;
  color: #000000ff;
}

.footer-info .small {
  font-size: 0.9rem;
  color: #000000ff;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}
</style>
