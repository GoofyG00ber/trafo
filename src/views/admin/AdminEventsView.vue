<template>
  <div class="events max-w-2xl">
    <h2 class="text-2xl font-semibold mb-4">Events</h2>
    <form @submit.prevent="addEvent" class="flex gap-2 mb-4">
      <input v-model="newTitle" placeholder="Event title" class="flex-1 rounded border-gray-300 p-2" />
      <input v-model="newDate" type="date" class="rounded border-gray-300 p-2" />
      <button type="submit" class="px-3 py-2 bg-green-600 text-white rounded">Add</button>
    </form>

    <ul class="space-y-2">
      <li v-for="(e, idx) in events" :key="idx" class="flex items-center justify-between bg-gray-50 p-3 rounded">
        <div>
          <div class="font-medium">{{ e.title }}</div>
          <div class="text-sm text-gray-500">{{ e.date }}</div>
        </div>
        <div class="flex gap-2">
          <button @click="edit(idx)" class="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
          <button @click="remove(idx)" class="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
        </div>
      </li>
    </ul>

    <div v-if="editing !== null" class="editor mt-4 p-4 bg-white border rounded">
      <h3 class="text-lg font-medium mb-2">Edit event</h3>
      <div v-if="current" class="space-y-2">
        <input v-model="current.title" class="block w-full rounded border-gray-300 p-2" />
        <input v-model="current.date" type="date" class="block rounded border-gray-300 p-2" />
        <div class="flex gap-2">
          <button @click="saveEdit" class="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
          <button @click="cancelEdit" class="px-3 py-2 bg-gray-300 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Ev = { title: string; date: string }

const events = ref<Ev[]>(JSON.parse(localStorage.getItem('trafo:events') || '[]'))
const newTitle = ref('')
const newDate = ref('')
const editing = ref<number | null>(null)

const current = computed(() => (editing.value !== null ? events.value[editing.value] : null))

function persist() {
  localStorage.setItem('trafo:events', JSON.stringify(events.value))
}

function addEvent() {
  if (!newTitle.value) return
  events.value.push({ title: newTitle.value, date: newDate.value })
  newTitle.value = ''
  newDate.value = ''
  persist()
}

function remove(i: number) {
  events.value.splice(i, 1)
  persist()
}

function edit(i: number) {
  editing.value = i
}

function saveEdit() {
  editing.value = null
  persist()
}

function cancelEdit() {
  editing.value = null
}
</script>

<style scoped>
.events { padding: 1rem }
.events ul { margin-top: 1rem }
.editor { margin-top: 1rem; padding: .5rem; border: 1px solid #e5e7eb }
</style>
