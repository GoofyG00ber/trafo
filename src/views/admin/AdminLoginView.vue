<template>
  <div class="admin-login">
    <div class="card">
      <h1>Admin belépés</h1>
      <form @submit.prevent="submit">
        <label>
          Jelszó
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>
        <label class="keep">
          <input type="checkbox" v-model="keep" /> Maradjon bejelentkezve
        </label>
        <div class="actions">
          <button type="submit">Bejelentkezés</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const password = ref('')
const keep = ref(false)
const error = ref('')
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

async function submit() {
  error.value = ''
  const ok = login(password.value, keep.value)
  if (ok) {
    const redirectTo = (route.query.redirect as string) || '/admin'
    await router.replace(redirectTo)
  } else {
    error.value = 'Invalid password'
  }
}
</script>

<style scoped>
.admin-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 96px);
}
.card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 320px;
  background: white;
}
label {
  display: block;
}
input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.actions {
  margin-top: 1rem;
}
.error {
  color: #b91c1c;
  margin-top: 0.5rem;
}
</style>
