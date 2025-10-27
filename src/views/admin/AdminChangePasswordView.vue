<template>
  <div class="change_password max-w-xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Admin jelszó megváltoztatása</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <label class="block">
        <div class="text-sm text-gray-900">Új jelszó</div>
        <input v-model="newPassword" type="password" class="mt-1 block w-full border-1 rounded border-gray-400 bg-gray-200/20 h-8" />
      </label>
      <label class="block">
        <div class="text-sm text-gray-900">Új jelszó megerősítése</div>
        <input v-model="confirm" type="password" class="mt-1 block w-full border-1 rounded border-gray-400 bg-gray-200/20 h-8" />
      </label>
      <div class="actions">
        <button type="submit" class="mentes px-3 py-1 bg-red-700 text-gray-200 rounded cursor-pointer hover:bg-red-800 transition">Mentés</button>
      </div>
      <p v-if="message" class="msg text-green-700 mt-2">{{ message }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const newPassword = ref('')
const confirm = ref('')
const message = ref('')

function submit() {
  message.value = ''
  if (!newPassword.value) {
    message.value = 'Password cannot be empty'
    return
  }
  if (newPassword.value !== confirm.value) {
    message.value = 'Passwords do not match'
    return
  }
  try {
    // store override password in localStorage (for local/dev only)
    localStorage.setItem('trafo:admin-password-override', newPassword.value)
    message.value = 'Password saved (stored locally)'
    newPassword.value = ''
    confirm.value = ''
  } catch (e) {
    message.value = 'Failed to save password'
  }
}
</script>

<style scoped>
.change-password { padding: 1rem }
.actions { margin-top: 1rem }
.msg { margin-top: .5rem; color: #064e3b }
button.mentes{
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}
button:hover{

}
</style>
