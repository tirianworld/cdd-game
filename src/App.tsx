import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameHeader } from './components/GameHeader';
import { GameFooter } from './components/GameFooter';
import { SantuarioView } from './components/SantuarioView';
import { QuestView } from './components/QuestView';
import { HeroesView } from './components/HeroesView';
import { GachaView } from './components/GachaView';
import { ShopView } from './components/ShopView';
import { ForgeView } from './components/ForgeView';
import { TavernView } from './components/TavernView';
import { WorldMapView } from './components/WorldMapView';
import { CombatView } from './components/CombatView';
import { PatrolView } from './components/PatrolView';
import { MailboxModal } from './components/MailboxModal';
import { OptionsModal } from './components/OptionsModal';
import { sound } from './services/soundService';

const GameContent: React.FC = () => {
  const { currentTab } = useGame();

  useEffect(() => {
    // Attempt BGM init safely
    try {
      sound.initBGM('/assets/audio/blades_of_the_astral_gate.mp3');
    } catch {
      // Ignored if media is restricted
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0402] flex flex-col items-center justify-center p-0 md:py-3 selection:bg-amber-600 selection:text-white font-sans overflow-x-hidden">
      {/* Device Model Label on larger screens */}
      <div className="hidden md:flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#1e0d07] border border-[#54210c] text-stone-300 text-[11px] font-mono shadow-md select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-amber-200">Xiaomi Redmi Note 14 Pro</span>
        <span className="text-stone-500">•</span>
        <span className="text-stone-300">412 × 915 px (20:9)</span>
      </div>

      {/* Phone Canvas - Xiaomi Redmi Note 14 Pro (412 x 915 px, 20:9 AMOLED) */}
      <div className="relative w-full max-w-[412px] md:w-[412px] h-[100dvh] md:h-[915px] md:max-h-[96vh] flex flex-col bg-[#1c0803] md:rounded-[36px] border-0 md:border-[6px] md:border-[#2b1810] md:ring-2 md:ring-[#442214] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Full-Screen Background: Authentic Wooden Book Cover (Recurso 8@4x.png) */}
        <img
          src="/assets/items/recurso_8_4x.png"
          alt="Fondo Libro de Madera"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
        />

        {/* Xiaomi Redmi Note 14 Pro Centered Punch-Hole Front Camera */}
        <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#0a0a0a] ring-1 ring-zinc-700/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#121c2e]" />
          </div>
        </div>

        {/* Top Wood Header with Plaque, Spoke Wheel, Gold, Crystals & Mail */}
        <GameHeader />

        {/* Central Dynamic View Area (Transparent background so Recurso 8@4x.png shines through) */}
        <main className="relative flex-1 w-full overflow-hidden flex flex-col z-10 bg-transparent">
          {(currentTab === 'santuario' || currentTab === 'camp') && <SantuarioView />}
          {currentTab === 'quest' && <QuestView />}
          {currentTab === 'heroes' && <HeroesView />}
          {(currentTab === 'draw' || currentTab === 'gacha') && <GachaView />}
          {currentTab === 'shop' && <ShopView />}
          {currentTab === 'forge' && <ForgeView />}
          {currentTab === 'tavern' && <TavernView />}
          {currentTab === 'world' && <WorldMapView />}
          {currentTab === 'combat' && <CombatView />}
          {currentTab === 'patrol' && <PatrolView />}
        </main>

        {/* Bottom Wood Footer Bar with 6 Circular Emblems */}
        <GameFooter />

        {/* Global Modals */}
        <MailboxModal />
        <OptionsModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </ErrorBoundary>
  );
}
