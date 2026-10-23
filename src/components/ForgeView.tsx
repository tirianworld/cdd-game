import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { ArrowLeft } from 'lucide-react';

interface WeaponItemData {
  id: string;
  name: string;
  level: number;
  stars: number;
  minAtk: number;
  maxAtk: number;
  element?: 'Divino' | 'Natural' | 'Profano' | 'Arcano';
  elementOrb?: string;
  icon: string;
  costGold: number;
  ingredients: {
    ingotIcon: string;
    ingotHave: number;
    ingotNeed: number;
    hiltIcon: string;
    hiltHave: number;
    hiltNeed: number;
    kitIcon: string;
    kitHave: number;
    kitNeed: number;
  };
}

export const ForgeView: React.FC = () => {
  const { gold, addGold } = useGame();

  const [tier1Category, setTier1Category] = useState<string | null>('Armas');
  const [tier2Subcategory, setTier2Subcategory] = useState<string | null>('Espadas');
  const [elementFilter, setElementFilter] = useState<string | null>(null);
  const [craftModalWeapon, setCraftModalWeapon] = useState<WeaponItemData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mainCategories = [
    {
      id: 'Armas',
      name: 'Armas',
      icon: '/assets/items/weapons.png',
      silhouetteSvg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
          <path d="M6.92 5h2.16L12 11.08 14.92 5h2.16l-3.9 8.08L18 20h-2.16L12 13.92 8.16 20H6l4.82-6.92L6.92 5z" />
        </svg>
      ),
    },
    {
      id: 'Armaduras',
      name: 'Armaduras',
      icon: '/assets/items/ARMADURA LOUX.png',
      silhouetteSvg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
        </svg>
      ),
    },
    {
      id: 'Anillos',
      name: 'Anillos',
      icon: '/assets/items/anillo_del_incrustado.png',
      silhouetteSvg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <polygon points="12,2 15,6 9,6" />
        </svg>
      ),
    },
    {
      id: 'Cascos',
      name: 'Cascos',
      icon: '/assets/items/pepe_loux_caso.png',
      silhouetteSvg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
          <path d="M12 2a9 9 0 0 0-9 9v4h4v-3h10v3h4v-4a9 9 0 0 0-9-9zm-2 11H8v-2h2v2zm6 0h-2v-2h2v2z" />
        </svg>
      ),
    },
    {
      id: 'Abalorios',
      name: 'Abalorios',
      icon: '/assets/items/medallon_moonhaven_app.png',
      silhouetteSvg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
          <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 8V2m-4 2l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
  ];

  const weaponSubcategories = [
    { id: 'Espadas', name: 'Espadas', icon: '/assets/items/ESPADA LOUX.png' },
    { id: 'Lanzas', name: 'Lanzas', icon: '/assets/items/mango_lanza.png' },
    { id: 'Hachas', name: 'Hachas', icon: '/assets/items/ascuas_salvajes.png' },
    { id: 'Martillos', name: 'Martillos', icon: '/assets/items/kit_de_herreria_app.png' },
    { id: 'Grimorios', name: 'Grimorios', icon: '/assets/items/grimorio_tres_sables_app.png' },
  ];

  // Exact 5 weapons from image_77d0af84.png
  const [weaponList, setWeaponList] = useState<WeaponItemData[]>([
    {
      id: 'espada_hierro',
      name: 'Espada de Hierro',
      level: 1,
      stars: 1,
      minAtk: 20,
      maxAtk: 25,
      icon: '/assets/items/ESPADA LOUX.png',
      costGold: 500,
      ingredients: {
        ingotIcon: '/assets/items/lingote_app.png',
        ingotHave: 8,
        ingotNeed: 6,
        hiltIcon: '/assets/items/mango_lanza.png',
        hiltHave: 12,
        hiltNeed: 1,
        kitIcon: '/assets/items/kit_de_herreria_app.png',
        kitHave: 0,
        kitNeed: 5,
      },
    },
    {
      id: 'ropera_hierro',
      name: 'Ropera de Hierro',
      level: 1,
      stars: 1,
      minAtk: 15,
      maxAtk: 30,
      icon: '/assets/items/Tres Sables.png',
      costGold: 600,
      ingredients: {
        ingotIcon: '/assets/items/lingote_app.png',
        ingotHave: 8,
        ingotNeed: 6,
        hiltIcon: '/assets/items/mango_lanza.png',
        hiltHave: 12,
        hiltNeed: 1,
        kitIcon: '/assets/items/kit_de_herreria_app.png',
        kitHave: 0,
        kitNeed: 5,
      },
    },
    {
      id: 'espada_quitina',
      name: 'Espada de Quitina',
      level: 1,
      stars: 2,
      minAtk: 25,
      maxAtk: 30,
      element: 'Natural',
      elementOrb: '/assets/items/atributo natural.png',
      icon: '/assets/items/fragmento_de_quitina.png',
      costGold: 1200,
      ingredients: {
        ingotIcon: '/assets/items/fragmento_de_quitina.png',
        ingotHave: 8,
        ingotNeed: 6,
        hiltIcon: '/assets/items/mango_lanza.png',
        hiltHave: 12,
        hiltNeed: 1,
        kitIcon: '/assets/items/kit_de_herreria_app.png',
        kitHave: 0,
        kitNeed: 5,
      },
    },
    {
      id: 'ropera_quitina',
      name: 'Ropera de Quitina',
      level: 1,
      stars: 2,
      minAtk: 15,
      maxAtk: 35,
      element: 'Natural',
      elementOrb: '/assets/items/atributo natural.png',
      icon: '/assets/items/pepe_quitina.png',
      costGold: 1400,
      ingredients: {
        ingotIcon: '/assets/items/pepe_quitina.png',
        ingotHave: 8,
        ingotNeed: 6,
        hiltIcon: '/assets/items/mango_lanza.png',
        hiltHave: 12,
        hiltNeed: 1,
        kitIcon: '/assets/items/kit_de_herreria_app.png',
        kitHave: 0,
        kitNeed: 5,
      },
    },
    {
      id: 'espada_plata',
      name: 'Espada de Plata',
      level: 1,
      stars: 2,
      minAtk: 25,
      maxAtk: 30,
      element: 'Divino',
      elementOrb: '/assets/items/atributo fe.png',
      icon: '/assets/items/lingote_plata_app.png',
      costGold: 2000,
      ingredients: {
        ingotIcon: '/assets/items/lingote_plata_app.png',
        ingotHave: 8,
        ingotNeed: 6,
        hiltIcon: '/assets/items/mango_lanza.png',
        hiltHave: 12,
        hiltNeed: 1,
        kitIcon: '/assets/items/kit_de_herreria_app.png',
        kitHave: 0,
        kitNeed: 5,
      },
    },
  ]);

  const filteredWeapons = weaponList.filter((w) => {
    if (!elementFilter) return true;
    return w.element === elementFilter;
  });

  const handleFabricate = (weapon: WeaponItemData) => {
    if (gold < weapon.costGold) {
      sound.playSFX('hurt');
      setToastMessage('¡Oro insuficiente para forjar!');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    sound.playSFX('victory');
    addGold(-weapon.costGold);
    setWeaponList((prev) =>
      prev.map((w) =>
        w.id === weapon.id
          ? {
              ...w,
              level: w.level + 1,
              minAtk: w.minAtk + 5,
              maxAtk: w.maxAtk + 8,
              stars: Math.min(5, w.stars + 1),
            }
          : w
      )
    );
    setToastMessage(`¡${weapon.name} fabricada con éxito!`);
    setTimeout(() => setToastMessage(null), 2500);
    setCraftModalWeapon(null);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-start bg-[#140602] p-2 space-y-2 select-none overflow-y-auto no-scrollbar">
      {/* Stone Workshop Hearth Header (matching screenshots) */}
      <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden border-2 border-[#54210c] shadow-2xl bg-black shrink-0">
        <img
          src="/assets/backgrounds/herreria_fondo_icespear.png"
          alt="Herrería de Icespear"
          className="w-full h-full object-cover object-center brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
          <div className="flex items-center justify-between w-full">
            <span className="font-serif font-black text-amber-200 text-xs sm:text-sm drop-shadow">
              Taller de Herrería de Icespear
            </span>
            <span className="text-[11px] text-amber-400 font-mono font-bold">
              Oro: {gold.toLocaleString()}$
            </span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-[#3b170c] border-2 border-amber-400 text-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold text-center shadow-2xl animate-fade-in shrink-0">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb / Back Navigation */}
      {(tier1Category || tier2Subcategory) && (
        <div className="flex items-center justify-between px-1 text-xs shrink-0">
          <button
            onClick={() => {
              sound.playSFX('click');
              if (tier2Subcategory) {
                setTier2Subcategory(null);
              } else if (tier1Category) {
                setTier1Category(null);
              }
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-200 font-bold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Categorías</span>
          </button>
          <span className="text-stone-400 text-[11px]">
            {tier1Category || 'Inicio'} {tier2Subcategory && `> ${tier2Subcategory}`}
          </span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TIER 1: Main Categories (matching image_953d49e6.png)           */}
      {/* ============================================================== */}
      {!tier1Category && (
        <div className="space-y-2 flex-1 pb-4">
          {mainCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playSFX('click');
                setTier1Category(cat.id);
                if (cat.id === 'Armas') {
                  setTier2Subcategory(null);
                }
              }}
              className="relative w-full h-18 sm:h-20 rounded-xl overflow-hidden border-2 border-[#b45309] p-2 flex items-center justify-between shadow-xl cursor-pointer active:scale-98 transition-all group bg-[#071922]"
            >
              {/* Left Item Square Container */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#051117] border-2 border-[#d97706] p-1 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
              </div>

              {/* Title flanked by Daggers + Gold Underline */}
              <div className="flex-1 flex flex-col items-center justify-center px-2">
                <h3 className="font-serif font-black text-amber-100 text-sm sm:text-base tracking-wide flex items-center gap-2">
                  <span className="text-stone-300 text-xs">🗡</span>
                  <span>{cat.name}</span>
                  <span className="text-stone-300 text-xs">🗡</span>
                </h3>
                <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mt-1" />
              </div>

              {/* Right Diamond Silhouette Emblem */}
              <div className="w-12 h-12 border-2 border-[#16424e] rotate-45 flex items-center justify-center bg-[#07151c]/80 shrink-0 mr-1 shadow-inner">
                <div className="-rotate-45">{cat.silhouetteSvg}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TIER 2: Weapon Subcategories (matching image_37c97d37.png)      */}
      {/* ============================================================== */}
      {tier1Category === 'Armas' && !tier2Subcategory && (
        <div className="space-y-2 flex-1 pb-4">
          {weaponSubcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                sound.playSFX('click');
                setTier2Subcategory(sub.id);
              }}
              className="relative w-full h-18 sm:h-20 rounded-xl overflow-hidden border-2 border-[#b45309] p-2 flex items-center justify-between shadow-xl cursor-pointer active:scale-98 transition-all group bg-[#071922]"
            >
              {/* Left Item Square Container */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#051117] border-2 border-[#d97706] p-1 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <img src={sub.icon} alt={sub.name} className="w-10 h-10 object-contain" />
              </div>

              {/* Title flanked by Daggers */}
              <div className="flex-1 flex flex-col items-center justify-center px-2">
                <h3 className="font-serif font-black text-amber-100 text-sm sm:text-base tracking-wide flex items-center gap-2">
                  <span className="text-stone-300 text-xs">🗡</span>
                  <span>{sub.name}</span>
                  <span className="text-stone-300 text-xs">🗡</span>
                </h3>
                <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mt-1" />
              </div>

              {/* Right Diamond Silhouette Emblem */}
              <div className="w-12 h-12 border-2 border-[#16424e] rotate-45 flex items-center justify-center bg-[#07151c]/80 shrink-0 mr-1 shadow-inner">
                <div className="-rotate-45">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
                    <path d="M6.92 5h2.16L12 11.08 14.92 5h2.16l-3.9 8.08L18 20h-2.16L12 13.92 8.16 20H6l4.82-6.92L6.92 5z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TIER 3: Detailed Weapon Items List (matching image_77d0af84.png)*/}
      {/* ============================================================== */}
      {tier2Subcategory && (
        <div className="space-y-2 flex-1 pb-4">
          {/* Top 4 Element Filter Orbs: Sun, Leaf, Skull, Star */}
          <div className="flex items-center justify-center gap-3 py-1 shrink-0">
            {/* Sun / Divino */}
            <button
              onClick={() => {
                sound.playSFX('click');
                setElementFilter(elementFilter === 'Divino' ? null : 'Divino');
              }}
              className={`w-11 h-11 rounded-full cursor-pointer transition-transform ${
                elementFilter === 'Divino' ? 'scale-115 ring-2 ring-white' : 'hover:scale-105 opacity-85'
              }`}
              title="Filtrar Divino / Sol"
            >
              <img
                src="/assets/items/atributo fe.png"
                alt="Divino"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#f59e0b]"
              />
            </button>

            {/* Leaf / Natural */}
            <button
              onClick={() => {
                sound.playSFX('click');
                setElementFilter(elementFilter === 'Natural' ? null : 'Natural');
              }}
              className={`w-11 h-11 rounded-full cursor-pointer transition-transform ${
                elementFilter === 'Natural' ? 'scale-115 ring-2 ring-white' : 'hover:scale-105 opacity-85'
              }`}
              title="Filtrar Natural / Hoja"
            >
              <img
                src="/assets/items/atributo natural.png"
                alt="Natural"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#10b981]"
              />
            </button>

            {/* Skull / Profano */}
            <button
              onClick={() => {
                sound.playSFX('click');
                setElementFilter(elementFilter === 'Profano' ? null : 'Profano');
              }}
              className={`w-11 h-11 rounded-full cursor-pointer transition-transform ${
                elementFilter === 'Profano' ? 'scale-115 ring-2 ring-white' : 'hover:scale-105 opacity-85'
              }`}
              title="Filtrar Profano / Calavera"
            >
              <img
                src="/assets/items/atributo OSCURO.png"
                alt="Profano"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#a855f7]"
              />
            </button>

            {/* Star / Arcano */}
            <button
              onClick={() => {
                sound.playSFX('click');
                setElementFilter(elementFilter === 'Arcano' ? null : 'Arcano');
              }}
              className={`w-11 h-11 rounded-full cursor-pointer transition-transform ${
                elementFilter === 'Arcano' ? 'scale-115 ring-2 ring-white' : 'hover:scale-105 opacity-85'
              }`}
              title="Filtrar Arcano / Estrella"
            >
              <img
                src="/assets/items/atributo arcano.png"
                alt="Arcano"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#38bdf8]"
              />
            </button>
          </div>

          {/* Weapons Cards List */}
          {filteredWeapons.map((weapon) => (
            <div
              key={weapon.id}
              onClick={() => {
                sound.playSFX('click');
                setCraftModalWeapon(weapon);
              }}
              className="relative w-full h-20 sm:h-22 rounded-xl overflow-hidden border-2 border-[#b45309] p-2 flex items-center justify-between shadow-xl cursor-pointer active:scale-98 transition-all group bg-[#071922]"
            >
              {/* Left Item Square Container */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-[#051117] border-2 border-[#d97706] p-1 flex items-center justify-center shrink-0 shadow-md">
                {/* Lv.1 label top-left */}
                <span className="absolute top-0.5 left-1 text-[10px] font-bold text-amber-200">
                  Lv.{weapon.level}
                </span>

                {/* Element Orb Bead on top-right */}
                {weapon.elementOrb && (
                  <img
                    src={weapon.elementOrb}
                    alt=""
                    className="absolute top-1 right-1 w-4 h-4 object-contain filter drop-shadow z-10"
                  />
                )}

                {/* Weapon Icon */}
                <img
                  src={weapon.icon}
                  alt={weapon.name}
                  className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                />

                {/* 5 Stars row along bottom */}
                <div className="absolute bottom-0.5 inset-x-0 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-[8px] leading-none ${
                        i < weapon.stars ? 'text-amber-400' : 'text-[#78350f]'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Center: Title + Damage Badge */}
              <div className="flex-1 px-3 space-y-1">
                <div className="font-serif font-black text-amber-100 text-sm tracking-wide flex items-center gap-1.5">
                  <span className="text-stone-300 text-xs">🗡</span>
                  <span>{weapon.name}</span>
                  <span className="text-stone-300 text-xs">🗡</span>
                </div>

                {/* Authentic marco_dano.png pill */}
                <div className="relative inline-flex items-center justify-center px-2 py-0.5 min-w-[70px] h-6 overflow-hidden">
                  <img
                    src="/assets/ui/marco_dano.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                  />
                  <div className="relative z-10 flex items-center gap-1 text-[11px] font-mono font-bold text-white">
                    <span className="text-stone-300 text-xs">⚔</span>
                    <span>
                      {weapon.minAtk}-{weapon.maxAtk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Diamond Silhouette Emblem */}
              <div className="w-12 h-12 border-2 border-[#16424e] rotate-45 flex items-center justify-center bg-[#07151c]/80 shrink-0 mr-1 shadow-inner">
                <div className="-rotate-45">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1e5868] fill-current">
                    <path d="M6.92 5h2.16L12 11.08 14.92 5h2.16l-3.9 8.08L18 20h-2.16L12 13.92 8.16 20H6l4.82-6.92L6.92 5z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TIER 4: FABRICAR MODAL (matching image_7bf4db68.png)            */}
      {/* ============================================================== */}
      {craftModalWeapon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3">
          {/* Modal Container */}
          <div className="relative max-w-[340px] w-full bg-[#071922] rounded-2xl border-4 border-[#78350f] shadow-[0_0_40px_rgba(0,0,0,0.95)] p-4 sm:p-5 pt-7 text-center space-y-4 animate-fade-in">
            {/* Top Arched Crest with Spoke Clock Dial & Beads */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-b from-[#5c230e] to-[#240b03] border-3 border-[#b45309] shadow-2xl flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#fed330] to-[#b87314] border border-[#6b3806] flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3d1908]" />
              </div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
            </div>

            {/* Top-Right Red Circular Wax Seal "X" Close Button (sello_cerrar.png) */}
            <button
              onClick={() => {
                sound.playSFX('click');
                setCraftModalWeapon(null);
              }}
              className="absolute -top-3 -right-3 w-10 h-10 cursor-pointer hover:scale-110 active:scale-95 transition-transform group"
              title="Cerrar Forja"
            >
              <img
                src="/assets/ui/sello_cerrar.png"
                alt="Cerrar"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </button>

            {/* Weapon Preview Card (matching image_7bf4db68.png) */}
            <div className="relative w-36 h-36 mx-auto rounded-xl bg-[#051117] border-3 border-[#d97706] p-2 flex flex-col items-center justify-between shadow-2xl">
              <span className="self-start text-xs font-serif font-black text-amber-100 drop-shadow">
                Lv.{craftModalWeapon.level}
              </span>

              <img
                src={craftModalWeapon.icon}
                alt={craftModalWeapon.name}
                className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm leading-none ${
                      i < craftModalWeapon.stars ? 'text-amber-400' : 'text-[#78350f]'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* 3 Material Requirement Boxes Row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Ingot card */}
              <div className="rounded-xl bg-[#051117] border-2 border-[#b45309] p-2 flex flex-col items-center justify-between h-20 shadow-md">
                <img
                  src={craftModalWeapon.ingredients.ingotIcon}
                  alt=""
                  className="w-7 h-7 object-contain"
                />
                <span className="text-xs font-mono font-bold text-white">
                  {craftModalWeapon.ingredients.ingotHave}/{craftModalWeapon.ingredients.ingotNeed}
                </span>
              </div>

              {/* Hilt / Handle card */}
              <div className="rounded-xl bg-[#051117] border-2 border-[#b45309] p-2 flex flex-col items-center justify-between h-20 shadow-md">
                <img
                  src={craftModalWeapon.ingredients.hiltIcon}
                  alt=""
                  className="w-7 h-7 object-contain"
                />
                <span className="text-xs font-mono font-bold text-white">
                  {craftModalWeapon.ingredients.hiltHave}/{craftModalWeapon.ingredients.hiltNeed}
                </span>
              </div>

              {/* Crafting Kit card */}
              <div className="rounded-xl bg-[#051117] border-2 border-[#b45309] p-2 flex flex-col items-center justify-between h-20 shadow-md">
                <img
                  src={craftModalWeapon.ingredients.kitIcon}
                  alt=""
                  className="w-7 h-7 object-contain"
                />
                <span
                  className={`text-xs font-mono font-bold ${
                    craftModalWeapon.ingredients.kitHave >= craftModalWeapon.ingredients.kitNeed
                      ? 'text-white'
                      : 'text-red-500 font-extrabold'
                  }`}
                >
                  {craftModalWeapon.ingredients.kitHave}/{craftModalWeapon.ingredients.kitNeed}
                </span>
              </div>
            </div>

            {/* Big Orange FABRICAR Button using BOTON BOTON TIENDA.png */}
            <div className="pt-2">
              <button
                onClick={() => handleFabricate(craftModalWeapon)}
                className="relative w-full h-14 flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
              >
                <img
                  src="/assets/items/BOTON BOTON TIENDA.png"
                  alt="FABRICAR"
                  className="absolute inset-0 w-full h-full object-fill filter drop-shadow-lg"
                />
                <span className="relative z-10 text-white font-serif font-black text-xl tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  FABRICAR
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
