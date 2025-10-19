<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const editorContainer = ref<HTMLElement | null>(null)
let quill: Quill | null = null
const STORAGE_KEY = 'trafo:admin:privacy'

onMounted(() => {
  if (!editorContainer.value) return

  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  })

  // load saved content if present
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && quill) quill.root.innerHTML = raw
  } catch (_) {}
})

onBeforeUnmount(() => {
  quill = null
})

async function saveContent() {
  if (!quill) return
  try {
    const html = quill.root.innerHTML
    localStorage.setItem(STORAGE_KEY, html)

    // Küldjük a szerverre is
    const res = await fetch('http://localhost:3000/adatkezelesi/1', {
      method: 'PUT', // létező elem frissítése
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: html
      })
    })

    if (!res.ok) throw new Error('HTTP hiba: ' + res.status)
    alert('Mentve szerverre is!')
  } catch (e) {
    console.error('save failed', e)
    alert('Mentés sikertelen')
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Adatkezelési tájékoztató szerkesztő</h2>
      <div>
        <button @click="saveContent" class="px-3 py-1 bg-blue-600 text-white rounded">
          Mentés
        </button>
      </div>
    </div>

    <div class="bg-white border rounded">
      <div ref="editorContainer" style="min-height: 300px" />
    </div>
  </div>
</template>

<style scoped>
/* small tweak to ensure Quill editor inherits container styles */
.ql-container {
  min-height: 300px;
}
</style>
