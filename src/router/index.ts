import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProgramsView from '../views/ProgramsView.vue'
import AboutView from '../views/AboutView.vue'
import AdminView from '../views/AdminView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/programs', name: 'Programs', component: ProgramsView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginView },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// simple navigation guard for admin routes
router.beforeEach((to, from, next) => {
  const auth = useAuth()
  if (to.meta && (to.meta as any).requiresAuth && !auth.isAuthenticated.value) {
    next({ path: '/admin/login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

export default router
