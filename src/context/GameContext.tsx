import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hero, SummonBanner, PatrolMission, InventoryItem, EquipmentItem } from '../types/game';
import { INITIAL_HEROES } from '../data/heroesData';
import { BANNERS, PATROLS, INITIAL_INVENTORY, INITIAL_EQUIPMENT, SHOP_ITEMS } from '../data/gameContent';
import { sound } from '../services/soundService';
import { safeStorage, safeGetJSON } from '../utils/storage';

interface ActivePatrol {
  patrolId: string;
  heroIds: string[];
  startTime: number;
  endTime: number;
}

export interface MailItem {
  id: string;
  sender: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  claimed: boolean;
  rewardGold?: number;
  rewardCrystals?: number;
}

interface GameContextType {
  gold: number;
  summonCrystals: number;
  astralShards: number;
  playerName: string;
  setPlayerName: (name: string) => void;
  heroes: Hero[];
  team: (string | null)[]; // 4 slots
  inventory: InventoryItem[];
  equipment: EquipmentItem[];
  activePatrols: ActivePatrol[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  navigateTo: (tab: string) => void;
  goBack: () => void;
  selectedBanner: SummonBanner;
  setSelectedBanner: (banner: SummonBanner) => void;
  questProgress: {
    chapter: number;
    completedMissions: string[];
    stars: Record<string, number>;
  };
  completeQuestMission: (missionId: string, stars: number) => void;
  selectedCombatMissionId: string | null;
  setSelectedCombatMissionId: (id: string | null) => void;
  // Mailbox & Options
  isMailboxOpen: boolean;
  setIsMailboxOpen: (open: boolean) => void;
  isOptionsOpen: boolean;
  setIsOptionsOpen: (open: boolean) => void;
  mailItems: MailItem[];
  claimMailReward: (id: string) => void;
  // Forge navigation state
  forgeCategory: string;
  setForgeCategory: (cat: string) => void;
  forgeSubcategory: string | null;
  setForgeSubcategory: (sub: string | null) => void;
  // Actions
  addGold: (amt: number) => void;
  addCrystals: (amt: number) => void;
  setTeamSlot: (slotIndex: number, heroId: string | null) => void;
  summon: (bannerId: string, count: number) => { pulled: Hero[]; duplicates: number; bonusCoins: number };
  levelUpHero: (heroId: string) => boolean;
  startPatrol: (patrolId: string, heroIds: string[]) => boolean;
  claimPatrol: (patrolId: string) => boolean;
  equipHeroItem: (heroId: string, equipId: string) => void;
  unequipHeroItem: (heroId: string, slot: 'weapon' | 'armor' | 'accessory') => void;
  upgradeEquipmentItem: (equipId: string) => boolean;
  forgeNewEquipment: (type: 'weapon' | 'armor' | 'ring') => boolean;
  buyShopItem: (itemId: string) => boolean;
  useInventoryItem: (itemId: string, heroId?: string) => boolean;
  claimIdleEarnings: () => number;
  idleEarningsAvailable: number;
  resetAllData: () => void;
}

const STORAGE_KEY = 'cdd_gacha_2_save_v1';

const DEFAULT_MAIL: MailItem[] = [
  {
    id: 'mail_welcome',
    sender: 'Capitán Gabriel',
    title: '¡Bienvenido al Bastión de Icespear!',
    body: 'Saludos, aventurero. Las tierras del norte son despiadadas, pero la guarnición te otorga estos suministros imperiales para tu viaje.',
    date: 'Hoy',
    read: false,
    claimed: false,
    rewardGold: 5000,
    rewardCrystals: 500,
  },
  {
    id: 'mail_cdd',
    sender: 'Culto a los Dragones',
    title: 'Tributo de las Cumbres Nevadas',
    body: 'Los ecos ancestrales despiertan en el pico helado. Acepta esta ofrenda en reconocimiento a tu valentía frente a las bestias.',
    date: 'Hoy',
    read: false,
    claimed: false,
    rewardGold: 3500,
    rewardCrystals: 350,
  },
  {
    id: 'mail_vigias',
    sender: 'Vigías de Ravenholm',
    title: 'Informe de Patrulla y Botín',
    body: 'Las rondas nocturnas han sido un éxito. Hemos asegurado el paso fronterizo y recuperado valiosas gemas de los asaltantes.',
    date: 'Ayer',
    read: false,
    claimed: false,
    rewardGold: 2500,
    rewardCrystals: 200,
  },
  {
    id: 'mail_magordito',
    sender: 'Magordito el Tabernero',
    title: 'Pipas y Cerveza Caliente',
    body: 'Pásate por la taberna cuando gustes. Traigo un saco de semillas de girasol mágicas y un estofado recién hervido.',
    date: 'Hace 2 días',
    read: false,
    claimed: false,
    rewardGold: 1000,
    rewardCrystals: 150,
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return safeGetJSON<string>(`${STORAGE_KEY}_current_tab`, 'quest');
  });
  const [historyStack, setHistoryStack] = useState<string[]>(['quest']);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_current_tab`, JSON.stringify(currentTab));
  }, [currentTab]);

  const [playerName, setPlayerName] = useState<string>(() => {
    return safeGetJSON<string>(`${STORAGE_KEY}_player_name`, 'Zer0_NadA');
  });

  // Load safely from storage or fallback defaults
  const [gold, setGold] = useState<number>(() => {
    return safeGetJSON<number>(`${STORAGE_KEY}_gold`, 999951543);
  });

  const [summonCrystals, setSummonCrystals] = useState<number>(() => {
    return safeGetJSON<number>(`${STORAGE_KEY}_crystals`, 99999999);
  });

  const [astralShards, setAstralShards] = useState<number>(() => {
    return safeGetJSON<number>(`${STORAGE_KEY}_shards`, 99999999);
  });

  const [heroes, setHeroes] = useState<Hero[]>(() => {
    const saved = safeGetJSON<Hero[] | null>(`${STORAGE_KEY}_heroes`, null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_HEROES;
  });

  const [team, setTeam] = useState<(string | null)[]>(() => {
    return safeGetJSON<(string | null)[]>(`${STORAGE_KEY}_team`, ['edacorn', 'kairon', 'roxanne', 'magordito']);
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    return safeGetJSON<InventoryItem[]>(`${STORAGE_KEY}_inventory`, INITIAL_INVENTORY);
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => {
    return safeGetJSON<EquipmentItem[]>(`${STORAGE_KEY}_equipment`, INITIAL_EQUIPMENT);
  });

  const [questProgress, setQuestProgress] = useState<{ chapter: number; completedMissions: string[]; stars: Record<string, number> }>(() => {
    return safeGetJSON(`${STORAGE_KEY}_quest_progress`, {
      chapter: 1,
      completedMissions: ['m1_tirano'],
      stars: { m1_tirano: 3 },
    });
  });

  const [selectedCombatMissionId, setSelectedCombatMissionId] = useState<string | null>('m2_robo');

  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [mailItems, setMailItems] = useState<MailItem[]>(() => {
    return safeGetJSON<MailItem[]>(`${STORAGE_KEY}_mail`, DEFAULT_MAIL);
  });

  const [forgeCategory, setForgeCategory] = useState<string>('Armas');
  const [forgeSubcategory, setForgeSubcategory] = useState<string | null>(null);

  const [activePatrols, setActivePatrols] = useState<ActivePatrol[]>(() => {
    return safeGetJSON<ActivePatrol[]>(`${STORAGE_KEY}_patrols`, []);
  });

  const [selectedBanner, setSelectedBanner] = useState<SummonBanner>(BANNERS[0]);

  const [lastIdleTimestamp, setLastIdleTimestamp] = useState<number>(() => {
    return safeGetJSON<number>(`${STORAGE_KEY}_idle_time`, Date.now());
  });

  const [idleEarningsAvailable, setIdleEarningsAvailable] = useState<number>(0);

  // Sync safely to storage
  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_gold`, JSON.stringify(gold));
  }, [gold]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_crystals`, JSON.stringify(summonCrystals));
  }, [summonCrystals]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_shards`, JSON.stringify(astralShards));
  }, [astralShards]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_heroes`, JSON.stringify(heroes));
  }, [heroes]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_team`, JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_equipment`, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_patrols`, JSON.stringify(activePatrols));
  }, [activePatrols]);

  // Idle gold calculation (5 gold per 10 seconds idle, up to 1000 max)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastIdleTimestamp) / 1000);
      const earned = Math.min(1000, Math.floor(elapsedSeconds / 10) * 8);
      setIdleEarningsAvailable(earned);
    }, 2000);
    return () => clearInterval(interval);
  }, [lastIdleTimestamp]);

  const claimIdleEarnings = () => {
    if (idleEarningsAvailable <= 0) return 0;
    const claimed = idleEarningsAvailable;
    setGold((prev) => prev + claimed);
    setLastIdleTimestamp(Date.now());
    setIdleEarningsAvailable(0);
    sound.playSFX('coin');
    return claimed;
  };

  const addGold = (amt: number) => {
    setGold((prev) => Math.max(0, prev + amt));
  };

  const addCrystals = (amt: number) => {
    setSummonCrystals((prev) => Math.max(0, prev + amt));
  };

  const setTeamSlot = (slotIndex: number, heroId: string | null) => {
    setTeam((prev) => {
      const next = [...prev];
      // remove hero if already in another slot
      if (heroId) {
        for (let i = 0; i < next.length; i++) {
          if (next[i] === heroId) next[i] = null;
        }
      }
      next[slotIndex] = heroId;
      return next;
    });
    sound.playSFX('click');
  };

  const summon = (bannerId: string, count: number) => {
    const banner = BANNERS.find((b) => b.id === bannerId) || selectedBanner;
    const cost = count === 1 ? banner.costSingle : banner.costMulti;

    if (summonCrystals < cost) {
      sound.playSFX('hurt');
      return { pulled: [], duplicates: 0, bonusCoins: 0 };
    }

    setSummonCrystals((prev) => prev - cost);
    sound.playSFX('gacha_pull');

    const pulled: Hero[] = [];
    let duplicates = 0;
    let bonusCoins = 0;

    const availablePool = INITIAL_HEROES;

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let targetRarity: 'UR' | 'SSR' | 'SR' | 'R' = 'R';

      if (roll < banner.dropRates.UR) {
        targetRarity = 'UR';
      } else if (roll < banner.dropRates.UR + banner.dropRates.SSR) {
        targetRarity = 'SSR';
      } else if (roll < banner.dropRates.UR + banner.dropRates.SSR + banner.dropRates.SR) {
        targetRarity = 'SR';
      } else {
        targetRarity = 'R';
      }

      // Check if featured
      let pool = availablePool.filter((h) => h.rarity === targetRarity);
      if (pool.length === 0) pool = availablePool;

      // 50% chance to pick featured if matches rarity
      const featuredMatches = pool.filter((h) => banner.featuredHeroIds.includes(h.id));
      let picked: Hero;
      if (featuredMatches.length > 0 && Math.random() < 0.5) {
        picked = featuredMatches[Math.floor(Math.random() * featuredMatches.length)];
      } else {
        picked = pool[Math.floor(Math.random() * pool.length)];
      }

      pulled.push(picked);
    }

    // Merge into owned heroes or award bonus stars/coins
    setHeroes((prev) => {
      const updated = [...prev];
      pulled.forEach((hero) => {
        const existingIdx = updated.findIndex((h) => h.id === hero.id);
        if (existingIdx >= 0) {
          duplicates++;
          bonusCoins += hero.rarity === 'UR' ? 50 : hero.rarity === 'SSR' ? 25 : hero.rarity === 'SR' ? 10 : 3;
          // upgrade star or stat
          updated[existingIdx] = {
            ...updated[existingIdx],
            stars: Math.min(6, updated[existingIdx].stars + 1),
            stats: {
              ...updated[existingIdx].stats,
              attack: Math.round(updated[existingIdx].stats.attack * 1.05),
              hp: Math.round(updated[existingIdx].stats.hp * 1.05),
              maxHp: Math.round(updated[existingIdx].stats.maxHp * 1.05),
            },
          };
        } else {
          updated.push({ ...hero, level: 1, currentXp: 0 });
        }
      });
      return updated;
    });

    if (bonusCoins > 0) {
      setAstralShards((prev) => prev + bonusCoins);
    }

    return { pulled, duplicates, bonusCoins };
  };

  const levelUpHero = (heroId: string): boolean => {
    const hero = heroes.find((h) => h.id === heroId);
    if (!hero) return false;

    // Cost scales with level
    const goldCost = hero.level * 150;
    if (gold < goldCost) {
      sound.playSFX('hurt');
      return false;
    }

    setGold((prev) => prev - goldCost);
    sound.playSFX('upgrade');

    setHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== heroId) return h;
        const newLvl = h.level + 1;
        const statMult = 1.08;
        return {
          ...h,
          level: newLvl,
          currentXp: 0,
          xpToNextLevel: Math.round(h.xpToNextLevel * 1.25),
          stats: {
            ...h.stats,
            maxHp: Math.round(h.stats.maxHp * statMult),
            hp: Math.round(h.stats.maxHp * statMult),
            attack: Math.round(h.stats.attack * statMult),
            defense: Math.round(h.stats.defense * statMult),
          },
        };
      })
    );
    return true;
  };

  const startPatrol = (patrolId: string, heroIds: string[]): boolean => {
    const patrol = PATROLS.find((p) => p.id === patrolId);
    if (!patrol || heroIds.length === 0) return false;

    // Check if already active
    if (activePatrols.some((p) => p.patrolId === patrolId)) return false;

    const now = Date.now();
    const newActive: ActivePatrol = {
      patrolId,
      heroIds,
      startTime: now,
      endTime: now + patrol.durationSeconds * 1000,
    };

    setActivePatrols((prev) => [...prev, newActive]);
    // Mark heroes in patrol
    setHeroes((prev) =>
      prev.map((h) => (heroIds.includes(h.id) ? { ...h, inPatrol: true } : h))
    );

    sound.playSFX('click');
    return true;
  };

  const claimPatrol = (patrolId: string): boolean => {
    const active = activePatrols.find((p) => p.patrolId === patrolId);
    if (!active) return false;
    if (Date.now() < active.endTime) return false;

    const patrol = PATROLS.find((p) => p.id === patrolId);
    if (!patrol) return false;

    // Award rewards
    setGold((prev) => prev + patrol.rewards.gold);
    setSummonCrystals((prev) => prev + patrol.rewards.crystals);

    // Free heroes
    setHeroes((prev) =>
      prev.map((h) => {
        if (active.heroIds.includes(h.id)) {
          return {
            ...h,
            inPatrol: false,
            currentXp: h.currentXp + patrol.rewards.xp,
          };
        }
        return h;
      })
    );

    // Remove from active
    setActivePatrols((prev) => prev.filter((p) => p.patrolId !== patrolId));
    sound.playSFX('victory');
    return true;
  };

  const equipHeroItem = (heroId: string, equipId: string) => {
    const item = equipment.find((e) => e.id === equipId);
    if (!item) return;

    setHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== heroId) return h;
        const newEquipped = { ...h.equipped };
        if (item.type === 'weapon') newEquipped.weapon = item;
        else if (item.type === 'armor') newEquipped.armor = item;
        else newEquipped.accessory = item;

        return { ...h, equipped: newEquipped };
      })
    );
    sound.playSFX('click');
  };

  const unequipHeroItem = (heroId: string, slot: 'weapon' | 'armor' | 'accessory') => {
    setHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== heroId) return h;
        const newEquipped = { ...h.equipped };
        delete newEquipped[slot];
        return { ...h, equipped: newEquipped };
      })
    );
    sound.playSFX('click');
  };

  const upgradeEquipmentItem = (equipId: string): boolean => {
    const item = equipment.find((e) => e.id === equipId);
    if (!item) return false;
    const cost = item.level * 400;
    if (gold < cost) {
      sound.playSFX('hurt');
      return false;
    }

    setGold((prev) => prev - cost);
    sound.playSFX('upgrade');

    setEquipment((prev) =>
      prev.map((e) => {
        if (e.id !== equipId) return e;
        return {
          ...e,
          level: e.level + 1,
          stats: {
            ...e.stats,
            attack: e.stats.attack ? Math.round(e.stats.attack * 1.15) : undefined,
            defense: e.stats.defense ? Math.round(e.stats.defense * 1.15) : undefined,
            hp: e.stats.hp ? Math.round(e.stats.hp * 1.15) : undefined,
          },
        };
      })
    );
    return true;
  };

  const forgeNewEquipment = (type: 'weapon' | 'armor' | 'ring'): boolean => {
    const costGold = 1200;
    const ingots = inventory.find((i) => i.id === 'lingote_hierro');
    if (gold < costGold || !ingots || ingots.count < 5) {
      sound.playSFX('hurt');
      return false;
    }

    // deduct resources
    setGold((prev) => prev - costGold);
    setInventory((prev) =>
      prev.map((i) => (i.id === 'lingote_hierro' ? { ...i, count: i.count - 5 } : i))
    );

    const rarities: ('SR' | 'SSR' | 'UR')[] = ['SR', 'SR', 'SSR', 'UR'];
    const chosenRarity = rarities[Math.floor(Math.random() * rarities.length)];

    const id = `forge_${type}_${Date.now()}`;
    const nameMap = {
      weapon: 'Filo Templado de Icespear',
      armor: 'Armadura Pesada de las Cumbres',
      ring: 'Anillo de Amatista Purificada',
    };
    const iconMap = {
      weapon: '/assets/items/ESPADA LOUX.png',
      armor: '/assets/items/ARMADURA LOUX.png',
      ring: '/assets/items/ANILLO ORO.png',
    };

    const newItem: EquipmentItem = {
      id,
      name: `${nameMap[type]} (${chosenRarity})`,
      type,
      rarity: chosenRarity,
      level: 1,
      icon: iconMap[type],
      description: 'Una pieza de alta calidad recién moldeada en los fuegos de la herrería.',
      stats: {
        attack: type === 'weapon' || type === 'ring' ? Math.floor(Math.random() * 30 + 40) : undefined,
        defense: type === 'armor' || type === 'ring' ? Math.floor(Math.random() * 25 + 30) : undefined,
        hp: type === 'armor' ? Math.floor(Math.random() * 100 + 150) : undefined,
      },
    };

    setEquipment((prev) => [...prev, newItem]);
    sound.playSFX('victory');
    return true;
  };

  const buyShopItem = (itemId: string): boolean => {
    const item = SHOP_ITEMS.find((s) => s.id === itemId);
    if (!item) return false;
    if (gold < item.costGold) {
      sound.playSFX('hurt');
      return false;
    }

    setGold((prev) => prev - item.costGold);
    sound.playSFX('coin');

    if (item.id === 'shop_crystals_single') {
      setSummonCrystals((prev) => prev + 100);
    } else if (item.id === 'shop_crystals_bundle') {
      setSummonCrystals((prev) => prev + 900);
    } else if (item.id === 'shop_potions_pack') {
      setInventory((prev) =>
        prev.map((i) => (i.id === 'xp_potion_large' ? { ...i, count: i.count + 5 } : i))
      );
    } else if (item.id === 'shop_lingotes_pack') {
      setInventory((prev) =>
        prev.map((i) => (i.id === 'lingote_hierro' ? { ...i, count: i.count + 10 } : i))
      );
    } else if (item.id === 'shop_beer') {
      setInventory((prev) =>
        prev.map((i) => (i.id === 'estofado_taverna' ? { ...i, count: i.count + 3 } : i))
      );
    }

    return true;
  };

  const useInventoryItem = (itemId: string, heroId?: string): boolean => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item || item.count <= 0) return false;

    if (item.effect?.xpAmount && heroId) {
      setHeroes((prev) =>
        prev.map((h) => {
          if (h.id !== heroId) return h;
          const addedXp = item.effect!.xpAmount!;
          let newXp = h.currentXp + addedXp;
          let newLvl = h.level;
          let newReq = h.xpToNextLevel;
          while (newXp >= newReq) {
            newXp -= newReq;
            newLvl += 1;
            newReq = Math.round(newReq * 1.25);
          }
          return {
            ...h,
            level: newLvl,
            currentXp: newXp,
            xpToNextLevel: newReq,
            stats: {
              ...h.stats,
              attack: Math.round(h.stats.attack * Math.pow(1.08, newLvl - h.level)),
              maxHp: Math.round(h.stats.maxHp * Math.pow(1.08, newLvl - h.level)),
              hp: Math.round(h.stats.maxHp * Math.pow(1.08, newLvl - h.level)),
            },
          };
        })
      );
      sound.playSFX('upgrade');
    }

    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, count: i.count - 1 } : i)).filter((i) => i.count > 0)
    );
    return true;
  };

  const resetAllData = () => {
    safeStorage.clear();
    setGold(3500);
    setSummonCrystals(1000);
    setAstralShards(120);
    setHeroes(INITIAL_HEROES.filter((h) => ['kairon', 'edacorn', 'roxanne', 'magordito'].includes(h.id)));
    setTeam(['edacorn', 'kairon', 'roxanne', 'magordito']);
    setInventory(INITIAL_INVENTORY);
    setEquipment(INITIAL_EQUIPMENT);
    setActivePatrols([]);
    setQuestProgress({
      chapter: 1,
      completedMissions: ['m1_tirano'],
      stars: { m1_tirano: 3 },
    });
    setMailItems(DEFAULT_MAIL);
  };

  const navigateTo = (tab: string) => {
    sound.playSFX('click');
    setHistoryStack((prev) => [...prev, tab]);
    setCurrentTab(tab);
  };

  const goBack = () => {
    sound.playSFX('click');
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // remove current
      const prev = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentTab(prev);
    } else {
      setCurrentTab('santuario');
      setHistoryStack(['santuario']);
    }
  };

  const completeQuestMission = (missionId: string, stars: number) => {
    setQuestProgress((prev) => {
      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      const newStars = {
        ...prev.stars,
        [missionId]: Math.max(prev.stars[missionId] || 0, stars),
      };
      const updated = {
        ...prev,
        completedMissions: completed,
        stars: newStars,
      };
      safeStorage.setItem(`${STORAGE_KEY}_quest_progress`, JSON.stringify(updated));
      return updated;
    });
  };

  const claimMailReward = (id: string) => {
    setMailItems((prev) =>
      prev.map((m) => {
        if (m.id !== id || m.claimed) return m;
        if (m.rewardGold) addGold(m.rewardGold);
        if (m.rewardCrystals) addCrystals(m.rewardCrystals);
        sound.playSFX('coin');
        return { ...m, claimed: true, read: true };
      })
    );
  };

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_mail`, JSON.stringify(mailItems));
  }, [mailItems]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY}_player_name`, JSON.stringify(playerName));
  }, [playerName]);

  return (
    <GameContext.Provider
      value={{
        gold,
        summonCrystals,
        astralShards,
        playerName,
        setPlayerName,
        heroes,
        team,
        inventory,
        equipment,
        activePatrols,
        currentTab,
        setCurrentTab,
        navigateTo,
        goBack,
        selectedBanner,
        setSelectedBanner,
        questProgress,
        completeQuestMission,
        selectedCombatMissionId,
        setSelectedCombatMissionId,
        isMailboxOpen,
        setIsMailboxOpen,
        isOptionsOpen,
        setIsOptionsOpen,
        mailItems,
        claimMailReward,
        forgeCategory,
        setForgeCategory,
        forgeSubcategory,
        setForgeSubcategory,
        addGold,
        addCrystals,
        setTeamSlot,
        summon,
        levelUpHero,
        startPatrol,
        claimPatrol,
        equipHeroItem,
        unequipHeroItem,
        upgradeEquipmentItem,
        forgeNewEquipment,
        buyShopItem,
        useInventoryItem,
        claimIdleEarnings,
        idleEarningsAvailable,
        resetAllData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
