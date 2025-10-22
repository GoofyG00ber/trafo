<template>
  <div class="bg-zinc-800 shadow-[0_-20px_30px_-10px_rgba(0,0,0,0.5)] w-full overflow-hidden -mt-10 md:-mt-40 relative overflow-hidden">
    <div class="h-full w-full bg-[url('@/components/imgs/trafo_pattern.png')] bg-cover bg-center absolute z-1"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 z-20 relative">
      <div class="flex flex-col justify-center pt-10 md:py-10 px-10 md:px-0 md:pl-10">
        <h2 class="text-gray-100 belanosima-bold text-5xl mb-6">Látogass el hozzánk</h2>
        <p class="text-gray-300 rowdies-light text-lg mb-4 text-justify">
          A Trafo Club Gödöllő egyik ikonikus szórakozóhelye, ahol a zene, a közösség és az élmény találkozik. Az évek során klubunk a város kulturális életének meghatározó pontjává vált — hely, ahol a legjobb hazai zenekarok, DJ-k és előadók lépnek színpadra, és ahol minden este új energiával telik meg a tér.
          A Trafo nem csupán egy koncerthelyszín: egy közösségi tér, ahol a barátok találkoznak, új kapcsolatok születnek, és a zene szeretete összeköt mindenkit. Hangulatunk egyszerre modern és nosztalgikus — a falakat áthatja a klubtörténelem, miközben mindig friss, lendületes programokkal várjuk vendégeinket.
          Legyen szó élő koncertekről, tematikus bulikról, elektronikus zenei estekről vagy akusztikus fellépésekről, nálunk mindenki megtalálja a saját stílusát. A célunk, hogy a Trafó minden látogatása emlékezetes legyen — legyen az egy fergeteges koncert, egy spontán tánc hajnalig, vagy csak egy laza este a barátokkal.
          Gyere el, fedezd fel a Trafó Klub egyedi atmoszféráját, és légy része annak a közösségnek, ahol a zene soha nem áll meg.
        </p>
      </div>

      <div class="relative h-full flex items-center justify-center">
        <img
          src="/src/components/imgs/gallery.png"
          alt="" aria-hidden="true"
          class="pointer-events-none select-none h-full w-auto object-cover
                -rotate-90 md:rotate-0"
        />
        <router-link
          to="/gallery"
          class="absolute text-red-700 rubik-dirt-regular bottom-20 md:bottom-1/2 text-7xl lg:9xl z-10 -rotate-10 hover:scale-105 transition-transform duration-200 hover:opacity-75 text-shadow-lg"
        >
          GALÉRIA&gt;
        </router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
