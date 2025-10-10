<template>
  <nav class="nav">
    <div class="container">
      <router-link to="/" class="logo">Trafo</router-link>
      <ul class="links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/programs">Programs</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li v-if="auth"><a @click.prevent="doLogout" href="#">Sign out</a></li>
        <li v-else><router-link to="/admin/login">Admin</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const auth = computed(() => isAuthenticated.value)

function doLogout() {
  logout()
  router.push('/')
}
</script>

<style scoped>
.nav {
  background: var(--bg, #b5b4b4);
  border-bottom: 1px solid #e5e7eb;
}
.container {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
}
.logo {
  font-weight: 700;
  font-size: 1.125rem;
  color: inherit;
  text-decoration: none;
}
.links {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
.links a {
  color: inherit;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}
.links a.router-link-active {
  background: #111827;
  color: white;
}
</style>
