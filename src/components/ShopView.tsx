import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { Flame, Scale, Box, Utensils, Check } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  category: 'oro' | 'mejora' | 'fabricacion' | 'comida';
  cost: number;
  icon: string;
  description: string;
}

export const ShopView: React.FC = () => {
  const { gold, addGold, addCrystals } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'oro' | 'mejora' | 'fabricacion' | 'comida'>('oro');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const shopItems: ShopItem[] = [
    // Row 1: Gems
    {
      id: 'gem_rubi',
      name: 'Rubí',
      category: 'mejora',
      cost: 1000,
      icon: '/assets/items/rubi_app.png',
      description: 'Gema imbuida de calor volcánico para despertar habilidades de fuego.',
    },
    {
      id: 'gem_amatista',
      name: 'Amatista',
      category: 'mejora',
      cost: 1000,
      icon: '/assets/items/amatista_app.png',
      description: 'Cristal prismático para resonar con el portal de invocaciones.',
    },
    {
      id: 'gem_diamante',
      name: 'Diamante',
      category: 'mejora',
      cost: 1000,
      icon: '/assets/items/diamante_app.png',
      description: 'Gema indestructible para ascender estrellas de héroes.',
    },
    {
      id: 'gem_esmeralda',
      name: 'Esmeralda',
      category: 'mejora',
      cost: 1000,
      icon: '/assets/items/esmeralda_app.png',
      description: 'Joya forestal que canaliza la vitalidad de los manantiales.',
    },

    // Row 2: Ingots
    {
      id: 'ingot_cobre',
      name: 'Cobre',
      category: 'fabricacion',
      cost: 350,
      icon: '/assets/items/lingote_cobre_app.png',
      description: 'Lingote maleable para forjar armas iniciales y accesorios.',
    },
    {
      id: 'ingot_plata',
      name: 'Plata',
      category: 'fabricacion',
      cost: 500,
      icon: '/assets/items/lingote_plata_app.png',
      description: 'Plata bendecida por los sacerdotes de Icespear.',
    },
    {
      id: 'ingot_electrum',
      name: 'Electrum',
      category: 'fabricacion',
      cost: 650,
      icon: '/assets/items/lingote_electrum_app.png',
      description: 'Aleación noble de oro y plata de gran afinidad arcana.',
    },
    {
      id: 'ingot_oro',
      name: 'Oro',
      category: 'fabricacion',
      cost: 800,
      icon: '/assets/items/lingote_oro_app.png',
      description: 'Lingote macizo para forja de reliquias de la Casa Loux.',
    },

    // Row 3: Kits
    {
      id: 'kit_herreria',
      name: 'Kit herrería',
      category: 'fabricacion',
      cost: 150,
      icon: '/assets/items/kit_de_herreria_app.png',
      description: 'Herramientas básicas para temple de aceros y espadas.',
    },
    {
      id: 'kit_inscripcion',
      name: 'Kit Inscripción',
      category: 'fabricacion',
      cost: 150,
      icon: '/assets/items/kit_de_inscripcion_app.png',
      description: 'Tintas rúnicas y pergaminos para encantar grimorios.',
    },
    {
      id: 'kit_joyeria',
      name: 'Kit Joyería',
      category: 'fabricacion',
      cost: 150,
      icon: '/assets/items/kit_de_joyeria_app.png',
      description: 'Alicates de precisión para engarzar anillos y amuletos.',
    },
    {
      id: 'kit_peleteria',
      name: 'Kit peletería',
      category: 'fabricacion',
      cost: 150,
      icon: '/assets/items/kit_de_peleteria_app.png',
      description: 'Agujas y tendones para curtir corazas de cuero y quitina.',
    },
  ];

  const handleBuy = (item: ShopItem) => {
    if (gold >= item.cost) {
      sound.playSFX('coin');
      addGold(-item.cost);
      if (item.id === 'gem_amatista') {
        addCrystals(100);
      }
      setPurchaseToast(`¡Has comprado ${item.name}!`);
      setTimeout(() => setPurchaseToast(null), 2500);
    } else {
      sound.playSFX('hurt');
      setPurchaseToast(`¡No tienes suficiente oro para ${item.name}!`);
      setTimeout(() => setPurchaseToast(null), 2500);
    }
  };

  const handleBuyPromo = (title: string, cost: number, crystals: number) => {
    if (gold >= cost) {
      sound.playSFX('victory');
      addGold(-cost);
      addCrystals(crystals);
      setPurchaseToast(`¡Has adquirido el ${title}! (+${crystals} Cristales)`);
      setTimeout(() => setPurchaseToast(null), 3000);
    } else {
      sound.playSFX('hurt');
      setPurchaseToast('¡Oro insuficiente para esta oferta especial!');
      setTimeout(() => setPurchaseToast(null), 2500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-start bg-[#240e06] p-2 sm:p-3 space-y-2 select-none overflow-y-auto no-scrollbar">
      {/* Plaque TIENDA Header (matching image_7c5a7708.png) */}
      <div className="flex flex-col items-center justify-center pt-1 pb-0.5">
        <div
          className="px-8 py-1 bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#78350f] border-2 border-[#fef08a] rounded-sm shadow-xl text-center"
          style={{
            clipPath: 'polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%)',
          }}
        >
          <h2 className="font-serif font-black text-sm sm:text-base text-[#451a03] tracking-widest uppercase">
            TIENDA
          </h2>
        </div>
        <span className="text-[9px] text-amber-200/90 font-mono mt-0.5">
          La tienda se resetea en 0:00
        </span>
      </div>

      {/* Apothecary Shelf Header Artwork */}
      <div className="relative w-full h-14 rounded-lg overflow-hidden border border-[#521c08] bg-[#1a0802] flex items-center justify-center shadow-inner">
        <div className="flex items-center gap-4 opacity-80">
          <div className="w-5 h-7 rounded bg-amber-600/40 border border-amber-500/60" />
          <div className="w-4 h-6 rounded-full bg-emerald-600/40 border border-emerald-500/60" />
          <div className="w-6 h-6 rounded-sm bg-purple-700/40 border border-purple-500/60" />
          <div className="w-5 h-7 rounded bg-red-600/40 border border-red-500/60" />
        </div>
      </div>

      {/* 4 Category Cards (matching image_7c5a7708.png) */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* ORO */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setSelectedCategory('oro');
          }}
          className={`py-2 px-1 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-md ${
            selectedCategory === 'oro'
              ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-400 text-amber-200'
              : 'bg-[#1b0a04] border-[#451a03] text-stone-400 hover:text-stone-200'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border border-amber-300 flex items-center justify-center text-black font-black text-[10px]">
            $
          </div>
          <span className="text-[9px] font-bold uppercase tracking-tight">ORO</span>
        </button>

        {/* MEJORA */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setSelectedCategory('mejora');
          }}
          className={`py-2 px-1 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-md ${
            selectedCategory === 'mejora'
              ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-400 text-amber-200'
              : 'bg-[#1b0a04] border-[#451a03] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Flame className="w-5 h-5 text-purple-300" />
          <span className="text-[9px] font-bold uppercase tracking-tight">MEJORA</span>
        </button>

        {/* FABRICACIÓN */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setSelectedCategory('fabricacion');
          }}
          className={`py-2 px-1 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-md ${
            selectedCategory === 'fabricacion'
              ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-400 text-amber-200'
              : 'bg-[#1b0a04] border-[#451a03] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Box className="w-5 h-5 text-slate-300" />
          <span className="text-[8px] font-bold uppercase tracking-tight">FABRICACIÓN</span>
        </button>

        {/* COMIDA */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setSelectedCategory('comida');
          }}
          className={`py-2 px-1 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-md ${
            selectedCategory === 'comida'
              ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-400 text-amber-200'
              : 'bg-[#1b0a04] border-[#451a03] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Utensils className="w-5 h-5 text-amber-400" />
          <span className="text-[9px] font-bold uppercase tracking-tight">COMIDA</span>
        </button>
      </div>

      {/* 3 Promotional Banner Cards (matching image_7c5a7708.png) */}
      <div className="grid grid-cols-3 gap-1.5 py-1">
        {/* Promo 1: Ingredientes de Mejora */}
        <div
          onClick={() => handleBuyPromo('Lote de Mejora Extraplanar', 2500, 300)}
          className="relative h-32 rounded-xl overflow-hidden border-2 border-amber-600/80 bg-gradient-to-b from-blue-950 to-indigo-950 p-2 flex flex-col justify-between shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-transform group"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('/assets/backgrounds/fondo_arlem.png')` }} />
          <div className="relative z-10">
            <span className="text-[9px] font-black uppercase text-amber-300 leading-tight block drop-shadow">
              INGREDIENTES DE MEJORA EXTRAPLANARES
            </span>
          </div>
          <div className="relative z-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[9px] font-black py-0.5 px-1 rounded text-center shadow">
            2,500 Oro
          </div>
        </div>

        {/* Promo 2: Materiales de Fabricación */}
        <div
          onClick={() => handleBuyPromo('Lote de Fabricación Exclusivo', 3500, 450)}
          className="relative h-32 rounded-xl overflow-hidden border-2 border-amber-600/80 bg-gradient-to-b from-red-950 to-amber-950 p-2 flex flex-col justify-between shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-transform group"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('/assets/backgrounds/fondo_herreria.png')` }} />
          <div className="relative z-10">
            <span className="text-[9px] font-black uppercase text-amber-300 leading-tight block drop-shadow">
              LOTE DE MATERIALES DE FABRICACIÓN EXCLUSIVOS
            </span>
          </div>
          <div className="relative z-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[9px] font-black py-0.5 px-1 rounded text-center shadow">
            3,500 Oro
          </div>
        </div>

        {/* Promo 3: Oferta Especial Alimentos */}
        <div
          onClick={() => handleBuyPromo('Lote de Alimentos Gourmet', 1500, 200)}
          className="relative h-32 rounded-xl overflow-hidden border-2 border-amber-600/80 bg-gradient-to-b from-amber-950 to-stone-950 p-2 flex flex-col justify-between shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-transform group"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('/assets/backgrounds/magordito_sentado_taverna.png')` }} />
          <div className="relative z-10">
            <span className="text-[9px] font-black uppercase text-amber-300 leading-tight block drop-shadow">
              ¡OFERTA ESPECIAL! LOTE DE ALIMENTOS
            </span>
          </div>
          <div className="relative z-10 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[9px] font-black py-0.5 px-1 rounded text-center shadow">
            1,500 Oro
          </div>
        </div>
      </div>

      {/* Toast Alert Notice */}
      {purchaseToast && (
        <div className="bg-[#3b170c] border-2 border-amber-400 text-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold text-center shadow-2xl animate-fade-in">
          {purchaseToast}
        </div>
      )}

      {/* 4-Column Item Grid with Price Buttons (matching image_7c5a7708.png) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pb-4">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b1b22] border-2 border-[#16424e] rounded-xl p-1.5 flex flex-col items-center justify-between text-center shadow-lg group hover:border-amber-400/80 transition-all"
          >
            {/* Item Title */}
            <span className="text-[10px] font-serif font-black text-stone-200 truncate w-full">
              {item.name}
            </span>

            {/* Item Icon */}
            <div className="w-10 h-10 my-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src={item.icon}
                alt={item.name}
                className="w-full h-full object-contain drop-shadow"
              />
            </div>

            {/* Price Button */}
            <button
              onClick={() => handleBuy(item)}
              className="w-full py-1 rounded bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 text-[9px] font-black shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span>$</span>
              <span>{item.cost.toLocaleString()}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
