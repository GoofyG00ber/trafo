import { ref } from 'vue'

const STORAGE_KEY = 'trafo:admin-token'
const DEFAULT_PERSIST_HOURS = 24 // default persistence duration when "keep me logged in" is checked

function loadFromStorage(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const obj = JSON.parse(raw) as { v: string; expires?: number }
    if (!obj || !obj.expires) return false
    if (Date.now() > obj.expires) {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY)
    return false
  }
}

// Module-level shared ref so every caller sees the same auth state
const isAuthenticated = ref<boolean>(loadFromStorage())

export function useAuth() {

  // login(password, keep=false, hours=DEFAULT_PERSIST_HOURS)
  // - keep=false: session-only (in-memory) login; not persisted across reloads
  // - keep=true: persist in localStorage with expiry (hours)
  function login(password: string, keep = false, hours = DEFAULT_PERSIST_HOURS) {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? ''
    if (!expected) return false
    if (password !== expected) return false

    if (keep) {
      const expires = Date.now() + Math.max(1, hours) * 60 * 60 * 1000
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: '1', expires }))
      } catch (e) {
        // ignore storage errors
      }
      isAuthenticated.value = true
    } else {
      // session-only: do not persist, just set in-memory flag
      isAuthenticated.value = true
    }

    return true
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}
