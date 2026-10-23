import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { Volume2, VolumeX, RotateCcw, User, Info, X } from 'lucide-react';

export const OptionsModal: React.FC = () => {
  const {
    isOptionsOpen,
    setIsOptionsOpen,
    playerName,
    setPlayerName,
    resetAllData,
  } = useGame();

  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [tempName, setTempName] = useState(playerName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOptionsOpen) return null;

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playBGM();
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="wood-frame max-w-sm w-full p-5 rounded-2xl space-y-4 border-2 border-amber-700 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/60">
          <span className="font-serif font-black text-amber-200 text-base">
            Opciones & Configuración
          </span>
          <button
            onClick={() => setIsOptionsOpen(false)}
            className="text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Name Edit Form */}
        <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-3 space-y-1.5 text-left">
          <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Nombre del Comandante:</span>
          </label>
          <form onSubmit={handleSaveName} className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              maxLength={14}
              onChange={(e) => setTempName(e.target.value)}
              className="flex-1 bg-[#0b1b22] border border-[#1b4e5a] rounded-lg px-2.5 py-1 text-xs text-cyan-200 font-bold outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-lg cursor-pointer"
            >
              Guardar
            </button>
          </form>
        </div>

        {/* Audio Toggle */}
        <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>Música y Efectos de Sonido</span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isMuted
                ? 'bg-stone-800 text-stone-400 border border-stone-700'
                : 'bg-emerald-700 text-white border border-emerald-500'
            }`}
          >
            {isMuted ? 'Silenciado' : 'Activado'}
          </button>
        </div>

        {/* Reset Game Section */}
        <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-3 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Partida</span>
            </span>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold rounded-lg border border-red-700 cursor-pointer"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Reset Confirmation Prompt */}
        {showResetConfirm && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl space-y-2 text-center">
            <p className="text-[11px] text-red-200">
              ¿Seguro? Esto restablecerá todos tus héroes, niveles y oro.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                  setIsOptionsOpen(false);
                }}
                className="flex-1 py-1 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Sí, Reiniciar Todo
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lore / Credits */}
        <div className="text-[10px] text-stone-500 text-center space-y-0.5 pt-1">
          <p>CDD Gacha 2 &bull; Crónicas de Icespear &bull; Dark Fantasy RPG</p>
          <p>UI adaptada fielmente al diseño móvil de Icespear.</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsOptionsOpen(false)}
          className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
