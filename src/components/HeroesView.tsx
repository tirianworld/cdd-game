import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { X, Check } from 'lucide-react';

type SortOption = 'cc' | 'vida' | 'damage' | 'bond';

export interface CanonicalHeroItem {
  id: string;
  name: string;
  title: string;
  rarity: 'SSR' | 'SR' | 'R';
  attribute: 'Divino' | 'Natural' | 'Profano' | 'Arcano';
  portrait: string;
  frame: string;
  orb: string;
  level: number;
  hp: number;
  attack: number;
  defense: number;
  cc: number;
  isLocked?: boolean;
  bio?: string;
}

export const CANONICAL_HEROES_LIST: CanonicalHeroItem[] = [
  // --- ROW 1 (5 heroes) ---
  {
    id: 'chispo_deez',
    name: 'Chispo Deez',
    title: 'Guerrero Enano Alado',
    rarity: 'SR',
    attribute: 'Divino',
    portrait: '/assets/portraits/chispo_deez_icono.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo fe.png',
    level: 1,
    hp: 1320,
    attack: 270,
    defense: 220,
    cc: 1395,
    bio: 'Veterano guerrero del clan forjador, porta el yelmo alado ceremonial bendecido por la llama celestial.',
  },
  {
    id: 'kurogame',
    name: 'Kurogame',
    title: 'Guardián Acorazado',
    rarity: 'SR',
    attribute: 'Divino',
    portrait: '/assets/portraits/kurogame_icono.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo fe.png',
    level: 1,
    hp: 1200,
    attack: 260,
    defense: 230,
    cc: 1380,
    bio: 'Caballero impasible de armadura negra, consagrado a la defensa sagrada de los bastiones de Moonhaven.',
  },
  {
    id: 'pepe_loux',
    name: 'Pepe Loux',
    title: 'Gran Cruzado Veterano',
    rarity: 'SR',
    attribute: 'Natural',
    portrait: '/assets/portraits/pepe_loux.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo natural.png',
    level: 1,
    hp: 1450,
    attack: 280,
    defense: 250,
    cc: 1480,
    bio: 'Veterano de mil batallas con su capa escarlata, custodio de los bosques ancestrales y la tierra natal.',
  },
  {
    id: 'luminor',
    name: 'Luminor',
    title: 'Campeón de la Flor de Lis',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/luminor_icono.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 1100,
    attack: 310,
    defense: 190,
    cc: 1340,
    bio: 'Espadachín noble dotado de esgrima estelar, su hoja corta el velo de la magia con gracia incomparable.',
  },
  {
    id: 'magordito',
    name: 'Magordito',
    title: 'Titán de Hombro de Hierro',
    rarity: 'SR',
    attribute: 'Profano',
    portrait: '/assets/portraits/magordito.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 1350,
    attack: 290,
    defense: 210,
    cc: 1430,
    bio: 'Coloso indómito con hombrera de escamas de basilisco y ojos de fuego etéreo, temido en toda la frontera.',
  },

  // --- ROW 2 (5 heroes) ---
  {
    id: 'giovani',
    name: 'Giovani Vázquez',
    title: 'Bribón Emplumado',
    rarity: 'SR',
    attribute: 'Profano',
    portrait: '/assets/portraits/giovani_vazquez_icono.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 980,
    attack: 310,
    defense: 160,
    cc: 1267,
    bio: 'Astuto explorador con pico rapaz y manto violeta, maestro de los trucos de sombras y emboscadas.',
  },
  {
    id: 'el_baron',
    name: 'El Barón',
    title: 'Señor del Mercado Negro',
    rarity: 'SSR',
    attribute: 'Profano',
    portrait: '/assets/portraits/el_baron_icono.png',
    frame: '/assets/ui/marco_ssr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 1400,
    attack: 360,
    defense: 240,
    cc: 1680,
    bio: 'Magnate de la alta sociedad y hechicero del grimorio carmesí. Sus contratos rigen el destino de los reinos.',
  },
  {
    id: 'wrathion',
    name: 'Wrathion',
    title: 'Sombra Dracónica',
    rarity: 'R',
    attribute: 'Divino',
    portrait: '/assets/portraits/wrathion_icono.png',
    frame: '/assets/ui/marco_r.png',
    orb: '/assets/items/atributo fe.png',
    level: 1,
    hp: 850,
    attack: 220,
    defense: 140,
    cc: 1003,
    bio: 'Ser nacido del eclipse primordial, sus ojos ámbar observan desde las profundidades del plano celestial.',
  },
  {
    id: 'widow',
    name: 'Widow',
    title: 'Drow Asesina',
    rarity: 'R',
    attribute: 'Natural',
    portrait: '/assets/portraits/widow_icono.png',
    frame: '/assets/ui/marco_r.png',
    orb: '/assets/items/atributo natural.png',
    level: 1,
    hp: 820,
    attack: 240,
    defense: 130,
    cc: 1013,
    bio: 'Letal cazadora de las profundidades subterráneas, sus dagas envenenadas no conocen el perdón.',
  },
  {
    id: 'gromock',
    name: 'Gromock',
    title: 'Señor de la Horda Orco',
    rarity: 'SR',
    attribute: 'Profano',
    portrait: '/assets/portraits/gromock_icono.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 1380,
    attack: 295,
    defense: 210,
    cc: 1470,
    bio: 'Brutal caudillo orco revestido de hierro oxidado y amuletos de cráneos, señor absoluto de la batalla.',
  },

  // --- ROW 3 (5 heroes) ---
  {
    id: 'prometeo',
    name: 'Prometeo',
    title: 'Mago Ígneo Tiefling',
    rarity: 'SR',
    attribute: 'Profano',
    portrait: '/assets/portraits/prometeo.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 1050,
    attack: 320,
    defense: 170,
    cc: 1330,
    bio: 'Tiefling con corona de fuego perpetuo, conjura las llamas del abismo para purificar a sus adversarios.',
  },
  {
    id: 'barled',
    name: 'Barled',
    title: 'Pícaro de la Frontera',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/barled.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 1150,
    attack: 300,
    defense: 185,
    cc: 1325,
    bio: 'Aventurero carismático y veloz espadachín, siempre listo con una sonrisa burlona y un golpe certero.',
  },
  {
    id: 'kairon',
    name: 'Kairon',
    title: 'Elegido de los Cuernos',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/kairon.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 1120,
    attack: 310,
    defense: 175,
    cc: 1315,
    bio: 'Joven hechicero con cuernos de carnero y mirada dorada, canaliza el flujo astral con pasmosa naturalidad.',
  },
  {
    id: 'ragnavaldr',
    name: 'Ragnavaldr',
    title: 'Furia de las Nieves',
    rarity: 'SR',
    attribute: 'Natural',
    portrait: '/assets/portraits/ragnavaldr.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo natural.png',
    level: 1,
    hp: 1420,
    attack: 260,
    defense: 240,
    cc: 1473,
    bio: 'Gigante nórdico de piel azulada y manto de pieles de lobo blanco, encarnación de la furia de los glaciares.',
  },
  {
    id: 'red_lion',
    name: 'Red Lion',
    title: 'Guerrero Demonio Carmesí',
    rarity: 'SR',
    attribute: 'Profano',
    portrait: '/assets/portraits/red_lion_portrait.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo OSCURO.png',
    level: 1,
    hp: 1320,
    attack: 310,
    defense: 200,
    cc: 1460,
    bio: 'Bestia demoníaca con melena roja llameante y cornamenta oscura, señor temible de las legiones de asalto.',
  },

  // --- ROW 4 (4 heroes, matching image_4e3a91b1.png 100%) ---
  {
    id: 'smurph_draco',
    name: 'Smurph Draco',
    title: 'Draco Alado del Alba',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/smurph_draco.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 1080,
    attack: 305,
    defense: 175,
    cc: 1320,
    bio: 'Dracónido azul de escamas perladas y bufanda bermeja, vuela veloz desatando ráfagas heladas.',
  },
  {
    id: 'alma_fellas',
    name: 'Alma Fellas',
    title: 'Búho Sabio Arcano',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/alma_fellas.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 950,
    attack: 315,
    defense: 160,
    cc: 1267,
    bio: 'Erudito búho místico con gafas y sombrero de mago picudo, conoce los secretos de todas las estrellas.',
  },
  {
    id: 'roxanne',
    name: 'Roxanne',
    title: 'Zorra Encantadora',
    rarity: 'SR',
    attribute: 'Arcano',
    portrait: '/assets/portraits/roxanne.png',
    frame: '/assets/ui/marco_sr.png',
    orb: '/assets/items/atributo arcano.png',
    level: 1,
    hp: 1040,
    attack: 295,
    defense: 180,
    cc: 1297,
    bio: 'Astuta hechicera kitsune con vestido escarlata, seduce y confunde a los enemigos con ilusiones doradas.',
  },
  {
    id: 'ferton',
    name: 'Ferton',
    title: 'Comerciante Errante',
    rarity: 'R',
    attribute: 'Arcano',
    portrait: '/assets/portraits/ferton_icono.png',
    frame: '/assets/ui/marco_r.png',
    orb: '/assets/items/estrella_mejora.png',
    level: 1,
    hp: 900,
    attack: 210,
    defense: 140,
    cc: 980,
    isLocked: true,
    bio: 'Mercader taciturno con monóculo y misterios sellados, esperando a ser convocado en futuras gestas.',
  },
];

