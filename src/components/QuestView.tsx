import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundService';
import { Lock, Star, Check, ChevronRight, Award, Gift, Sparkles, X } from 'lucide-react';

interface QuestMission {
  id: string;
  title: string;
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

  const missions: QuestMission[] = [
    {
      id: 'm1_tirano',
      title: 'El Tirano de Hielo',
      difficulty: 'Facil',
      description:
        'Un variopinto grupo de aventureros se reunen en una mesa de la taverna de Icespear, reclutados por el capitán de la guardia de la aldea para llevar a cabo una importante misión.',
      portrait: '/assets/portraits/edacorn_c1_icono.png',
      stageId: 'stage_1',
    },
    {
      id: 'm2_robo',
      title: 'Robo no tan Justo',
      difficulty: 'Facil',
      description:
        'Sin dinero y con una nueva misión, El recien formado grupo Caldo de Dragón se dispone a relizar un acto no muy heroico para recuperar provisiones requisadas.',
      portrait: '/assets/portraits/edacorn_c1_icono.png',
      stageId: 'stage_1',
    },
    {
      id: 'm3_cuevas',
      title: 'Cuevas de las Sombras Heladas',
      difficulty: 'Normal',
      description:
        'Descenso hacia las cavernas de hielo subterráneas donde las criaturas de las sombras preparan una emboscada.',
      portrait: '/assets/portraits/kurogame_icono.png',
      stageId: 'stage_2',
    },
    {
      id: 'm4_mansion',
      title: 'Encuentro en la Mansión Loux',
      difficulty: 'Normal',
      description:
        'Pepe Loux solicita apoyo para erradicar a los bandidos que han sitiado las bodegas de la mansión solariega.',
      portrait: '/assets/portraits/pepe_loux.png',
      stageId: 'stage_3',
    },
    {
      id: 'm5_asedio',
      title: 'El Juicio del Tribunal Astral',
      difficulty: 'Dificil',
      description:
        'Los heraldos astrales ponen a prueba la valentía de tu escuadrón antes de otorgar el paso hacia el sagrario.',
      portrait: '/assets/portraits/kairon.png',
      stageId: 'stage_3',
    },
    {
      id: 'm6_cryovain',
      title: 'El Despertar de Cryovain',
      difficulty: 'Extremo',
      description:
        'El dragón blanco ancestral desciende sobre la fortaleza. ¡Una batalla legendaria por el destino del norte!',
      portrait: '/assets/portraits/raxxar.png',
      stageId: 'stage_4',
    },
  ];

  const completedCount = missions.filter((m) =>
    questProgress.completedMissions.includes(m.id)
  ).length;

  const handleLaunchCombat = (mission: QuestMission) => {
    sound.playSFX('click');
    setSelectedCombatMissionId(mission.id);
    navigateTo('combat');
  };

