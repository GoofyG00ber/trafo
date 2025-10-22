<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Belanosima:wght@400;600;700&family=Rowdies:wght@300;400;700&family=Rubik+Dirt&display=swap');
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg, #373737);
  overflow-x: hidden;
}
main {
  flex: 1 1 auto;
}

.rowdies-light {
  font-family: "Rowdies", sans-serif;
  font-weight: 300;
  font-style: normal;
}

.rowdies-regular {
  font-family: "Rowdies", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.rowdies-bold {
  font-family: "Rowdies", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.belanosima-regular {
  font-family: "Belanosima", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.belanosima-semibold {
  font-family: "Belanosima", sans-serif;
  font-weight: 600;
  font-style: normal;
}

.belanosima-bold {
  font-family: "Belanosima", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.rubik-dirt-regular {
  font-family: "Rubik Dirt", system-ui;
  font-weight: 400;
  font-style: normal;
}
</style>
