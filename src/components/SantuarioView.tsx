import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { Heart, Sparkles, X } from 'lucide-react';

export const SantuarioView: React.FC = () => {
  const { navigateTo, idleEarningsAvailable, claimIdleEarnings } = useGame();
  const [showBondModal, setShowBondModal] = useState(false);
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const handleClaimTribute = () => {
    if (idleEarningsAvailable > 0) {
      const amt = claimIdleEarnings();
      setClaimedNotice(`¡Has reclamado +${amt.toLocaleString()} Oro de tributo!`);
      setTimeout(() => setClaimedNotice(null), 3000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-between overflow-hidden select-none">
      {/* Village Hub Illustrated Artwork */}
      <img
        src="/assets/backgrounds/icespear.png"
        alt="Santuario de Icespear"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* Top Left Floating Badges */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center gap-2.5">
        {/* Theater Mask Badge (Bonds / Afecto) */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setShowBondModal(true);
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-b from-[#8f280a] to-[#3a0d02] border-2 border-[#d97706] shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform group"
          title="Vínculos y Afecto de Héroes"
        >
          <div className="w-9 h-9 rounded-full bg-[#f8fafc] border border-[#cbd5e1] flex items-center justify-center p-1 shadow-inner">
            <svg viewBox="0 0 24 24" className="w-full h-full text-purple-900 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.19 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
            </svg>
          </div>
        </button>

        {/* Hexagon Crest Badge (Sanctuary Blessings / Idle Production) */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setShowBlessingModal(true);
          }}
          className="relative w-12 h-12 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform group"
          title="Bendición del Manantial"
        >
          <img
            src="/assets/items/Insignia Mercado Negro app.png"
            alt="Insignia"
            className="w-full h-full object-contain filter drop-shadow-xl"
          />

          {/* Idle Tribute Indicator */}
          {idleEarningsAvailable > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-white text-[8px] font-black text-black flex items-center justify-center animate-bounce shadow">
              !
            </span>
          )}
        </button>
      </div>

      {/* Floating Notice Banner if collected tribute */}
      {claimedNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#3b170c] border-2 border-amber-400 text-amber-200 px-4 py-1.5 rounded-lg text-xs font-bold shadow-2xl animate-fade-in pointer-events-none">
          {claimedNotice}
        </div>
      )}

      {/* Interactive Hotspots over Buildings */}
      <div className="relative z-10 flex-1 w-full pointer-events-auto">
        {/* Castle Hotspot (Upper Left) */}
        <button
          onClick={() => {
            sound.playSFX('click');
            navigateTo('quest');
          }}
          className="absolute top-[14%] left-[4%] w-[38%] h-[24%] rounded-2xl cursor-pointer group flex flex-col items-center justify-center focus:outline-none"
          title="Castillo de Icespear (Misiones)"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 border border-amber-400 text-amber-200 text-[10px] font-black px-2 py-0.5 rounded shadow-lg backdrop-blur-xs">
            Castillo (Quest)
          </div>
        </button>

        {/* Forge Hotspot (Bottom Left) */}
        <button
          onClick={() => {
            sound.playSFX('click');
            navigateTo('forge');
          }}
          className="absolute bottom-[22%] left-[4%] w-[42%] h-[26%] rounded-2xl cursor-pointer group flex flex-col items-center justify-center focus:outline-none"
          title="Herrería de Icespear (Forja y Armas)"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 border border-amber-400 text-amber-200 text-[10px] font-black px-2 py-0.5 rounded shadow-lg backdrop-blur-xs">
            Herrería (Forja)
          </div>
        </button>

        {/* Tavern Hotspot (Bottom Right) */}
        <button
          onClick={() => {
            sound.playSFX('click');
            navigateTo('tavern');
          }}
          className="absolute bottom-[16%] right-[6%] w-[44%] h-[26%] rounded-2xl cursor-pointer group flex flex-col items-center justify-center focus:outline-none"
          title="Taberna de Magordito"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 border border-amber-400 text-amber-200 text-[10px] font-black px-2 py-0.5 rounded shadow-lg backdrop-blur-xs">
            Taberna (Descanso)
          </div>
        </button>
      </div>

      {/* Bottom Right: Authentic Circular WORLD Globe Button */}
      <div className="relative z-20 self-end p-2 sm:p-3 pointer-events-auto">
        <button
          onClick={() => {
            sound.playSFX('click');
            navigateTo('world');
          }}
          className="group relative flex flex-col items-center cursor-pointer hover:scale-106 active:scale-95 transition-transform"
          title="Abrir Mapa del Mundo"
        >
          <img
            src="/assets/items/WORLD BUTTON.png"
            alt="WORLD"
            className="w-16 h-16 sm:w-18 sm:h-18 object-contain filter drop-shadow-2xl"
          />
        </button>
      </div>

      {/* Bond / Affection Modal */}
      {showBondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="wood-frame max-w-sm w-full p-5 rounded-2xl space-y-4 text-center border-2 border-amber-700 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/60">
              <div className="flex items-center gap-2 text-amber-200 font-serif font-black text-sm">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>Vínculos de Compañerismo</span>
              </div>
              <button
                onClick={() => setShowBondModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Pasa tiempo con tus héroes en la taberna y completa misiones conjuntas para desbloquear diálogos especiales y estadísticas pasivas de combate.
            </p>
            <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-3 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span>Magordito (Afecto Lv.4)</span>
                <span className="text-amber-400 font-bold">+5% Curación</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Pepe Loux (Afecto Lv.3)</span>
                <span className="text-amber-400 font-bold">+8% Defensa</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Kairon (Afecto Lv.5)</span>
                <span className="text-amber-400 font-bold">+10% Daño Sagrado</span>
              </div>
            </div>
            <button
              onClick={() => setShowBondModal(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Blessing / Tribute Modal */}
      {showBlessingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="wood-frame max-w-sm w-full p-5 rounded-2xl space-y-4 text-center border-2 border-amber-700 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/60">
              <div className="flex items-center gap-2 text-amber-200 font-serif font-black text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tributo del Santuario</span>
              </div>
              <button
                onClick={() => setShowBlessingModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              El Santuario de Icespear acumula tributo de oro de manera pasiva mientras exploras o descansas.
            </p>
            <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-4 text-center space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-widest">Tributo Acumulado</span>
              <div className="text-2xl font-mono font-black text-amber-300">
                +{idleEarningsAvailable.toLocaleString()} Oro
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleClaimTribute();
                  setShowBlessingModal(false);
                }}
                disabled={idleEarningsAvailable <= 0}
                className={`flex-1 py-2 font-bold text-xs rounded-lg shadow-md transition-all ${
                  idleEarningsAvailable > 0
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                Reclamar Tributo
              </button>
              <button
                onClick={() => setShowBlessingModal(false)}
                className="py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
