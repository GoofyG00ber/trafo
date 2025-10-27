<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import Gallery from '@/components/Gallery.vue'
import VezerModal from '@/components/VezerModal.vue'
</script>

<template>
  <img src="/src/components/imgs/rustic-gray-concrete-textured-background.jpg" class="absolute w-full mix-blend-multiply opacity-50"/>
  <div class="h-[80px]"></div>
  <div class="overflow-x-hidden">
    <svg width="736" height="753" viewBox="0 0 736 753" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute z-0 top-5  w-[140vw] md:w-[70vw] left-0 md:-left-50">
     <g filter="url(#filter0_g_2244_530)"> <path d="M731.484 4L679.801 748.44L4 170.219L731.484 4Z" fill="#751407"/>
       <path d="M679.371 747.415L5.07965 170.484L730.94 4.63665L679.371 747.415Z" stroke="#751407"/>
     </g>
     <defs>
      <filter id="filter0_g_2244_530" x="0" y="0" width="735.484" height="752.44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="6536" />
        <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
        <feMerge result="effect1_texture_2244_530">
          <feMergeNode in="displacedImage"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
  <svg width="557" height="534" viewBox="0 0 557 534" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute z-0 top-30 right-10 w-[140vw] md:w-[25vw]">
  <g filter="url(#filter0_g_2244_535)">
  <rect x="121.279" y="4" width="450" height="415" transform="rotate(16.4154 121.279 4)" fill="#555555"/>
  </g>
  <defs>
  <filter id="filter0_g_2244_535" x="0" y="0" width="556.936" height="533.254" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="6536" />
  <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
  <feMerge result="effect1_texture_2244_535">
  <feMergeNode in="displacedImage"/>
  </feMerge>
  </filter>
  </defs>
  </svg>
  </div>

  <div class="relative z-100">
    <VezerModal />
  </div>
  <div class="relative z-2">
      <Hero />
  </div>
  <div class="-mt-15 md:-mt-30 bg-[url(src\components\imgs\wall-texture-with-white-spots.jpg)] bg-cover bg-center bg-fixed relative z-0 shadow-[inset_0_20px_30px_-10px_rgba(0,0,0,0.7)] ">
    <h1 class="md:-mt-30 text-center text-[30vw] text-red-700 belanosima-bold tracking-widest mix-blend-multiply leading-none">trafo</h1>
  </div>
  <div class="relative z-1">
    <Gallery />
  </div>
</template>
