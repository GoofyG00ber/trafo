<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="content" class="ql-snow">
      <div class="ql-editor prose" v-html="content"></div>
    </div>
    <div v-else class="text-gray-600">A házirend még nem érhető el.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// bring in Quill styles so the saved HTML looks as edited in the admin
import 'quill/dist/quill.snow.css'

const STORAGE_KEY = 'trafo:admin:hazirend'
const content = ref<string>('')

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) content.value = raw
  } catch (e) {
    console.error('Failed to load hazirend content', e)
  }
})
</script>

<style scoped>
.prose {
  line-height: 1.6;
}
</style>
