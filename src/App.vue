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

  /* Alapszín (sötét betonárnyalat) */
  background-color: var(--bg, #373737);

  /* A te képed, plusz némi zaj és világos foltok */
  background-image:
    url('src/components/imgs/wall-texture-with-white-spots.jpg'),
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05), transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(0, 0, 0, 0.25), transparent 70%),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.015) 0px,
      rgba(255, 255, 255, 0.015) 2px,
      rgba(0, 0, 0, 0.04) 2px,
      rgba(0, 0, 0, 0.04) 4px
    );

  /* Térhatás */
  background-blend-mode: overlay;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  /* Finom sötét árnyék a széleken */
  box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.3);
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
