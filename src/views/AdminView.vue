<template>
  <div class="admin">
    <div class="container">
      <h1>Admin panel</h1>
      <p>Secure area — only visible when signed in.</p>
      <div class="actions">
        <button @click="doLogout">Sign out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { logout } = useAuth()
const router = useRouter()

function doLogout() {
  logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.container {
  padding: 2rem;
}
.actions {
  margin-top: 1rem;
}
</style>