export const HeroesView: React.FC = () => {
  const { team, setTeamSlot } = useGame();

  const [filterCarouselIndex, setFilterCarouselIndex] = useState(0);
  const [activeFilterId, setActiveFilterId] = useState<string>('cc');
  const [showStats, setShowStats] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [selectedHero, setSelectedHero] = useState<CanonicalHeroItem | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [filterAttribute, setFilterAttribute] = useState<string>('ALL');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 5 Authentic top filter cards: CC, Vida, Damage, Bond, Defense
  const allFilterCards = [
    { id: 'cc', label: 'CC', img: '/assets/items/Combat Class.png' },
    { id: 'vida', label: 'Vida', img: '/assets/items/Vida.png' },
    { id: 'damage', label: 'Damage', img: '/assets/items/Daño.png' },
    { id: 'bond', label: 'Bond', img: '/assets/items/recurso_18_4x.png' },
    { id: 'defense', label: 'Defense', img: '/assets/items/Defense.png' },
  ];

  // Exactly 4 filter cards visible on the wooden plaque at a time
  const visibleFilterCards = allFilterCards.slice(filterCarouselIndex, filterCarouselIndex + 4);

  // Shift top filter carousel between [CC, Vida, Damage, Bond] and [Vida, Damage, Bond, Defense]
  const maxCarouselIndex = allFilterCards.length - 4; // 1
  const handlePrevFilter = () => {
    sound.playSFX('click');
    setFilterCarouselIndex((prev) => (prev > 0 ? prev - 1 : maxCarouselIndex));
  };

  const handleNextFilter = () => {
    sound.playSFX('click');
    setFilterCarouselIndex((prev) => (prev < maxCarouselIndex ? prev + 1 : 0));
  };

  // Heroes list remains canonical and never re-sorted by arrows or filter badges
  const sortedHeroes = useMemo(() => {
    let list = [...CANONICAL_HEROES_LIST];

    if (filterRarity !== 'ALL') {
      list = list.filter((h) => h.rarity === filterRarity);
    }
    if (filterAttribute !== 'ALL') {
      list = list.filter((h) => h.attribute === filterAttribute);
    }

    return list;
  }, [filterRarity, filterAttribute]);

  const handleToggleTeam = (heroId: string) => {
    sound.playSFX('click');
    const existingIdx = team.indexOf(heroId);
    if (existingIdx !== -1) {
      setTeamSlot(existingIdx, null);
    } else {
      const emptyIdx = team.findIndex((slot) => slot === null);
      if (emptyIdx !== -1) {
        setTeamSlot(emptyIdx, heroId);
      } else {
        setTeamSlot(3, heroId);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-start bg-[#240a02] p-1.5 sm:p-2 space-y-1 sm:space-y-1.5 select-none overflow-hidden">
      {/* 1. TOP WOODEN SORT/FILTER BAR (Authentic recurso_24_4x.png Wooden Board) */}
      <div className="relative w-full h-[74px] sm:h-[82px] overflow-hidden rounded-xl flex items-center justify-between px-2 sm:px-3 shrink-0 shadow-xl border-2 border-[#541e0b] bg-[#3a180b]">
        {/* Carved Wood Plaque Asset (wide wood board) */}
        <img
          src="/assets/items/recurso_24_4x.png"
          alt=""
          className="absolute inset-0 w-full h-[180%] -top-[52%] object-fill pointer-events-none select-none drop-shadow"
        />

        {/* Left Wooden Arrow Button (<) - Shifts top filter badges */}
        <button
          type="button"
          onClick={handlePrevFilter}
          className="relative z-10 w-8 h-12 sm:w-9 sm:h-14 flex items-center justify-center cursor-pointer active:scale-90 transition-transform shrink-0"
          title="Filtro Anterior"
          aria-label="Filtro Anterior"
        >
          <img
            src="/assets/items/recurso_25_4x.png"
            alt="Anterior"
            className="w-full h-full object-contain filter drop-shadow scale-x-[-1]"
          />
        </button>

        {/* 4 Visible Filter Badges (e.g. [CC, Vida, Damage, Bond] or [Vida, Damage, Bond, Defense]) - LARGER ICONS */}
        <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3 flex-1 h-full items-center justify-items-center px-1 sm:px-2">
          {visibleFilterCards.map((card) => {
            const isSelected = activeFilterId === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  sound.playSFX('click');
                  setActiveFilterId(card.id);
                }}
                className={`group relative h-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isSelected
                    ? 'scale-108 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] filter brightness-115'
                    : 'opacity-85 hover:opacity-100 hover:scale-103'
                }`}
                title={card.label}
              >
                <img
                  src={card.img}
                  alt={card.label}
                  className="w-auto h-[56px] sm:h-[64px] max-h-[82%] object-contain drop-shadow"
                />
              </button>
            );
          })}
        </div>

        {/* Right Wooden Arrow Button (>) - Shifts top filter badges */}
        <button
          type="button"
          onClick={handleNextFilter}
          className="relative z-10 w-8 h-12 sm:w-9 sm:h-14 flex items-center justify-center cursor-pointer active:scale-90 transition-transform shrink-0"
          title="Siguiente Filtro"
          aria-label="Siguiente Filtro"
        >
          <img
            src="/assets/items/recurso_25_4x.png"
            alt="Siguiente"
            className="w-full h-full object-contain filter drop-shadow"
          />
        </button>
      </div>

      {/* 2. COLOR / ATTRIBUTE FILTERS BAR (Positioned at top) */}
      <div className="flex items-center justify-between gap-1 sm:gap-1.5 px-0.5 shrink-0">
        {[
          { id: 'ALL', label: 'TODOS', orb: null, color: 'from-amber-700 to-amber-950 border-amber-500' },
          { id: 'Divino', label: 'DIVINO', orb: '/assets/items/atributo fe.png', color: 'from-blue-700 to-sky-950 border-blue-400' },
          { id: 'Natural', label: 'NATURAL', orb: '/assets/items/atributo natural.png', color: 'from-emerald-700 to-green-950 border-emerald-400' },
          { id: 'Arcano', label: 'ARCANO', orb: '/assets/items/atributo arcano.png', color: 'from-purple-700 to-indigo-950 border-purple-400' },
          { id: 'Profano', label: 'PROFANO', orb: '/assets/items/atributo OSCURO.png', color: 'from-red-700 to-rose-950 border-red-500' },
        ].map((attr) => {
          const isSelected = filterAttribute === attr.id;
          return (
            <button
              key={attr.id}
              type="button"
              onClick={() => {
                sound.playSFX('click');
                setFilterAttribute(attr.id);
              }}
              className={`flex-1 py-1 px-1 sm:px-1.5 rounded-lg border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                isSelected
                  ? `bg-gradient-to-b ${attr.color} ring-2 ring-amber-300 text-white shadow-[0_0_10px_rgba(251,191,36,0.6)] font-black scale-102`
                  : 'bg-[#180803]/90 border-[#4a1c0b] text-stone-300 hover:text-white hover:border-amber-600/60 opacity-80 hover:opacity-100'
              }`}
              title={`Filtrar por ${attr.label}`}
            >
              {attr.orb ? (
                <img src={attr.orb} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0 drop-shadow" />
              ) : (
                <span className="text-[9px] text-amber-300 font-black">✦</span>
              )}
              <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-tight truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {attr.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. ROW OF 4 ACTION BUTTONS: Afecto, Filtros, stats, PARTY */}
      <div className="grid grid-cols-4 gap-2 px-1 shrink-0 h-7 sm:h-7.5 items-center my-0.5">
        {/* Afecto Button */}
        <button
          type="button"
          onClick={() => {
            sound.playSFX('click');
            setActiveFilterId('bond');
          }}
          className="h-full flex items-center justify-center cursor-pointer hover:scale-102 active:scale-95 transition-transform"
          title="Afecto"
        >
          <img
            src="/assets/items/afecto.png"
            alt="Afecto"
            className="w-full h-full object-contain drop-shadow"
          />
        </button>

        {/* Filtros Button */}
        <button
          type="button"
          onClick={() => {
            sound.playSFX('click');
            setShowFilterModal(true);
          }}
          className="h-full flex items-center justify-center cursor-pointer hover:scale-102 active:scale-95 transition-transform"
          title="Filtros"
        >
          <img
            src="/assets/items/filtros.png"
            alt="Filtros"
            className="w-full h-full object-contain drop-shadow"
          />
        </button>

        {/* stats Button */}
        <button
          type="button"
          onClick={() => {
            sound.playSFX('click');
            setShowStats((prev) => !prev);
          }}
          className={`h-full flex items-center justify-center cursor-pointer hover:scale-102 active:scale-95 transition-transform ${
            showStats ? 'ring-2 ring-emerald-400 rounded-md filter brightness-115' : ''
          }`}
          title="Mostrar Estadísticas"
        >
          <img
            src="/assets/items/stats_boton.png"
            alt="stats"
            className="w-full h-full object-contain drop-shadow"
          />
        </button>

        {/* PARTY Button */}
        <button
          type="button"
          onClick={() => {
            sound.playSFX('click');
            setPartyMode((prev) => !prev);
          }}
          className={`h-full flex items-center justify-center cursor-pointer hover:scale-102 active:scale-95 transition-transform ${
            partyMode ? 'ring-2 ring-amber-400 rounded-md filter brightness-115' : ''
          }`}
          title="Equipo / Party"
        >
          <img
            src="/assets/items/party.png"
            alt="PARTY"
            className="w-full h-full object-contain drop-shadow"
          />
        </button>
      </div>

      {/* Party Assignment Notice when Party Mode is enabled */}
      {partyMode && (
        <div className="bg-[#451a03] border-2 border-amber-400 text-amber-200 p-1.5 rounded-xl text-center shadow-lg text-[10px] sm:text-[11px] font-bold shrink-0">
          Modo Equipo Activo: Toca un héroe para añadirlo o quitarlo de las 4 ranuras de combate.
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {team.map((slotId, idx) => {
              const h = CANONICAL_HEROES_LIST.find((hero) => hero.id === slotId);
              return (
                <div
                  key={idx}
                  className="w-7 h-7 rounded border border-amber-500/80 bg-black/60 flex items-center justify-center overflow-hidden text-[9px] font-bold text-stone-300"
                >
                  {h ? (
                    <img src={h.portrait} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MAIN HERO PARCHMENT CONTAINER ENCLOSED BY MARCO_6770fadb.png FRAME */}
      <div className="relative flex-1 w-full rounded-[22px] sm:rounded-[26px] overflow-hidden flex flex-col min-h-0 bg-[#deb77c] shadow-2xl">
        {/* Authentic Parchment Texture Background Asset */}
        <img
          src="/assets/backgrounds/fondo_personajes.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-95"
        />

        {/* Authentic Inner Double-Line Looped Border Asset (fondo_basec.png) */}
        <img
          src="/assets/backgrounds/fondo_basec.png"
          alt=""
          className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] object-fill pointer-events-none select-none mix-blend-multiply opacity-65 z-0"
        />

        {/* USER FRAME ASSET: MARCO_6770fadb.png enclosing the heroes parchment paper */}
        <img
          src="/assets/aistudio/MARCO_6770fadb.png"
          alt="Marco Pergamino"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-20 drop-shadow-xl"
        />

        {/* Scrollable Hero Cards Area - Padded so cards sit comfortably inside MARCO_6770fadb.png */}
        <div className="relative z-10 w-full h-full pt-4 px-4 pb-3 overflow-y-auto no-scrollbar flex flex-col justify-start">
          {/* 5-Column Grid */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
            {sortedHeroes.map((hero) => {
              const inTeam = team.includes(hero.id);

              return (
                <div
                  key={hero.id}
                  onClick={() => {
                    if (hero.isLocked) return;
                    if (partyMode) {
                      handleToggleTeam(hero.id);
                    } else {
                      sound.playSFX('click');
                      setSelectedHero(hero);
                    }
                  }}
                  className={`relative aspect-square cursor-pointer transition-transform duration-100 active:scale-95 hover:scale-102 select-none ${
                    inTeam ? 'ring-2 ring-emerald-500 rounded-lg' : ''
                  } ${hero.isLocked ? 'cursor-not-allowed filter grayscale-[70%] sepia-[30%] opacity-60' : ''}`}
                >
                  {/* Underneath: Hero Portrait safely contained inside the frame */}
                  <div className="absolute inset-[3px] sm:inset-[3.5px] rounded-[5px] overflow-hidden bg-[#18110c] flex items-center justify-center">
                    <img
                      src={hero.portrait}
                      alt={hero.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Overlaid Authentic Frame PNG (with bottom-left rarity emblem) */}
                  <img
                    src={hero.frame}
                    alt={hero.rarity}
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
                  />

                  {/* Top-Right Authentic Element Bead Orb */}
                  <img
                    src={hero.orb}
                    alt={hero.attribute}
                    className="absolute top-0 right-0 w-[30%] h-[30%] object-contain z-20 pointer-events-none drop-shadow"
                  />

                  {/* In-Team Indicator Checkmark */}
                  {inTeam && (
                    <div className="absolute top-0.5 left-0.5 z-30 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white text-[8px] font-black shadow">
                      ✓
                    </div>
                  )}

                  {/* Stats overlay if stats button is toggled */}
                  {showStats && !hero.isLocked && (
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-black/85 text-center text-[7.5px] font-mono font-bold text-amber-300 py-0.2">
                      CC:{hero.cc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty bottom parchment area showing the authentic parchment and bottom double border lines */}
          <div className="flex-1 w-full min-h-[60px]" />
        </div>
      </div>

      {/* 4. HERO PROFILE MODAL (Using fondo_personajes_1.png) */}
      {selectedHero && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedHero(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 select-none animate-fade-in"
        >
          <div className="relative w-full max-w-[380px] h-[82vh] max-h-[680px] flex flex-col">
            {/* Authentic Hero Sheet Background Asset (fondo_personajes_1.png) */}
            <img
              src="/assets/backgrounds/fondo_personajes_1.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none drop-shadow-2xl"
            />

            {/* Red Wax Seal Close Button */}
            <button
              type="button"
              onClick={() => {
                sound.playSFX('click');
                setSelectedHero(null);
              }}
              className="absolute -top-3 -right-3 z-30 w-12 h-12 cursor-pointer hover:scale-105 active:scale-95 transition-transform group"
              title="Cerrar"
            >
              <img
                src="/assets/ui/sello_cerrar.png"
                alt="Cerrar"
                className="w-full h-full object-contain filter group-hover:brightness-110 drop-shadow"
              />
            </button>

            {/* Modal Content Structured on top of the Sheet */}
            <div className="relative z-10 w-full h-full pt-10 pb-6 px-7 flex flex-col justify-between overflow-y-auto no-scrollbar">
              {/* Top Hero Section */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-2">
                  <div className="absolute inset-0 rounded overflow-hidden bg-black/40">
                    <img
                      src={selectedHero.portrait}
                      alt={selectedHero.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <img
                    src={selectedHero.frame}
                    alt=""
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
                  />
                  <img
                    src={selectedHero.orb}
                    alt=""
                    className="absolute top-0 right-0 w-7 h-7 object-contain z-20 pointer-events-none drop-shadow"
                  />
                </div>

                <h3 className="font-serif font-black text-amber-950 text-base leading-tight uppercase tracking-wider drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                  {selectedHero.name}
                </h3>
                <p className="text-xs text-[#6e3713] font-semibold">{selectedHero.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#4a1c06] text-amber-200">
                    NIVEL {selectedHero.level}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-700 text-white">
                    {selectedHero.attribute}
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-4 bg-[#4a1e09]/10 p-2.5 rounded-lg border border-[#7a3e1a]/30">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5c2a0d]">Vida (HP):</span>
                    <span className="font-mono font-black text-amber-950">{selectedHero.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5c2a0d]">Ataque:</span>
                    <span className="font-mono font-black text-amber-950">{selectedHero.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5c2a0d]">Defensa:</span>
                    <span className="font-mono font-black text-amber-950">{selectedHero.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5c2a0d]">Clase Combate:</span>
                    <span className="font-mono font-black text-amber-950">{selectedHero.cc}</span>
                  </div>
                </div>
              </div>

              {/* Bio / Information */}
              <div className="mt-3 text-[11px] text-[#4f240a] font-medium leading-snug">
                {selectedHero.bio}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleTeam(selectedHero.id)}
                  className="relative px-4 py-1.5 text-xs font-black text-amber-950 uppercase tracking-wide cursor-pointer hover:brightness-110 active:scale-95 transition-transform flex items-center justify-center shadow-md"
                >
                  <img
                    src="/assets/items/BOTON BOTON TIENDA.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                  />
                  <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {team.includes(selectedHero.id) ? 'Quitar del Equipo' : 'Asignar al Equipo'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FILTER MODAL */}
      {showFilterModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFilterModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-xs bg-[#240c03] border-4 border-[#78350f] rounded-2xl p-4 text-stone-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/60">
              <h4 className="font-serif font-black text-amber-300 text-sm uppercase tracking-wider">
                Filtros de Héroes
              </h4>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter by Rarity */}
            <div>
              <p className="text-xs font-bold text-amber-400 mb-1.5">Rareza:</p>
              <div className="grid grid-cols-4 gap-1.5">
                {['ALL', 'SSR', 'SR', 'R'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRarity(r)}
                    className={`py-1 text-xs font-black rounded border cursor-pointer ${
                      filterRarity === r
                        ? 'bg-amber-600 border-amber-300 text-white shadow'
                        : 'bg-[#150602] border-[#5a210c] text-stone-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Attribute */}
            <div>
              <p className="text-xs font-bold text-amber-400 mb-1.5">Atributo:</p>
              <div className="grid grid-cols-3 gap-1.5">
                {['ALL', 'Divino', 'Natural', 'Arcano', 'Profano'].map((attr) => (
                  <button
                    key={attr}
                    type="button"
                    onClick={() => setFilterAttribute(attr)}
                    className={`py-1 text-[11px] font-black rounded border cursor-pointer ${
                      filterAttribute === attr
                        ? 'bg-amber-600 border-amber-300 text-white shadow'
                        : 'bg-[#150602] border-[#5a210c] text-stone-400 hover:text-white'
                    }`}
                  >
                    {attr}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-2 py-1.5 bg-[#451a03] hover:bg-[#5a2405] text-amber-200 border border-amber-500/80 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
