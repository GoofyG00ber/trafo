<template>
  <div class="change-password max-w-md">
    <h2 class="text-2xl font-semibold mb-4">Change Admin Password</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <label class="block">
        <div class="text-sm text-gray-700">New password</div>
        <input v-model="newPassword" type="password" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
      </label>
      <label class="block">
        <div class="text-sm text-gray-700">Confirm</div>
        <input v-model="confirm" type="password" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
      </label>
      <div class="actions">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
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
</style>
