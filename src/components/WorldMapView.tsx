import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { MapPin, Swords, X } from 'lucide-react';

interface MapRegion {
  id: string;
  name: string;
  description: string;
  top: string;
  left: string;
  action: () => void;
  btnLabel: string;
}

export const WorldMapView: React.FC = () => {
  const { navigateTo, setSelectedCombatMissionId } = useGame();
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);

  const regions: MapRegion[] = [
    {
      id: 'icespear_peak',
      name: 'Pico Glacial de Icespear',
      description: 'Cumbres nevadas donde anidan los dracos de hielo. Nivel de amenaza alto.',
      top: '26%',
      left: '38%',
      btnLabel: 'Ir a Misión de Asedio',
      action: () => {
        setSelectedCombatMissionId('m2_robo');
        navigateTo('quest');
      },
    },
    {
      id: 'sacred_grove',
      name: 'Templo del Bosque Ancestral',
      description: 'Santuario de la Hermandad del Manantial oculto entre los robles milenarios.',
      top: '46%',
      left: '60%',
      btnLabel: 'Inspeccionar',
      action: () => {
        navigateTo('heroes');
      },
    },
    {
      id: 'village',
      name: 'Aldea y Santuario de Icespear',
      description: 'Tu campamento base, herrería y taberna.',
      top: '63%',
      left: '12%',
      btnLabel: 'Entrar al Santuario',
      action: () => {
        navigateTo('santuario');
      },
    },
    {
      id: 'frozen_lake',
      name: 'Lago Helado & Torre Centinela',
      description: 'Puesto avanzado para vigilar incursiones de los ejércitos de ceniza.',
      top: '82%',
      left: '22%',
      btnLabel: 'Ver Patrullas',
      action: () => {
        navigateTo('patrol');
      },
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-between overflow-hidden select-none">
      {/* World Map Artwork */}
      <img
        src="/assets/aistudio/image_32bad5db.png"
        alt="Mapa del Mundo"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Map Interactive Nodes */}
      <div className="relative z-10 flex-1 w-full">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => {
              sound.playSFX('click');
              setSelectedRegion(region);
            }}
            style={{ top: region.top, left: region.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-400 hover:scale-125 transition-all flex items-center justify-center cursor-pointer group shadow-lg"
          >
            <div className="w-3 h-3 rounded-full bg-amber-400 group-hover:bg-yellow-200 animate-ping absolute" />
            <MapPin className="w-4 h-4 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
          </button>
        ))}
      </div>

      {/* Bottom Right: Authentic Circular SANTUARIO Cabin Button */}
      <div className="relative z-20 self-end p-2 sm:p-3">
        <button
          onClick={() => {
            sound.playSFX('click');
            navigateTo('santuario');
          }}
          className="group relative flex flex-col items-center cursor-pointer hover:scale-106 active:scale-95 transition-transform"
          title="Volver al Santuario"
        >
          <img
            src="/assets/backgrounds/icespear SANTUARIO BUTTON.png"
            alt="SANTUARIO"
            className="w-16 h-16 sm:w-18 sm:h-18 object-contain filter drop-shadow-2xl"
          />
        </button>
      </div>

      {/* Region Info Popover Modal */}
      {selectedRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="wood-frame max-w-xs w-full p-5 rounded-2xl space-y-3 text-center border-2 border-amber-700 shadow-2xl">
            <div className="flex items-center justify-between pb-1 border-b border-amber-900/60">
              <span className="text-amber-200 font-serif font-black text-sm">
                {selectedRegion.name}
              </span>
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed text-left">
              {selectedRegion.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  sound.playSFX('click');
                  selectedRegion.action();
                  setSelectedRegion(null);
                }}
                className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>{selectedRegion.btnLabel}</span>
              </button>
              <button
                onClick={() => setSelectedRegion(null)}
                className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-lg cursor-pointer"
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
