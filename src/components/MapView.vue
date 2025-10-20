<template>
  <div id="map" style="height: 250px; width: 100%;"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

onMounted(() => {
  const position = [47.59937506255122, 19.356952245169225];

  // Térkép inicializálása
  const map = L.map("map").setView(position, 15);

  // OpenStreetMap csempék
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  }).addTo(map);

  // Marker (pointer)
  const marker = L.marker(position).addTo(map);

  // Popup szöveg
});
</script>

<style scoped>
#map {
  border-radius: 12px;
}
</style>
