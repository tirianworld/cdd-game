import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { Beer, MessageCircle, Flame, Clock, Sparkles } from 'lucide-react';

const MAGORDITO_LINES = [
  "*crujido crujido* ¡Ah, amigo! Las pipas mágicas de Icespear tienen un toque de sal marina y pimienta astral. ¡Pruébalas!",
  "Un estofado bien condimentado a fuego lento cura más heridas que diez pociones aguadas.",
  "¿Ves ese reloj con ojos? Se lo gané a un hechicero en una apuesta de cartas... Todavía me mira con rencor.",
  "Si vas a cruzar el paso hacia las cuevas, no olvides llevar una capa gruesa. Hasta a mis plumas les da escalofríos.",
  "¡Sirve otra jarra! El honor de Icespear se celebra caliente junto a la chimenea.",
];

export const TavernView: React.FC = () => {
  const { gold, addGold, navigateTo } = useGame();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTalkMagordito = () => {
    sound.playSFX('click');
    setDialogueIndex((prev) => (prev + 1) % MAGORDITO_LINES.length);
    setShowSpeechBubble(true);
  };

  const handleDrinkBeer = () => {
    if (gold >= 50) {
      sound.playSFX('coin');
      addGold(-50);
      setToastMessage('¡Has bebido cerveza de Icespear! (+10% Moral para el próximo combate)');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      sound.playSFX('hurt');
      setToastMessage('¡No tienes suficiente oro para una jarra!');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-between overflow-hidden select-none">
      {/* Tavern Interior Illustration */}
      <img
        src="/assets/aistudio/image_14e93a8e.png"
        alt="Interior de la Taberna"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Toast Alert Notice */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#3b170c] border-2 border-amber-400 text-amber-200 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl animate-fade-in text-center max-w-xs">
          {toastMessage}
        </div>
      )}

      {/* Interactive Magordito Speech Bubble */}
      {showSpeechBubble && (
        <div className="absolute bottom-[24%] left-[6%] right-[6%] z-30 bg-[#fef3c7] text-[#451a03] p-3 rounded-xl border-2 border-[#b45309] shadow-2xl text-xs leading-relaxed font-serif animate-fade-in">
          <div className="flex items-center justify-between pb-1 border-b border-[#b45309]/30 mb-1">
            <span className="font-black text-amber-900">Magordito el Archimago Gourmet</span>
            <button
              onClick={() => setShowSpeechBubble(false)}
              className="text-amber-800 font-bold hover:text-red-700 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p>{MAGORDITO_LINES[dialogueIndex]}</p>
        </div>
      )}

      {/* Tavern Interactive Zones */}
      <div className="relative z-10 flex-1 w-full">
        {/* Magordito Hotspot (Eagle Wizard at table) */}
        <button
          onClick={handleTalkMagordito}
          className="absolute bottom-[2%] left-[24%] w-[52%] h-[40%] rounded-full cursor-pointer focus:outline-none group"
          title="Hablar con Magordito"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 border border-amber-400 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded shadow absolute top-4 left-1/2 -translate-x-1/2">
            Hablar con Magordito
          </div>
        </button>

        {/* Tavern Bar Counter Order Button (Top Right / Counter) */}
        <div className="absolute top-4 right-3 z-20 flex flex-col gap-2">
          <button
            onClick={handleDrinkBeer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-xs border border-amber-400/60 shadow-xl cursor-pointer active:scale-95 transition-all"
            title="Pedir Cerveza Helada (50 Oro)"
          >
            <Beer className="w-4 h-4 text-amber-300" />
            <span>Pedir Trago (50$)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
