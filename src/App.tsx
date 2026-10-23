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
    <div className="min-h-screen w-full bg-[#0a0402] flex items-center justify-center p-0 md:p-3 selection:bg-amber-600 selection:text-white font-sans overflow-x-hidden">
      {/* Central Portrait Mobile Frame (matching the provided UI screenshots) */}
      <div className="w-full max-w-[440px] sm:max-w-[480px] h-[100dvh] md:h-[860px] md:max-h-[94vh] flex flex-col bg-[#1c0803] md:rounded-3xl border-0 md:border-4 md:border-[#54210c] shadow-[0_0_50px_rgba(0,0,0,0.95)] relative overflow-hidden">
        {/* Top Wood Header with Plaque, Spoke Wheel, Gold, Crystals & Mail */}
        <GameHeader />

        {/* Central Dynamic View Area */}
        <main className="relative flex-1 w-full overflow-hidden flex flex-col bg-[#1a0803]">
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
