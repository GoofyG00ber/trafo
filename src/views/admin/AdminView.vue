<template>
  <div class="admin-layout flex min-h-screen">
    <aside class="sidebar w-56 bg-gray-100 border-r border-gray-200 p-4 min-h-screen">
      <h3 class="text-lg font-semibold mb-4">Admin</h3>
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.label">
          <component
            :is="item.action ? 'a' : 'router-link'"
            v-bind="item.action ? { href: '#', onClick: item.action } : { to: item.to }"
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            :class="item.danger ? 'text-red-600' : ''"
          >
            <span class="w-5 h-5" v-html="item.icon"></span>
            <span>{{ item.label }}</span>
          </component>
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

const menuItems = [
  {
    label: 'Események',
    to: '/admin/events',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 2v4M8 2v4M3 10h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'Vezér modal',
    to: '/admin/vezer',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="14" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'ÁSZF szerkesztő',
    to: '/admin/ASZF_editor',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13h8M8 17h8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'Adatkezelés',
    to: '/admin/Adatkezelesi_editor',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'Házirend',
    to: '/admin/hazirend_editor',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'Jelszó módosítás',
    to: '/admin/change-password',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 11V7a5 5 0 0110 0v4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    label: 'Kijelentkezés',
    action: doLogout,
    danger: true,
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 17l5-5-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12H9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 19V5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
]
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
