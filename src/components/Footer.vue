<template>
  <footer class="footer">
    <div class="container">
      <p>© {{ year }} Trafo. All rights reserved.</p>
      <p class="small">Built with Vue 3</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 0;
  background: var(--bg, #d4bebe);
}
.container {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}
.small {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