  const handleClaimChest = () => {
    if (!chestClaimed && completedCount >= 2) {
      sound.playSFX('victory');
      addGold(10000);
      addCrystals(500);
      setChestClaimed(true);
      setShowChestModal(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex-1 flex flex-col justify-start bg-[#240e06] p-2 sm:p-3 space-y-2 select-none overflow-y-auto no-scrollbar">
      {/* Chapter Tabs Along Top (matching image_8afa574c.png) */}
      <div className="grid grid-cols-4 gap-1">
        {/* Capitulo I */}
        <button
          onClick={() => {
            sound.playSFX('click');
            setActiveChapter(1);
          }}
          className={`py-2 px-1 rounded-t-lg border-t-2 border-x-2 transition-all cursor-pointer text-center ${
            activeChapter === 1
              ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-500 shadow-lg text-amber-200'
              : 'bg-[#291307] border-[#451a03] text-stone-500 hover:text-stone-300'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight leading-tight">
            CAPITULO I
          </div>
          <div className="text-[8px] uppercase tracking-tighter opacity-80 leading-none">
            ICESPEAR
          </div>
        </button>

        {/* Capitulo II (Locked) */}
        <div className="py-2 px-1 rounded-t-lg bg-[#1f0d05] border-t-2 border-x-2 border-[#3b170c] text-stone-600 flex flex-col items-center justify-center opacity-70">
          <div className="flex items-center gap-0.5 text-[9px] font-bold">
            <Lock className="w-2.5 h-2.5 text-stone-500" />
            <span>CAP II</span>
          </div>
          <span className="text-[7px] uppercase tracking-tighter">EL BARRACÓN</span>
        </div>

        {/* Empty Chapter Slots */}
        <div className="py-2 px-1 rounded-t-lg bg-[#190a04] border-t-2 border-x-2 border-[#2b0f05] opacity-40" />
        <div className="py-2 px-1 rounded-t-lg bg-[#190a04] border-t-2 border-x-2 border-[#2b0f05] opacity-40" />
      </div>

      {/* Chapter Header Banner (Cabin in the snowy mountain at dusk) */}
      <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden border-2 border-[#682e11] shadow-2xl bg-[#0f0704]">
        <img
          src="/assets/backgrounds/fondo_icespear.png"
          alt="Icespear"
          className="w-full h-full object-cover object-top brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Capítulo I &bull; Tierras de Hielo
            </span>
            <h3 className="font-serif font-black text-amber-100 text-sm sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              El Asedio de Icespear
            </h3>
          </div>
        </div>
      </div>

      {/* Chapter Progress Bar with Glowing Orange Fill & Boss Chest (matching image_8afa574c.png) */}
      <div className="wood-panel rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-200 uppercase tracking-tight">
            <span>PROGRESO DEL CAPITULO</span>
            <span className="font-mono text-amber-400">{completedCount}/6</span>
          </div>

          {/* Molten Orange / Lava Glowing Progress Bar */}
          <div className="w-full h-4 sm:h-5 rounded-md bg-[#1a0802] border border-[#78350f] p-0.5 overflow-hidden shadow-inner relative">
            <div
              className="h-full rounded-sm bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 shadow-[0_0_8px_#f59e0b] transition-all duration-500"
              style={{ width: `${Math.max(10, (completedCount / 6) * 100)}%` }}
            />
          </div>
        </div>

        {/* Boss Reward Chest */}
        <button
          onClick={handleClaimChest}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-transform relative group shrink-0 shadow-lg ${
            completedCount >= 2 && !chestClaimed
              ? 'bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border-purple-400 animate-pulse hover:scale-105'
              : 'bg-[#291307] border-[#5a2406] opacity-75'
          }`}
          title="Cofre de Recompensas del Capítulo"
        >
          <Gift className={`w-6 h-6 ${completedCount >= 2 && !chestClaimed ? 'text-amber-300' : 'text-stone-500'}`} />
          {completedCount >= 2 && !chestClaimed && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center animate-ping">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mission Cards List (matching image_8afa574c.png) */}
      <div className="space-y-2 flex-1 pb-4">
        {missions.map((mission, index) => {
          const isCompleted = questProgress.completedMissions.includes(mission.id);
          const stars = questProgress.stars[mission.id] || 0;
          const isUnlocked = index === 0 || questProgress.completedMissions.includes(missions[index - 1].id);

          if (!isUnlocked) {
            // Locked Mission Card (Silhouette + BLOQUEADO)
            return (
              <div
                key={mission.id}
                className="wood-panel rounded-xl p-3 border border-[#451a03] opacity-60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#140803] border border-[#3b170c] flex items-center justify-center text-stone-600">
                    <Lock className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-xs text-stone-500">???</h4>
                    <p className="text-[10px] text-stone-600">Misión desconocida</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-red-500/80 font-bold text-xs uppercase tracking-wider">
                  <span>BLOQUEADO</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={mission.id}
              className="parchment-sheet rounded-xl p-3 border-2 border-[#78350f] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-900 relative"
            >
              {/* Mission Details */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#78350f] shrink-0 shadow-md bg-stone-900">
                  <img src={mission.portrait} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-black text-xs sm:text-sm text-[#451a03] truncate">
                      {mission.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#54210c] leading-tight line-clamp-2">
                    {mission.description}
                  </p>
                  <span className="inline-block text-[9px] font-bold text-emerald-800">
                    {mission.difficulty}
                  </span>
                </div>
              </div>

              {/* Status / Actions Column */}
              <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-2 shrink-0">
                {isCompleted ? (
                  <div className="flex flex-col items-center gap-1">
                    {/* Green Stamped Badge: COMPLETADA */}
                    <div className="px-2 py-0.5 rounded bg-emerald-700/80 border border-emerald-900 text-emerald-100 font-serif font-black text-[9px] tracking-wider uppercase shadow-sm">
                      COMPLETADA
                    </div>
                    {/* Green Circle Checkmark */}
                    <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-emerald-800 flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                    {/* 3 Stars */}
                    <div className="flex items-center gap-0.5 text-amber-700">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            stars >= s
                              ? 'text-yellow-600 fill-yellow-500'
                              : 'text-stone-400 fill-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Orange Action Button: CONTINUAR */}
                    <button
                      onClick={() => handleLaunchCombat(mission)}
                      className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span>CONTINUAR</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapter Reward Modal */}
      {showChestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="wood-frame max-w-sm w-full p-5 rounded-2xl space-y-4 text-center border-2 border-amber-700 shadow-2xl animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-purple-950/80 border-2 border-purple-500 flex items-center justify-center text-amber-300 shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-black text-lg text-amber-200">
              ¡Cofre del Capítulo Reclamado!
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Has recibido recompensas de botín por tu avance en el Capítulo I de Icespear:
            </p>
            <div className="bg-[#1b0a04] border border-[#521c08] rounded-xl p-3 flex justify-around font-mono font-bold text-sm">
              <span className="text-amber-400">+10,000 Oro</span>
              <span className="text-cyan-400">+500 Cristales</span>
            </div>
            <button
              onClick={() => setShowChestModal(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              ¡Excelente!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
