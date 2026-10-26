import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';

interface NavButtonConfig {
  id: string;
  label: string;
  imageSrc: string;
}

export const GameFooter: React.FC = () => {
  const { currentTab, navigateTo, setIsOptionsOpen } = useGame();

  const navButtons: NavButtonConfig[] = [
    { id: 'quest', label: 'QUEST', imageSrc: '/assets/items/quest tarot.png' },
    { id: 'heroes', label: 'HEROES', imageSrc: '/assets/items/Recurso 2@4x.png' },
    { id: 'santuario', label: 'SANTUARIO', imageSrc: '/assets/items/santuario.png' },
    { id: 'draw', label: 'DRAW', imageSrc: '/assets/items/DRAW BUTTON.png' },
    { id: 'shop', label: 'SHOP', imageSrc: '/assets/items/Recurso 3@4x.png' },
    { id: 'options', label: 'OPTIONS', imageSrc: '/assets/items/Options Idl.png' },
  ];

  const handleTabClick = (id: string) => {
    sound.playSFX('click');
    if (id === 'options') {
      setIsOptionsOpen(true);
    } else {
      navigateTo(id);
    }
  };

  return (
    <footer className="relative z-30 select-none bg-[#1d0a03] border-t border-[#451a03]">
      {/* Background Carved Wood Bar Sprite */}
      <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none overflow-hidden flex items-end justify-center">
        <img
          src="/assets/items/baarra_abajo.png"
          alt=""
          className="w-full h-full object-fill object-bottom opacity-95"
        />
      </div>

      {/* 6 Circular Nav Buttons Row */}
      <div className="relative z-10 w-full max-w-[412px] mx-auto px-1 sm:px-2 py-1.5 flex items-center justify-between gap-0.5 sm:gap-1">
        {navButtons.map((btn) => {
          const isActive =
            currentTab === btn.id ||
            (btn.id === 'santuario' && ['santuario', 'camp', 'world', 'tavern', 'forge'].includes(currentTab)) ||
            (btn.id === 'quest' && currentTab === 'combat') ||
            (btn.id === 'draw' && currentTab === 'gacha');

          return (
            <button
              key={btn.id}
              onClick={() => handleTabClick(btn.id)}
              className={`group relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 ${
                isActive
                  ? '-translate-y-1.5 scale-108 drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)]'
                  : 'hover:scale-104 opacity-90 hover:opacity-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              }`}
              title={btn.label}
            >
              <img
                src={btn.imageSrc}
                alt={btn.label}
                className="w-13 h-13 sm:w-14 sm:h-14 object-contain filter transition-transform"
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
};
