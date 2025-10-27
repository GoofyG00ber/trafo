<template>
  <div class="admin-login">
    <div class="card">
      <h1 class="text-2xl font-bold text-center pb-5">Admin belépés</h1>
      <form @submit.prevent="submit">
        <label>
          Jelszó
          <input v-model="password" type="password" autocomplete="current-password" class="w-full"/>
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <label class="keep text-left pt-2">
          <input type="checkbox" v-model="keep"/> Maradjak bejelentkezve
        </label>
        <div class="actions text-right">
          <button type="submit" class="mt-4 px-4 py-2 bg-red-700 text-zinc-50 rounded-sm hover:bg-red-900 cursor-pointer">Bejelentkezés</button>
        </div>
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
  background: rgb(231, 230, 230);
}
label {
  display: block;
}
input {
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
