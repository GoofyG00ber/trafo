<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="content" v-html="content"></div>
    <div v-else class="text-gray-500">Nincs elérhető adatkezelési tartalom.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'trafo:adatkezelesi'
const content = ref<string>('')

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) content.value = raw
  } catch (_) {
    content.value = ''
  }
})
</script>
