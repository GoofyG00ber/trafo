import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import ProgramsView from '../views/public/ProgramsView.vue'
import AboutView from '../views/public/AboutView.vue'
import GalleryView from '../views/public/GalleryView.vue'
import EventDetail from '../views/public/EventDetail.vue'
import ASZFView from '@/views/public/ASZFView.vue'
import AdatkezelesiView from '@/views/public/AdatkezelesiView.vue'
import AdminView from '../views/admin/AdminView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminChangePasswordView from '../views/admin/AdminChangePasswordView.vue'
import AdminEventsView from '../views/admin/AdminEventsView.vue'
import AdminVezerView from '../views/admin/AdminVezerView.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/programs', name: 'Programs', component: ProgramsView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/gallery', name: 'Gallery', component: GalleryView },
  { path: '/ASZF', name: 'Gallery', component: ASZFView },
  { path: '/privacy-policy', name: 'Gallery', component: AdatkezelesiView },
  { path: '/events/:id', name: 'EventDetail', component: EventDetail },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginView },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true },
    children: [
      { path: 'change-password', name: 'AdminChangePassword', component: AdminChangePasswordView },
      { path: 'events', name: 'AdminEvents', component: AdminEventsView },
      { path: 'vezer', name: 'AdminVezer', component: AdminVezerView },
      { path: '', redirect: { name: 'AdminChangePassword' } },
    ],
  },
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
