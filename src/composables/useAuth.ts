import { ref } from 'vue'
import { useRouter } from 'vue-router'

const STORAGE_KEY = 'trafo:admin-token'

export function useAuth() {
  const isAuthenticated = ref<boolean>(!!localStorage.getItem(STORAGE_KEY))

  function login(password: string) {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? ''
    if (!expected) {
      // No password configured — fail hard to avoid accidental access
      return false
    }
    if (password === expected) {
      localStorage.setItem(STORAGE_KEY, '1')
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}
