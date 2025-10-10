<template>
  <div class="admin-layout flex min-h-screen">
    <aside class="sidebar w-56 bg-gray-100 border-r border-gray-200 p-4 min-h-screen">
      <h3 class="text-lg font-semibold mb-4">Admin</h3>
      <ul class="space-y-2">
        <li>
          <router-link
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            to="/admin/change-password"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2h6v-2zM6 13v4a2 2 0 002 2h8a2 2 0 002-2v-4"
              />
            </svg>
            <span>Change password</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            to="/admin/events"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
              />
            </svg>
            <span>Events</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            to="/admin/vezer"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 1.343-3 3v.2a3 3 0 003 3.8 3 3 0 003-3.8V11c0-1.657-1.343-3-3-3z"
              />
            </svg>
            <span>Vezer modal</span>
          </router-link>
        </li>
        <li>
          <a
            @click.prevent="doLogout"
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-red-600 cursor-pointer"
            href="#"
          >
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            <span>Sign out</span>
          </a>
        </li>
      </ul>
    </aside>
    <section class="content flex-1 p-6 bg-white min-h-screen">
      <router-view />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const { logout } = useAuth()
const router = useRouter()

function doLogout() {
  logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 60vh;
}
.sidebar {
  width: 220px;
  padding: 1rem;
  border-right: 1px solid #e5e7eb;
}
.content {
  flex: 1;
  padding: 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 0.5rem 0;
}
</style>
