<template>
  <div class="vezer max-w-2xl">
    <h2 class="text-2xl font-semibold mb-4">Vezer Modal</h2>
    <label class="block mb-2">
      <div class="text-sm text-gray-700">Modal title</div>
      <input v-model="title" class="mt-1 block w-full rounded border-gray-300 p-2" />
    </label>
    <label class="block">
      <div class="text-sm text-gray-700">Modal content</div>
      <textarea v-model="content" class="mt-1 block w-full rounded border-gray-300 p-2 h-40"></textarea>
    </label>
    <div class="actions mt-4">
      <button @click="save" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
    <p v-if="message" class="msg text-green-700 mt-2">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const saved = JSON.parse(localStorage.getItem('trafo:vezer') || '{}')
const title = ref(saved.title || '')
const content = ref(saved.content || '')
const message = ref('')

function save() {
  localStorage.setItem('trafo:vezer', JSON.stringify({ title: title.value, content: content.value }))
  message.value = 'Saved'
}
</script>

<style scoped>
.vezer { padding: 1rem }
.actions { margin-top: 1rem }
.msg { margin-top: .5rem }
</style>
