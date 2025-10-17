<template>
  <nav class="nav flex justify-center gap-8 bg-[#111] py-3 text-sm font-montserrat uppercase tracking-wide shadow-md shadow-black/50">
    <div class="container">
      <router-link to="/" class="logo">Trafo</router-link>
      <ul class="links">
        <li><router-link to="/" class="nav-link hover:text-red-500 hover:drop-shadow-[0_0_3px_#f00] hover:scale-105 transition-all duration-200">Főoldal</router-link></li>
        <li><router-link to="/programs" class="nav-link hover:text-red-500 hover:drop-shadow-[0_0_3px_#f00] hover:scale-105 transition-all duration-200">Programok</router-link></li>
        <li><router-link to="/about" class="nav-link hover:text-red-500 hover:drop-shadow-[0_0_3px_#f00] hover:scale-105 transition-all duration-200">Rólunk</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.nav {
  background: var(--bg, #121212);
}
.container {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: #3f3f3fff;
  font-family: 'Montserrat', sans-serif;
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
  color: red;
  opacity: 0.8;
}
.nav-link {
  -webkit-text-stroke: 1px #000000ff;   /* fekete körvonal */
  paint-order: stroke;        /* előbb körvonal, utána kitöltés */
  font-size: 1.1rem;
}

.nav-link:hover {
  -webkit-text-stroke: 1px #000000ff;   /* maradjon a fekete körvonal */
}
</style>
