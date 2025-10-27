<template>
  <div class="change_password max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-4">Admin jelszó megváltoztatása</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <label class="block">
        <div class="text-sm text-gray-200">Új jelszó</div>
        <input v-model="newPassword" type="password" class="mt-1 block w-full rounded border-gray-900 shadow-lg bg-gray-200/20" />
      </label>
      <label class="block">
        <div class="text-sm text-gray-200">Új jelszó megerősítése</div>
        <input v-model="confirm" type="password" class="mt-1 block w-full rounded border-gray-300 shadow-lg bg-gray-200/20" />
      </label>
      <div class="actions">
        <button type="submit" class="mentes px-4 py-2 bg-blue-600 text-gray-300 rounded">Mentés</button>
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
