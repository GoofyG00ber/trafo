<template>
  <div class="bg-zinc-800 min-h-[500px] w-full overflow-hidden -mt-40 relative">
    <div class="min-h-[500px] w-full bg-[url('@/components/imgs/trafo_pattern.png')] bg-cover bg-center absolute"></div>
    <div class="grid grid-cols-2 gap-4 p-10 min-h-[500px]">
      <div class="flex justify-center items-left flex-col">
        <h2 class="text-white belanosima-bold text-5xl mb-6">Látogass el hozzánk</h2>
        <p class="text-gray-300 rowdies-light text-lg mb-4 text-justify">
          A Trafo Club Gödöllő egyik ikonikus szórakozóhelye, ahol a zene, a közösség és az élmény találkozik. Az évek során klubunk a város kulturális életének meghatározó pontjává vált — hely, ahol a legjobb hazai zenekarok, DJ-k és előadók lépnek színpadra, és ahol minden este új energiával telik meg a tér.
          A Trafo nem csupán egy koncerthelyszín: egy közösségi tér, ahol a barátok találkoznak, új kapcsolatok születnek, és a zene szeretete összeköt mindenkit. Hangulatunk egyszerre modern és nosztalgikus — a falakat áthatja a klubtörténelem, miközben mindig friss, lendületes programokkal várjuk vendégeinket.
          Legyen szó élő koncertekről, tematikus bulikról, elektronikus zenei estekről vagy akusztikus fellépésekről, nálunk mindenki megtalálja a saját stílusát. A célunk, hogy a Trafó minden látogatása emlékezetes legyen — legyen az egy fergeteges koncert, egy spontán tánc hajnalig, vagy csak egy laza este a barátokkal.
          Gyere el, fedezd fel a Trafó Klub egyedi atmoszféráját, és légy része annak a közösségnek, ahol a zene soha nem áll meg.
        </p>
      </div>
      <div class="flex justify-center items-end">
          <img
          src="/src/components/imgs/gallery.png"
          alt="" aria-hidden="true"
          class="absolute z-1 -bottom-3 right-20
                max-w-none h-[120%] object-contain
                pointer-events-none select-none"
        />
        <router-link to="/gallery" class="text-red-700 rubik-dirt-regular text-7xl z-10">GALÉRIA></router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
