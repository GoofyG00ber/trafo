<template>
  <div class="about-page bg-neutral-900 text-gray-200 min-h-screen py-16 px-6 md:px-12">
    <div class="max-w-6xl mx-auto space-y-16">
      <header class="text-center">
        <h1 class="text-5xl font-extrabold text-red-600 mb-3 tracking-wider">RÓLUNK</h1>
        <p class="text-gray-400 italic">Ismerd meg a TrafoClub világát</p>
      </header>
      <section>
        <h2 class="section-title">Tömegközlekedéssel</h2>
        <ul class="list-disc ml-6 space-y-1">
          <li>BKV Gödöllői HÉV vonal menetrendje</li>
          <li>
            Éjszakai buszjárat
          </li>
          <li>Volánbusz menetrend információs oldal</li>
          <li>Vasúti menetrend adatbázis</li>
        </ul>
      </section>

      <section>
        <h2 class="section-title">TrafoClub logók</h2>
        <p class="mb-2">A TrafoClub logóit megváltoztatni tilos!</p>
        <div class="flex flex-wrap gap-4 items-center">
          <a href="/TC_logo_2013_tn.png" download class="logo-link">Trafoclub logó (PNG)</a>
          <a href="/TC_logo_2013_tn.ai" download class="logo-link">Trafoclub logó (AI)</a>
        </div>

        <p class="mt-6">
          Régmúlt:<br />
          A TrafoClub régi “zöld” oldalát itt tekinthetitek meg:
          <a href="http://www.trafoclub.hu/oldtrafo/index.html" class="text-red-500 hover:underline">OldTrafoClubGreen</a><br />
          A TrafoClub régi "piros" oldalát itt tekinthetitek meg:
          <a href="http://www.trafoclub.hu/index.php" class="text-red-500 hover:underline">OldTrafoClubRed</a>
        </p>
      </section>
      <section>
        <h2 class="section-title">Szolgáltatások</h2>
        <ul class="grid md:grid-cols-2 gap-2 list-disc ml-6">
          <li>Koncertterem</li>
          <li>15 méteres bárpult</li>
          <li>Koktélsarok</li>
          <li>Biliárd, csocsó, darts</li>
          <li>Kerthelyiség + “magaslati terasz”</li>
          <li>Ping-pong</li>
        </ul>
      </section>
      <section>
        <h2 class="section-title">Technika</h2>

        <div class="space-y-8">
          <div>
            <h3 class="sub-title">Hangtechnika</h3>
            <ul class="list-disc ml-6 text-sm space-y-1">
              <li><strong>PA:</strong> Top: 2×(15”+4×6,5”+1”), Sub: 2×(2×18”)</li>
              <li>2× Pálfi Audio 4way Aktív Crossover</li>
              <li>Keverőpult: MIDAS VENICE U 32</li>
              <li>Effektek: DBX, Proel, Alesis</li>
              <li>Monitor: 4 út, 6-ra bővíthető</li>
              <li>Mikrofonok: Shure, Sennheiser, Audix, AKG, Beyerdynamic</li>
            </ul>
          </div>

          <div>
            <h3 class="sub-title">Színpad méretei</h3>
            <p>3,4m × 8m × 0,45m, belmagasság: 2,5m</p>
          </div>

          <div>
            <h3 class="sub-title">DJ Technika</h3>
            <ul class="list-disc ml-6 text-sm space-y-1">
              <li>2× Pioneer CDJ-200, 2× CDJ-1000 MK3</li>
              <li>Pioneer DJM-600 keverő</li>
            </ul>
          </div>

          <div>
            <h3 class="sub-title">Fénytechnika</h3>
            <p>Fényvezérlő: Avolites Azure 2000</p>
            <ul class="list-disc ml-6 text-sm space-y-1">
              <li>DTS, Pulsar, Stairville és INVOLIGHT rendszerek</li>
              <li>LED RGB Chroma Batten, UV fények, tükörgömb</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<style scoped>
.about-page {
  background: radial-gradient(circle at top, #0a0a0a 0%, #000 85%);
  color: #d1d5db;
  font-family: 'Rowdies', 'Rubik', sans-serif;
}

/* Szekciók közti elválasztás */
.about-page section {
  position: relative;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.about-page section:last-child {
  border-bottom: none;
}

/* Fő címek */
.section-title {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #ef4444;
  text-transform: uppercase;
  text-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(239, 68, 68, 0.2);
  padding-bottom: 0.25rem;
}

/* Alcímek */
.sub-title {
  font-size: 1.25rem;
  color: #f87171;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Linkek */
.about-page a {
  color: #f87171;
  font-weight: 500;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}
.about-page a:hover {
  color: #fff;
  text-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
}

/* Logó gombok */
.logo-link {
  display: inline-block;
  background: linear-gradient(180deg, #1f1f1f 0%, #151515 100%);
  color: #f87171;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.25);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.15);
  transition: all 0.25s ease;
}
.logo-link:hover {
  background: linear-gradient(180deg, #ef4444 0%, #7f1d1d 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
}

/* Multimédia kártyák */
.about-page .grid > div {
  background: rgba(20, 20, 20, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.1);
}
.about-page .grid > div:hover {
  transform: scale(1.03);
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.25);
}

/* Listaelemek */
.about-page ul {
  list-style-type: disc;
}
.about-page li::marker {
  color: #ef4444;
}

/* Fejléc */
header h1 {
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
header p {
  color: #9ca3af;
}

/* Szép fade animáció, ha szekciók beúsznak */
.about-page section {
  opacity: 0;
  transform: translateY(15px);
  animation: fadeInUp 0.8s forwards;
}
.about-page section:nth-child(odd) {
  animation-delay: 0.1s;
}
.about-page section:nth-child(even) {
  animation-delay: 0.25s;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grid kártyák tipográfia */
.about-page h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ef4444;
}
.about-page p {
  line-height: 1.6;
}
</style>


