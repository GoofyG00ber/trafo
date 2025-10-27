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
  <div class="vezer max-w-6xl mx-auto p-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Adatkezelési tájékoztató szerkesztő</h2>
      <div>
        <button @click="saveContent" class="mentes px-3 py-1 bg-blue-600 text-gray-300 rounded">
          Mentés
        </button>
      </div>
    </div>

    <div class="bg-gray-100/60 border rounded">
      <div ref="editorContainer" style="min-height: 300px" />
    </div>
  </div>
</template>

<style scoped>
/* small tweak to ensure Quill editor inherits container styles */
.ql-container {
  min-height: 300px;
}
button.mentes{
  background: linear-gradient(to bottom, #42a5f5, #1565c0);
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
button:hover{
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
</style>
