// store/petStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PetStats, PetInfo, PetMood, PetActivity } from '@/types/pet';

interface PetState {
  info: PetInfo;
  stats: PetStats;
  mood: PetMood;
  activity: PetActivity;
  lastCareTime: Record<string, Date>;
  
  // Actions
  feed: () => void;
  play: () => void;
  sleep: () => void;
  clean: () => void;
  pet: () => void;
  
  // State Updates
  updateStats: (updates: Partial<PetStats>) => void;
  setActivity: (activity: PetActivity) => void;
  gainExperience: (amount: number) => void;
  
  // Time-based updates
  updateTimeBasedStats: () => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      info: {
        name: 'Unnamed Pet',
        age: 0,
        birthday: new Date(),
        level: 1,
        experience: 0,
      },
      stats: {
        hunger: 100,
        happiness: 100,
        energy: 100,
        hygiene: 100,
        health: 100,
      },
      mood: 'neutral',
      activity: 'idle',
      lastCareTime: {},

      feed: () => {
        const { stats } = get();
        if (stats.hunger >= 100) return; // Already full

        set(state => ({
          stats: {
            ...state.stats,
            hunger: Math.min(state.stats.hunger + 30, 100),
            energy: Math.min(state.stats.energy + 10, 100),
          },
          lastCareTime: {
            ...state.lastCareTime,
            feed: new Date()
          }
        }));
      },

      play: () => {
        const { stats } = get();
        if (stats.energy < 20) return; // Too tired to play

        set(state => ({
          stats: {
            ...state.stats,
            happiness: Math.min(state.stats.happiness + 20, 100),
            energy: Math.max(state.stats.energy - 15, 0),
            hunger: Math.max(state.stats.hunger - 10, 0),
          },
          lastCareTime: {
            ...state.lastCareTime,
            play: new Date()
          }
        }));
      },

      sleep: () => {
        set(state => ({
          activity: 'sleeping',
          stats: {
            ...state.stats,
            energy: Math.min(state.stats.energy + 50, 100),
          },
          lastCareTime: {
            ...state.lastCareTime,
            sleep: new Date()
          }
        }));
      },

      clean: () => {
        set(state => ({
          stats: {
            ...state.stats,
            hygiene: 100,
            happiness: Math.min(state.stats.happiness + 10, 100),
          },
          lastCareTime: {
            ...state.lastCareTime,
            clean: new Date()
          }
        }));
      },

      pet: () => {
        set(state => ({
          stats: {
            ...state.stats,
            happiness: Math.min(state.stats.happiness + 5, 100),
          },
          lastCareTime: {
            ...state.lastCareTime,
            pet: new Date()
          }
        }));
      },

      updateStats: (updates) => {
        set(state => ({
          stats: {
            ...state.stats,
            ...updates
          }
        }));
      },

      setActivity: (activity) => {
        set({ activity });
      },

      gainExperience: (amount) => {
        set(state => {
          const newExperience = state.info.experience + amount;
          const experienceToLevel = state.info.level * 100;
          
          if (newExperience >= experienceToLevel) {
            return {
              info: {
                ...state.info,
                level: state.info.level + 1,
                experience: newExperience - experienceToLevel
              }
            };
          }
          
          return {
            info: {
              ...state.info,
              experience: newExperience
            }
          };
        });
      },

      updateTimeBasedStats: () => {
        const now = new Date();
        const { lastCareTime, stats } = get();
        
        // Calculate time-based stat decreases
        const decreaseStats = (lastTime: Date | undefined, decreaseAmount: number) => {
          if (!lastTime) return 0;
          const hoursSinceLastCare = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
          return Math.floor(hoursSinceLastCare * decreaseAmount);
        };

        set(state => ({
          stats: {
            ...state.stats,
            hunger: Math.max(stats.hunger - decreaseStats(lastCareTime.feed, 5), 0),
            happiness: Math.max(stats.happiness - decreaseStats(lastCareTime.play, 3), 0),
            energy: Math.max(stats.energy - decreaseStats(lastCareTime.sleep, 4), 0),
            hygiene: Math.max(stats.hygiene - decreaseStats(lastCareTime.clean, 2), 0),
          }
        }));
      },
    }),
    {
      name: 'pet-storage',
    }
  )
);