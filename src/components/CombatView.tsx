import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Hero, CombatUnit, CombatLogEntry, HeroSkill } from '../types/game';
import { sound } from '../services/soundService';
import { launchConfetti } from '../utils/confetti';
import { Swords, Heart, Shield, Zap, RefreshCw, Trophy, Skull, Play, FastForward } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  background: string;
  recommendedPower: number;
  rewardGold: number;
  rewardXp: number;
  rewardCrystals: number;
  enemies: {
    name: string;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    portrait: string;
    attribute: 'Hielo' | 'Profano' | 'Arcano' | 'Natural';
  }[];
}

const STAGES: Stage[] = [
  {
    id: 'stage_1',
    name: 'Asedio a las Murallas de Icespear',
    background: '/assets/backgrounds/icespear_combate_guardias.png',
    recommendedPower: 450,
    rewardGold: 300,
    rewardXp: 200,
    rewardCrystals: 20,
    enemies: [
      {
        name: 'Guardia de Icespear',
        hp: 750,
        attack: 140,
        defense: 90,
        speed: 90,
        portrait: '/assets/portraits/guardia_icespear.png',
        attribute: 'Hielo',
      },
      {
        name: 'Lancero Centinela',
        hp: 680,
        attack: 165,
        defense: 75,
        speed: 105,
        portrait: '/assets/portraits/guarda_lanza.png',
        attribute: 'Hielo',
      },
      {
        name: 'Guardia Veterano',
        hp: 850,
        attack: 150,
        defense: 100,
        speed: 85,
        portrait: '/assets/portraits/guardia_icespear.png',
        attribute: 'Hielo',
      },
    ],
  },
  {
    id: 'stage_2',
    name: 'Cuevas de las Sombras Heladas',
    background: '/assets/backgrounds/cuevas_de_icespear.png',
    recommendedPower: 900,
    rewardGold: 600,
    rewardXp: 450,
    rewardCrystals: 35,
    enemies: [
      {
        name: 'Alma Errante',
        hp: 920,
        attack: 210,
        defense: 110,
        speed: 115,
        portrait: '/assets/portraits/alma_fellas.png',
        attribute: 'Profano',
      },
      {
        name: 'Guardián Maldito',
        hp: 1200,
        attack: 195,
        defense: 140,
        speed: 95,
        portrait: '/assets/portraits/guardian_del_manantiali.png',
        attribute: 'Profano',
      },
      {
        name: 'Invocador de Sombras',
        hp: 850,
        attack: 230,
        defense: 90,
        speed: 120,
        portrait: '/assets/portraits/kurogame_icono.png',
        attribute: 'Arcano',
      },
    ],
  },
  {
    id: 'stage_3',
    name: 'Altar de Cryovain el Dragón Tirano',
    background: '/assets/backgrounds/fondo_icespear.png',
    recommendedPower: 1500,
    rewardGold: 1200,
    rewardXp: 900,
    rewardCrystals: 75,
    enemies: [
      {
        name: 'Cryovain el Tirano Glacial',
        hp: 2800,
        attack: 290,
        defense: 180,
        speed: 110,
        portrait: '/assets/portraits/wrathion_icono.png',
        attribute: 'Hielo',
      },
      {
        name: 'Guardián del Manantial Helado',
        hp: 1400,
        attack: 210,
        defense: 160,
        speed: 95,
        portrait: '/assets/portraits/guardian_del_manantiali.png',
        attribute: 'Arcano',
      },
    ],
  },
];

