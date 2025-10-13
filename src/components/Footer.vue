<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="supporters">
        <img src="./logos/hangfoglalo.jpg" alt="Támogató 1" />
        <img src="./logos/kodex_rgb.jpg" alt="Támogató 2" />
        <img src="./logos/nka.png" alt="Támogató 3" />
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-bottom">
      <div class="footer-map">
        <MapView />
      </div>
      <div class="footer-info">
        <p><b>TrafoClub Gödöllő Palotakert</b></p>
        <p class="small">Gödöllő Palotakert 2100</p>
        <p class="small">+36 70 310 9528</p>
        <p class="small">trafoclub@gmail.com</p>
        <p class="small">Rendezvénytehnika: +36 70 312 3557</p>
        <p class="small"><a link="rel" href="">Házirend</a></p>
      </div>
      <div class="footer-info">
        <p><b>Nyitvatartás</b></p>
        <table>
          <tbody>
            <tr>
              <td>Hétfő</td>
              <td>Zárva</td>
            </tr>
            <tr>
              <td>Kedd</td>
              <td>Zárva</td>
            </tr>
            <tr>
              <td>Szerda</td>
              <td>Zárva</td>
            </tr>
            <tr>
              <td>Csütörtök</td>
              <td>Zárva</td>
            </tr>
            <tr>
              <td>Péntek</td>
              <td>19:00 - 04:00</td>
            </tr>
            <tr>
              <td>Szombat</td>
              <td>19:00 - 04:00</td>
            </tr>
            <tr>
              <td>Vasárnap</td>
              <td>Zárva</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer-info">
        <p>© {{ year }} Trafo. All rights reserved.</p>
        <p class="small">Built with Vue 3</p>
        <p class="small"><router-link to="/ASZF">ÁSZF</router-link></p>
        <p class="small">
          <router-link to="/privacy-policy">Adatkezelési tájékoztató</router-link>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const year = new Date().getFullYear()
import MapView from '@/components/MapView.vue'
</script>

<style scoped>
.footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 0;
  background: var(--bg, #d4bebe);
  display: flex;
  gap: 5px;
  flex-direction: column;
}

.footer-top {
  text-align: center;
}

.footer-top h3 {
  margin-bottom: 10px;
  color: #444;
}

.supporters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
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
  border-top: 2px solid #ddd;
  margin: 10px 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
}

.footer-map {
  width: 400px;
  height: 250px;
  flex-shrink: 0;
  margin-left: 5%;
}

.footer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-info p {
  margin: 4px 0;
  color: #333;
}

.footer-info .small {
  font-size: 0.9rem;
  color: #555;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}
@media (max-width: 900px) {
  .footer {
    flex-direction: column;
    align-items: center;
  }

  .footer-left {
    width: 100%;
    height: 250px;
  }

  .footer-right {
    text-align: center;
  }
}
</style>
