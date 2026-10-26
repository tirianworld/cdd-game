import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { X } from 'lucide-react';

interface QuestMission {
  id: string;
  title: string;
  iconType: 'boss' | 'swords' | 'skull';
  difficulty: 'Facil' | 'Normal' | 'Dificil' | 'Extremo';
  description: string;
  portrait: string;
  stageId: string;
}

export const QuestView: React.FC = () => {
  const {
    questProgress,
    setSelectedCombatMissionId,
    navigateTo,
    addGold,
    addCrystals,
  } = useGame();

  const [activeChapter, setActiveChapter] = useState(1);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [showChestModal, setShowChestModal] = useState(false);

  // Content scroll & drag interaction (no visible scrollbar, drag to scroll)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isContentDragging = useRef(false);
  const contentStartY = useRef(0);
  const contentStartScroll = useRef(0);

  const handleContentPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    isContentDragging.current = true;
    contentStartY.current = e.clientY;
    contentStartScroll.current = scrollContainerRef.current?.scrollTop || 0;
  };

  const handleContentPointerMove = (e: React.PointerEvent) => {
    if (!isContentDragging.current || !scrollContainerRef.current) return;
    const deltaY = e.clientY - contentStartY.current;
    scrollContainerRef.current.scrollTop = contentStartScroll.current - deltaY;
  };

  const handleContentPointerUp = () => {
    isContentDragging.current = false;
  };

  const missions: QuestMission[] = [
    {
      id: 'm1_tirano',
      title: 'El Tirano de Hielo',
      iconType: 'boss',
      difficulty: 'Facil',
      description:
        'Un variopinto grupo de aventureros se reúne en Icespear...',
      portrait: '/assets/portraits/capitan_gabriel_icono.png',
      stageId: 'stage_1',
    },
    {
      id: 'm2_robo',
      title: 'Robo no tan Justo',
      iconType: 'swords',
      difficulty: 'Facil',
      description:
        'Sin dinero y con nueva misión, Caldo de Dragón planea un...',
      portrait: '/assets/portraits/capitan_gabriel_icono.png',
      stageId: 'stage_2',
    },
    {
      id: 'm3_cuevas',
      title: '???',
      iconType: 'skull',
      difficulty: 'Normal',
      description: 'Misión desconocida',
      portrait: '/assets/portraits/capitan_gabriel_icono.png',
      stageId: 'stage_3',
    },
  ];

  // Dynamic completed missions count (Chapter 1 has 6 missions)
  const completedCount = Math.max(
    1,
    missions.filter((m) => questProgress.completedMissions.includes(m.id)).length
  );

  const handleLaunchCombat = (mission: QuestMission) => {
    sound.playSFX('click');
    setSelectedCombatMissionId(mission.id);
    navigateTo('combat');
  };

  const handleClaimChest = () => {
    sound.playSFX('victory');
    if (!chestClaimed) {
      addGold(15000);
      addCrystals(500);
      setChestClaimed(true);
    }
    setShowChestModal(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-start bg-transparent select-none overflow-hidden">
      {/* 1. AUTHENTIC FULL-BLEED BACKGROUND (fondo_icespear_1.png) */}
      <img
        src="/assets/backgrounds/fondo_icespear_1.png"
        alt="Fondo Icespear"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
      />

      {/* 2. TOP CHAPTER TABS (Positioned on the top wooden plank of fondo_icespear_1.png) */}
      <div className="relative z-20 w-full px-[4.5%] pt-[1.5%] pb-[1%] shrink-0">
        <div className="grid grid-cols-4 gap-1.5 h-10 sm:h-11 items-center">
          {/* TAB 1: CAPITULO I ICESPEAR (Active) */}
          <button
            type="button"
            onClick={() => {
              sound.playSFX('click');
              setActiveChapter(1);
            }}
            className={`relative h-full rounded-md flex flex-col items-center justify-center cursor-pointer transition-transform ${
              activeChapter === 1
                ? 'filter brightness-110 drop-shadow-[0_2px_6px_rgba(251,191,36,0.6)]'
                : 'opacity-85 hover:opacity-100'
            }`}
          >
            <img
              src="/assets/items/boton_historia.png"
              alt="Capitulo I"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-[8.5px] sm:text-[9.5px] font-black uppercase text-amber-100 leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)]">
              CAPITULO I
            </span>
            <span className="relative z-10 text-[7.5px] sm:text-[8.5px] font-bold uppercase text-amber-300 leading-tight tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)]">
              ICESPEAR
            </span>
          </button>

          {/* TAB 2: CAPITULO II EL BARRACÓN (Locked with hanging CANDADO.png) */}
          <div className="relative h-full rounded-md flex flex-col items-center justify-center cursor-not-allowed filter brightness-75">
            <img
              src="/assets/items/boton_historia.png"
              alt="Capitulo II"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-[8.5px] sm:text-[9.5px] font-black uppercase text-stone-300 leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)]">
              CAPITULO II
            </span>
            <span className="relative z-10 text-[7px] sm:text-[8px] font-bold uppercase text-stone-400 leading-tight tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)]">
              EL BARRACÓN
            </span>
            {/* Hanging Padlock */}
            <img
              src="/assets/items/CANDADO.png"
              alt="Bloqueado"
              className="absolute -bottom-1.5 w-4 h-4.5 object-contain z-20 drop-shadow-md pointer-events-none"
            />
          </div>

          {/* TAB 3: Empty Recessed Wood Slot (Matching image_abf9fae6.png) */}
          <div className="relative h-full rounded-md bg-[#240e05]/90 border border-[#4a1c09] shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] cursor-not-allowed opacity-80" />

          {/* TAB 4: Empty Recessed Wood Slot (Matching image_abf9fae6.png) */}
          <div className="relative h-full rounded-md bg-[#240e05]/90 border border-[#4a1c09] shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] cursor-not-allowed opacity-80" />
        </div>
      </div>

      {/* 3. CABIN ILLUSTRATION SPACER (Shows the cabin frame baked into fondo_icespear_1.png) */}
      <div className="relative z-10 w-full h-[14.5%] sm:h-[15%] min-h-[92px] max-h-[135px] shrink-0 pointer-events-none" />

      {/* 4. MAIN CONTENT AREA ON WOODEN PLANKS */}
      <div className="relative z-10 w-full flex-1 flex flex-col px-[4%] sm:px-[4.5%] pb-2 overflow-hidden min-h-0">
        {/* PROGRESO DEL CAPITULO (Matching image_abf9fae6.png) */}
        <div className="relative w-full rounded-2xl p-2 sm:p-2.5 bg-[#170803]/90 border-2 border-[#4a1c0b] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7),0_3px_8px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5 shrink-0 my-1">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-black text-[#d6c2a5] tracking-wide uppercase">
              <span>PROGRESO DEL CAPITULO</span>
              <span className="font-mono text-[#d6c2a5] text-[10px] sm:text-[10.5px]">
                {completedCount}/6
              </span>
            </div>

            {/* Glowing Molten Progress Bar */}
            <div className="relative w-full h-4 sm:h-4.5 rounded-full bg-[#0c0401] border border-[#521c08] p-0.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-500"
                style={{ width: `${(completedCount / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Treasure Chest (cofre_de_tintes_app.png) in recessed slot */}
          <button
            type="button"
            onClick={handleClaimChest}
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#120502] border-2 border-[#4a1c0b] flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Cofre de Recompensas de Icespear"
          >
            <img
              src="/assets/items/cofre_de_tintes_app.png"
              alt="Cofre"
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]"
            />
          </button>
        </div>

        {/* MISSIONS LIST (Matching exact separation & unified sizing from image_abf9fae6.png) */}
        <div
          ref={scrollContainerRef}
          onPointerDown={handleContentPointerDown}
          onPointerMove={handleContentPointerMove}
          onPointerUp={handleContentPointerUp}
          onPointerCancel={handleContentPointerUp}
          onPointerLeave={handleContentPointerUp}
          className="w-full flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth flex flex-col gap-2.5 sm:gap-3 mt-1.5 pb-6 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* MISSION 1: El Tirano de Hielo (COMPLETADA) - 25% less tall active card (98px) */}
          <div className="relative w-full h-[98px] sm:h-[102px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-md shrink-0 border border-[#783e18]/60">
            {/* Background Parchment Banner (HISTORIA NIVEL BOTON.png) */}
            <img
              src="/assets/items/HISTORIA NIVEL BOTON.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
            />

            {/* Left: Captain Gabriel Portrait */}
            <div className="relative z-10 w-[66px] h-[66px] sm:w-[70px] sm:h-[70px] rounded-lg overflow-hidden bg-[#160a04] border-2 border-[#54210c] shrink-0 shadow">
              <img
                src="/assets/portraits/capitan_gabriel_icono.png"
                alt="Capitán Gabriel"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center: Title & Description */}
            <div className="relative z-10 flex-1 min-w-0 pl-3 pr-2 flex flex-col justify-center space-y-0.5 sm:space-y-1">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-[#3d1908] truncate drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                El Tirano de Hielo
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-[#4d240e] leading-snug font-medium line-clamp-2">
                Un variopinto grupo de aventureros se reúne en Icespear...
              </p>
            </div>

            {/* Right: COMPLETADA badge + Circular Checkmark Stamp */}
            <div className="relative z-10 flex flex-col items-center justify-center shrink-0 pl-1 space-y-1">
              <span className="px-2 py-0.5 rounded text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-[#2d421e] bg-[#97a883]/60 border border-[#6b7d58] shadow-inner leading-tight whitespace-nowrap">
                COMPLETADA
              </span>
              <img
                src="/assets/items/recurso_1_4x_1.png"
                alt="Completada"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* MISSION 2: Robo no tan Justo (ACTIVE / IN PROGRESS - CONTINUAR) - 25% less tall active card (98px) */}
          <div className="relative w-full h-[98px] sm:h-[102px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-md shrink-0 border border-[#783e18]/60">
            {/* Background Parchment Banner (HISTORIA NIVEL BOTON.png) */}
            <img
              src="/assets/items/HISTORIA NIVEL BOTON.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
            />

            {/* Left: Captain Gabriel Portrait */}
            <div className="relative z-10 w-[66px] h-[66px] sm:w-[70px] sm:h-[70px] rounded-lg overflow-hidden bg-[#160a04] border-2 border-[#54210c] shrink-0 shadow">
              <img
                src="/assets/portraits/capitan_gabriel_icono.png"
                alt="Capitán Gabriel"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center: Title, Description & Green Difficulty Label */}
            <div className="relative z-10 flex-1 min-w-0 pl-3 pr-2 flex flex-col justify-center space-y-0.5 sm:space-y-1">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-[#3d1908] truncate drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                Robo no tan Justo
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-[#4d240e] leading-snug font-medium line-clamp-2">
                Sin dinero y con nueva misión, Caldo de Dragón planea un...
              </p>
              <span className="text-[9px] sm:text-[9.5px] font-black text-[#15803d] tracking-wide leading-none pt-0.5">
                Facil
              </span>
            </div>

            {/* Right: 3 Bronze Stars + CONTINUAR Button */}
            <div className="relative z-10 flex flex-col items-center justify-center shrink-0 pl-1 space-y-1">
              <div className="flex items-center gap-0.5">
                <img
                  src={
                    questProgress.completedMissions.includes('m2_robo')
                      ? '/assets/items/estrella_mejora.png'
                      : '/assets/items/estrella_bronce.png'
                  }
                  alt="Estrella 1"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow"
                />
                <img
                  src={
                    questProgress.completedMissions.includes('m2_robo')
                      ? '/assets/items/estrella_mejora.png'
                      : '/assets/items/estrella_bronce.png'
                  }
                  alt="Estrella 2"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow"
                />
                <img
                  src={
                    questProgress.completedMissions.includes('m2_robo')
                      ? '/assets/items/estrella_mejora.png'
                      : '/assets/items/estrella_bronce.png'
                  }
                  alt="Estrella 3"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow"
                />
              </div>

              <button
                type="button"
                onClick={() => handleLaunchCombat(missions[1])}
                className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-md bg-gradient-to-b from-[#f97316] to-[#c2410c] border border-[#ea580c] text-white text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                CONTINUAR
              </button>
            </div>
          </div>

          {/* MISSION 3: ??? (LOCKED - BLOQUEADO) - Exact same height, width, and avatar frame */}
          <div className="relative w-full h-[90px] sm:h-[94px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 bg-[#180a04]/90 border border-[#3b170c] shadow-inner opacity-90 shrink-0">
            {/* Left: Silhouette Avatar with CANDADO.png */}
            <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-lg overflow-hidden bg-[#0c0402] border-2 border-[#381406] shrink-0 shadow-inner flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-[#1c0a03] mb-1.5" />
              <div className="absolute bottom-0.5 w-9 h-4.5 rounded-t-full bg-[#1c0a03]" />
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="absolute w-5 h-5.5 object-contain drop-shadow"
              />
            </div>

            {/* Center: Hidden Title & Subtitle */}
            <div className="relative flex-1 min-w-0 pl-3 flex flex-col justify-center space-y-0.5">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-stone-300">???</h4>
              <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Misión desconocida</p>
            </div>

            {/* Right: Red BLOQUEADO label + CANDADO.png */}
            <div className="relative flex items-center gap-1.5 pr-1.5 shrink-0">
              <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#ef4444] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                BLOQUEADO
              </span>
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="w-4 h-4.5 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* MISSION 4: ??? (LOCKED - BLOQUEADO) - Exact same height, width, and avatar frame */}
          <div className="relative w-full h-[90px] sm:h-[94px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 bg-[#180a04]/90 border border-[#3b170c] shadow-inner opacity-90 shrink-0">
            <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-lg overflow-hidden bg-[#0c0402] border-2 border-[#381406] shrink-0 shadow-inner flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-[#1c0a03] mb-1.5" />
              <div className="absolute bottom-0.5 w-9 h-4.5 rounded-t-full bg-[#1c0a03]" />
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="absolute w-5 h-5.5 object-contain drop-shadow"
              />
            </div>

            <div className="relative flex-1 min-w-0 pl-3 flex flex-col justify-center space-y-0.5">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-stone-300">???</h4>
              <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Misión desconocida</p>
            </div>

            <div className="relative flex items-center gap-1.5 pr-1.5 shrink-0">
              <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#ef4444] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                BLOQUEADO
              </span>
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="w-4 h-4.5 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* MISSION 5: ??? (LOCKED - BLOQUEADO) - Exact same height, width, and avatar frame */}
          <div className="relative w-full h-[90px] sm:h-[94px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 bg-[#180a04]/90 border border-[#3b170c] shadow-inner opacity-85 shrink-0">
            <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-lg overflow-hidden bg-[#0c0402] border-2 border-[#381406] shrink-0 shadow-inner flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-[#1c0a03] mb-1.5" />
              <div className="absolute bottom-0.5 w-9 h-4.5 rounded-t-full bg-[#1c0a03]" />
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="absolute w-5 h-5.5 object-contain drop-shadow"
              />
            </div>

            <div className="relative flex-1 min-w-0 pl-3 flex flex-col justify-center space-y-0.5">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-stone-300">???</h4>
              <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Misión desconocida</p>
            </div>

            <div className="relative flex items-center gap-1.5 pr-1.5 shrink-0">
              <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#ef4444] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                BLOQUEADO
              </span>
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="w-4 h-4.5 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* MISSION 6: ??? (LOCKED - BLOQUEADO) - Exact same height, width, and avatar frame */}
          <div className="relative w-full h-[90px] sm:h-[94px] rounded-xl overflow-hidden flex items-center px-3 sm:px-3.5 py-2 bg-[#180a04]/90 border border-[#3b170c] shadow-inner opacity-85 shrink-0">
            <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-lg overflow-hidden bg-[#0c0402] border-2 border-[#381406] shrink-0 shadow-inner flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-[#1c0a03] mb-1.5" />
              <div className="absolute bottom-0.5 w-9 h-4.5 rounded-t-full bg-[#1c0a03]" />
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="absolute w-5 h-5.5 object-contain drop-shadow"
              />
            </div>

            <div className="relative flex-1 min-w-0 pl-3 flex flex-col justify-center space-y-0.5">
              <h4 className="font-serif font-black text-xs sm:text-[13px] text-stone-300">???</h4>
              <p className="text-[9px] sm:text-[9.5px] text-stone-400 font-medium">Misión desconocida</p>
            </div>

            <div className="relative flex items-center gap-1.5 pr-1.5 shrink-0">
              <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#ef4444] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                BLOQUEADO
              </span>
              <img
                src="/assets/items/CANDADO.png"
                alt="Bloqueado"
                className="w-4 h-4.5 object-contain drop-shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. CHEST REWARD MODAL */}
      {showChestModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowChestModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-fade-in"
        >
          <div className="relative w-full max-w-xs bg-[#240c03] border-4 border-[#78350f] rounded-2xl p-4 text-center text-stone-200 shadow-2xl space-y-3">
            <button
              type="button"
              onClick={() => setShowChestModal(false)}
              className="absolute top-2.5 right-2.5 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center pt-2">
              <img
                src="/assets/items/cofre_de_tintes_app.png"
                alt="Cofre de Icespear"
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.9)]"
              />
            </div>

            <h3 className="font-serif font-black text-base uppercase text-amber-300 drop-shadow">
              ¡Cofre de Icespear Reclamado!
            </h3>

            <p className="text-xs text-stone-300">
              Has recibido las recompensas por tu avance en el Capítulo I:
            </p>

            <div className="flex items-center justify-center gap-4 py-2 bg-[#140602] rounded-lg border border-amber-900/60">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 font-mono">
                <span>+15,000</span>
                <span className="text-[10px] text-amber-200">ORO</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-400 font-mono">
                <span>+500</span>
                <span className="text-[10px] text-sky-200">GEMAS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowChestModal(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-black rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-transform"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