export const CombatView: React.FC = () => {
  const { heroes, team, addGold, addCrystals } = useGame();

  const [selectedStage, setSelectedStage] = useState<Stage>(STAGES[0]);
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [battleWon, setBattleWon] = useState<boolean | null>(null);

  // Combat units state
  const [playerUnits, setPlayerUnits] = useState<CombatUnit[]>([]);
  const [enemyUnits, setEnemyUnits] = useState<CombatUnit[]>([]);
  const [activeUnitUid, setActiveUnitUid] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<HeroSkill | null>(null);
  const [selectedTargetUid, setSelectedTargetUid] = useState<string | null>(null);

  // Speed and Auto
  const [battleSpeed, setBattleSpeed] = useState<number>(1);
  const [isAutoBattle, setIsAutoBattle] = useState<boolean>(false);

  // Combat logs & floating damage
  const [logs, setLogs] = useState<CombatLogEntry[]>([]);
  const [floatingDamage, setFloatingDamage] = useState<{
    id: string;
    text: string;
    isCrit: boolean;
    isHeal: boolean;
    targetUid: string;
  }[]>([]);

  // Initialize or start battle
  const startBattle = () => {
    // Build player units from team
    const pUnits: CombatUnit[] = [];
    team.forEach((heroId, slotIdx) => {
      const hero = heroes.find((h) => h.id === heroId);
      if (hero) {
        // compute total stats including gear
        let totalHp = hero.stats.hp;
        let totalAtk = hero.stats.attack;
        let totalDef = hero.stats.defense;

        if (hero.equipped.weapon?.stats.attack) totalAtk += hero.equipped.weapon.stats.attack;
        if (hero.equipped.armor?.stats.hp) totalHp += hero.equipped.armor.stats.hp;
        if (hero.equipped.armor?.stats.defense) totalDef += hero.equipped.armor.stats.defense;
        if (hero.equipped.accessory?.stats.attack) totalAtk += hero.equipped.accessory.stats.attack;

        pUnits.push({
          uid: `player_${hero.id}_${slotIdx}`,
          id: hero.id,
          name: hero.name,
          isEnemy: false,
          position: slotIdx,
          hp: totalHp,
          maxHp: totalHp,
          attack: totalAtk,
          defense: totalDef,
          speed: hero.stats.speed,
          portrait: hero.portrait,
          skills: hero.skills,
          attribute: hero.attribute,
          isDead: false,
          statusEffects: [],
        });
      }
    });

    if (pUnits.length === 0) {
      alert('¡Debes asignar al menos 1 héroe a tu equipo antes de combatir!');
      return;
    }

    // Build enemies
    const eUnits: CombatUnit[] = selectedStage.enemies.map((e, idx) => ({
      uid: `enemy_${idx}`,
      id: `enemy_${idx}`,
      name: e.name,
      isEnemy: true,
      position: idx,
      hp: e.hp,
      maxHp: e.hp,
      attack: e.attack,
      defense: e.defense,
      speed: e.speed,
      portrait: e.portrait,
      skills: [
        {
          id: `atk_${idx}`,
          name: 'Ataque Feroz',
          description: 'Golpea al enemigo infligiendo daño.',
          cooldown: 0,
          damageMultiplier: 1.0,
          targetType: 'single_enemy',
        },
      ],
      attribute: e.attribute,
      isDead: false,
      statusEffects: [],
    }));

    setPlayerUnits(pUnits);
    setEnemyUnits(eUnits);
    setBattleWon(null);
    setInBattle(true);
    setLogs([{ id: 'start', text: `¡Comienza el combate en ${selectedStage.name}!`, type: 'info' }]);

    // Determine first turn by speed
    determineNextTurn(pUnits, eUnits);
    sound.playSFX('click');
  };

  const determineNextTurn = (players: CombatUnit[], enemies: CombatUnit[]) => {
    const allAlive = [...players, ...enemies].filter((u) => !u.isDead);
    if (allAlive.length === 0) return;

    // Highest speed acts
    allAlive.sort((a, b) => b.speed - a.speed);
    const nextUnit = allAlive[0];
    setActiveUnitUid(nextUnit.uid);

    if (!nextUnit.isEnemy) {
      setSelectedSkill(nextUnit.skills[0] || null);
      // Auto select first alive enemy as default target
      const firstAliveEnemy = enemies.find((e) => !e.isDead);
      setSelectedTargetUid(firstAliveEnemy ? firstAliveEnemy.uid : null);
    } else {
      // Enemy turn AI
      setTimeout(() => {
        executeEnemyTurn(nextUnit, players, enemies);
      }, 700 / battleSpeed);
    }
  };

  const executeEnemyTurn = (enemy: CombatUnit, currentPlayers: CombatUnit[], currentEnemies: CombatUnit[]) => {
    const aliveTargets = currentPlayers.filter((p) => !p.isDead);
    if (aliveTargets.length === 0) {
      // Defeat
      endBattle(false);
      return;
    }

    // Pick random target
    const target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
    const rawDamage = Math.max(15, Math.round(enemy.attack * 1.0 - target.defense * 0.4));

    sound.playSFX('hurt');
    showFloatingDamage(target.uid, `-${rawDamage}`, false, false);

    const updatedPlayers = currentPlayers.map((p) => {
      if (p.uid === target.uid) {
        const nextHp = Math.max(0, p.hp - rawDamage);
        return { ...p, hp: nextHp, isDead: nextHp === 0 };
      }
      return p;
    });

    setPlayerUnits(updatedPlayers);
    addLog(`${enemy.name} ataca a ${target.name} causando ${rawDamage} pts de daño.`, 'damage');

    // Check defeat
    if (updatedPlayers.every((p) => p.isDead)) {
      endBattle(false);
      return;
    }

    // Cycle next turn
    setTimeout(() => {
      determineNextTurn(updatedPlayers, currentEnemies);
    }, 500 / battleSpeed);
  };

  const handlePlayerAction = () => {
    if (!selectedSkill) return;
    const activeHero = playerUnits.find((p) => p.uid === activeUnitUid);
    if (!activeHero || activeHero.isDead) return;

    let updatedEnemies = [...enemyUnits];
    let updatedPlayers = [...playerUnits];

    if (selectedSkill.targetType === 'single_enemy') {
      const target = updatedEnemies.find((e) => e.uid === selectedTargetUid && !e.isDead);
      if (!target) return;

      const isCrit = Math.random() < 0.25;
      const critMultiplier = isCrit ? 1.6 : 1.0;
      const damage = Math.max(
        20,
        Math.round((activeHero.attack * selectedSkill.damageMultiplier - target.defense * 0.4) * critMultiplier)
      );

      sound.playSFX(selectedSkill.effectType === 'damage' ? 'attack' : 'skill');
      showFloatingDamage(target.uid, `${isCrit ? '¡CRÍTICO! ' : ''}-${damage}`, isCrit, false);

      updatedEnemies = updatedEnemies.map((e) => {
        if (e.uid === target.uid) {
          const nextHp = Math.max(0, e.hp - damage);
          return { ...e, hp: nextHp, isDead: nextHp === 0 };
        }
        return e;
      });

      addLog(`${activeHero.name} usó ${selectedSkill.name} infligiendo ${damage} pts de daño a ${target.name}.`, 'damage');
    } else if (selectedSkill.targetType === 'all_enemies') {
      sound.playSFX('skill');
      updatedEnemies = updatedEnemies.map((e) => {
        if (e.isDead) return e;
        const damage = Math.max(
          20,
          Math.round(activeHero.attack * selectedSkill.damageMultiplier - e.defense * 0.3)
        );
        showFloatingDamage(e.uid, `-${damage}`, false, false);
        const nextHp = Math.max(0, e.hp - damage);
        return { ...e, hp: nextHp, isDead: nextHp === 0 };
      });
      addLog(`${activeHero.name} desató ${selectedSkill.name} golpeando a todos los enemigos.`, 'damage');
    } else if (selectedSkill.targetType === 'all_allies' || selectedSkill.targetType === 'self') {
      sound.playSFX('victory');
      const healAmt = Math.round(activeHero.attack * (selectedSkill.healMultiplier || 0.6));
      updatedPlayers = updatedPlayers.map((p) => {
        if (p.isDead) return p;
        const nextHp = Math.min(p.maxHp, p.hp + healAmt);
        showFloatingDamage(p.uid, `+${healAmt} HP`, false, true);
        return { ...p, hp: nextHp };
      });
      addLog(`${activeHero.name} bendijo a la formación restaurando salud y vigor.`, 'heal');
    }

    setPlayerUnits(updatedPlayers);
    setEnemyUnits(updatedEnemies);

    // Check Victory
    if (updatedEnemies.every((e) => e.isDead)) {
      endBattle(true);
      return;
    }

    // Continue next turn
    setTimeout(() => {
      determineNextTurn(updatedPlayers, updatedEnemies);
    }, 600 / battleSpeed);
  };

  const endBattle = (won: boolean) => {
    setInBattle(false);
    setBattleWon(won);
    if (won) {
      sound.playSFX('victory');
      launchConfetti({ particleCount: 100, spread: 70 });
      addGold(selectedStage.rewardGold);
      addCrystals(selectedStage.rewardCrystals);
      addLog(`¡Victoria aplastante! Recompensas obtenidas: +${selectedStage.rewardGold} Oro, +${selectedStage.rewardCrystals} Cristales.`, 'buff');
    } else {
      sound.playSFX('defeat');
      addLog('Tu escuadrón ha sido derrotado. Reagrupa a tus héroes y sube su equipamiento.', 'defeat');
    }
  };

  const showFloatingDamage = (targetUid: string, text: string, isCrit: boolean, isHeal: boolean) => {
    const id = `${Date.now()}_${Math.random()}`;
    setFloatingDamage((prev) => [...prev, { id, text, isCrit, isHeal, targetUid }]);
    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((f) => f.id !== id));
    }, 1200);
  };

  const addLog = (text: string, type: 'damage' | 'heal' | 'defeat' | 'buff' | 'info') => {
    setLogs((prev) => [{ id: `${Date.now()}_${Math.random()}`, text, type }, ...prev.slice(0, 15)]);
  };

  // Auto-battle loop
  useEffect(() => {
    if (isAutoBattle && inBattle && activeUnitUid && !activeUnitUid.startsWith('enemy_')) {
      const timer = setTimeout(() => {
        handlePlayerAction();
      }, 500 / battleSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAutoBattle, inBattle, activeUnitUid, battleSpeed]);

  return (
    <div className="relative min-h-[calc(100vh-100px)] text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[1px] pointer-events-none"
        style={{ backgroundImage: `url('${selectedStage.background}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Battle Arena or Stage Select */}
        {!inBattle && battleWon === null ? (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-semibold uppercase tracking-widest">
                Arena de Combate Táctico
              </span>
              <h2 className="text-3xl font-serif font-black text-amber-100">Frente de Batalla de Icespear</h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Selecciona una zona de combate. Tus 4 héroes en formación se enfrentarán en turnos estratégicos contra las amenazas del norte.
              </p>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STAGES.map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => {
                    sound.playSFX('click');
                    setSelectedStage(stage);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border p-5 cursor-pointer transition-all ${
                    selectedStage.id === stage.id
                      ? 'bg-gradient-to-b from-stone-900 to-red-950/80 border-amber-500 shadow-xl shadow-amber-950/50 scale-[1.02]'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  }`}
                >
                  <div
                    className="h-28 rounded-xl bg-cover bg-center relative mb-4 border border-stone-800 overflow-hidden"
                    style={{ backgroundImage: `url('${stage.background}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
                      Poder Sugerido: {stage.recommendedPower}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-amber-200 group-hover:text-amber-100 transition-colors">
                    {stage.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-stone-300 pt-3 border-t border-stone-800">
                    <span className="text-amber-400 font-bold">+{stage.rewardGold} Oro</span>
                    <span className="text-cyan-400 font-bold">+{stage.rewardCrystals} Cristales</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Start Combat Action Bar */}
            <div className="text-center pt-4">
              <button
                onClick={startBattle}
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-red-800 via-amber-700 to-red-800 hover:from-red-700 hover:to-amber-600 text-white font-serif font-black text-base shadow-2xl shadow-red-950/80 border border-red-500/50 cursor-pointer transform hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
              >
                <Swords className="w-5 h-5" />
                <span>¡Iniciar Batalla en {selectedStage.name}!</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Battle Stage */
          <div className="space-y-4">
            {/* Combat Header Controls */}
            <div className="flex items-center justify-between bg-stone-900/90 p-3 rounded-xl border border-stone-800 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-amber-200">{selectedStage.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed toggle */}
                <button
                  onClick={() => setBattleSpeed((prev) => (prev === 1 ? 2 : 1))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-300 border border-stone-700 cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5 text-amber-400" />
                  <span>{battleSpeed}x</span>
                </button>

                {/* Auto battle toggle */}
                <button
                  onClick={() => setIsAutoBattle((prev) => !prev)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold border cursor-pointer transition-all ${
                    isAutoBattle
                      ? 'bg-amber-600 text-stone-950 border-amber-400 shadow-md shadow-amber-900/50'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>AUTO</span>
                </button>

                {/* Retirarse */}
                <button
                  onClick={() => {
                    setInBattle(false);
                    setBattleWon(null);
                  }}
                  className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-xs text-red-200 border border-red-800 cursor-pointer"
                >
                  Retirarse
                </button>
              </div>
            </div>

            {/* Darkest Dungeon Arena: 4 Heroes on Left vs Enemies on Right */}
            <div
              className="relative min-h-[360px] sm:min-h-[420px] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-2xl p-4 sm:p-8 flex flex-col justify-between bg-cover bg-center"
              style={{ backgroundImage: `url('${selectedStage.background}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/60 pointer-events-none" />

              {/* Units Battle Line */}
              <div className="relative z-10 grid grid-cols-2 gap-6 sm:gap-12 items-center my-auto">
                {/* Ally Heroes Formation */}
                <div className="flex items-center justify-end gap-2 sm:gap-4 flex-row-reverse">
                  {playerUnits.map((unit) => {
                    const isActive = activeUnitUid === unit.uid;
                    const dmg = floatingDamage.find((f) => f.targetUid === unit.uid);

                    return (
                      <div
                        key={unit.uid}
                        className={`relative flex flex-col items-center transition-all ${
                          unit.isDead ? 'opacity-40 grayscale filter' : ''
                        } ${isActive ? 'scale-110 -translate-y-2' : ''}`}
                      >
                        {/* Damage Number Popup */}
                        {dmg && (
                          <div
                            className={`absolute -top-10 text-base sm:text-xl font-black animate-bounce z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                              dmg.isHeal ? 'text-emerald-400' : dmg.isCrit ? 'text-yellow-400' : 'text-red-500'
                            }`}
                          >
                            {dmg.text}
                          </div>
                        )}

                        {/* Turn indicator glow */}
                        {isActive && (
                          <div className="text-[10px] uppercase tracking-widest font-bold text-amber-400 mb-1 animate-pulse">
                            ¡Turno!
                          </div>
                        )}

                        {/* Unit Card / Sprite */}
                        <div
                          className={`relative w-16 h-24 sm:w-24 sm:h-36 rounded-xl overflow-hidden border-2 shadow-2xl bg-black ${
                            isActive
                              ? 'border-amber-400 ring-4 ring-amber-500/40'
                              : 'border-stone-700/80'
                          }`}
                        >
                          <img
                            src={unit.portrait}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/portraits/aeliana.png';
                            }}
                          />
                          {unit.isDead && (
                            <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center">
                              <Skull className="w-8 h-8 text-red-500" />
                            </div>
                          )}
                        </div>

                        {/* HP Bar */}
                        <div className="w-full max-w-[100px] mt-2 space-y-0.5">
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                            <span className="text-amber-200 truncate">{unit.name}</span>
                            <span className="text-red-300">{unit.hp}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-900 border border-stone-700 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-300"
                              style={{ width: `${Math.max(0, (unit.hp / unit.maxHp) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Enemy Monsters Formation */}
                <div className="flex items-center justify-start gap-2 sm:gap-4">
                  {enemyUnits.map((unit) => {
                    const isTarget = selectedTargetUid === unit.uid;
                    const dmg = floatingDamage.find((f) => f.targetUid === unit.uid);

                    return (
                      <div
                        key={unit.uid}
                        onClick={() => {
                          if (!unit.isDead) {
                            sound.playSFX('click');
                            setSelectedTargetUid(unit.uid);
                          }
                        }}
                        className={`relative flex flex-col items-center cursor-pointer transition-all ${
                          unit.isDead ? 'opacity-30 grayscale filter cursor-not-allowed' : 'hover:scale-105'
                        } ${isTarget ? 'scale-105' : ''}`}
                      >
                        {/* Damage Popup */}
                        {dmg && (
                          <div
                            className={`absolute -top-10 text-base sm:text-xl font-black animate-bounce z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                              dmg.isCrit ? 'text-yellow-400' : 'text-red-500'
                            }`}
                          >
                            {dmg.text}
                          </div>
                        )}

                        {isTarget && (
                          <div className="text-[10px] font-bold text-red-400 mb-1 animate-pulse">
                            ▼ OBJETIVO
                          </div>
                        )}

                        <div
                          className={`relative w-16 h-24 sm:w-24 sm:h-36 rounded-xl overflow-hidden border-2 shadow-2xl bg-black ${
                            isTarget
                              ? 'border-red-500 ring-4 ring-red-500/50'
                              : 'border-stone-800'
                          }`}
                        >
                          <img
                            src={unit.portrait}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/portraits/guardia_icespear.png';
                            }}
                          />
                          {unit.isDead && (
                            <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center">
                              <Skull className="w-8 h-8 text-red-500" />
                            </div>
                          )}
                        </div>

                        {/* HP Bar */}
                        <div className="w-full max-w-[100px] mt-2 space-y-0.5">
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                            <span className="text-red-200 truncate">{unit.name}</span>
                            <span className="text-red-300">{unit.hp}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-900 border border-stone-700 overflow-hidden">
                            <div
                              className="h-full bg-red-600 transition-all duration-300"
                              style={{ width: `${Math.max(0, (unit.hp / unit.maxHp) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Combat Action Console */}
            {inBattle && activeUnitUid && !activeUnitUid.startsWith('enemy_') && (
              <div className="bg-stone-900 border border-amber-900/60 rounded-2xl p-4 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Turno de Acción</span>
                    <h4 className="font-serif font-black text-lg text-amber-200">
                      {playerUnits.find((p) => p.uid === activeUnitUid)?.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayerAction}
                      disabled={isAutoBattle}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-serif font-bold text-sm border border-amber-400/50 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Ejecutar Acción</span>
                    </button>
                  </div>
                </div>

                {/* Skills Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {playerUnits
                    .find((p) => p.uid === activeUnitUid)
                    ?.skills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => {
                          sound.playSFX('click');
                          setSelectedSkill(skill);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedSkill?.id === skill.id
                            ? 'bg-amber-950/60 border-amber-500 shadow-md shadow-amber-950/50'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs text-amber-200">{skill.name}</span>
                          <span className="text-[10px] text-stone-400">
                            {skill.targetType === 'all_enemies'
                              ? 'A todos'
                              : skill.targetType === 'all_allies'
                              ? 'Curación'
                              : 'Objetivo'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{skill.description}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Victory / Defeat Modal Overlay */}
            {battleWon !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                <div
                  className={`max-w-md w-full rounded-2xl border-2 p-6 text-center space-y-4 shadow-2xl ${
                    battleWon
                      ? 'bg-stone-900 border-amber-500 shadow-amber-950/80'
                      : 'bg-stone-900 border-red-800 shadow-red-950/80'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2">
                    {battleWon ? (
                      <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                    ) : (
                      <Skull className="w-8 h-8 text-red-500" />
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-black text-amber-100">
                    {battleWon ? '¡VICTORIA ÉPICA!' : 'DERROTA'}
                  </h3>

                  <p className="text-xs text-stone-300">
                    {battleWon
                      ? `Has asegurado la zona de ${selectedStage.name} y eliminado las amenazas del norte.`
                      : 'Tus héroes han sucumbido ante el frío y las espadas enemigas. Mejora tus estadísticas en la forja.'}
                  </p>

                  {battleWon && (
                    <div className="flex items-center justify-center gap-4 py-2 bg-stone-950/80 rounded-xl border border-stone-800 text-sm font-mono">
                      <span className="text-amber-400 font-bold">+{selectedStage.rewardGold} Oro</span>
                      <span className="text-cyan-400 font-bold">+{selectedStage.rewardCrystals} Cristales</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setInBattle(false);
                      setBattleWon(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-sm cursor-pointer shadow-lg"
                  >
                    Volver a la Selección
                  </button>
                </div>
              </div>
            )}

            {/* Battle Logs console */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1 font-mono text-[11px]">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`${
                    log.type === 'damage'
                      ? 'text-red-400'
                      : log.type === 'heal'
                      ? 'text-emerald-400'
                      : log.type === 'buff'
                      ? 'text-amber-300'
                      : log.type === 'defeat'
                      ? 'text-red-600 font-bold'
                      : 'text-stone-400'
                  }`}
                >
                  &bull; {log.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
