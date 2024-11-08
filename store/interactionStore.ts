// store/interactionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getActivityCooldown } from '@/data/activities';

interface InteractionState {
  cooldowns: Record<string, number>;
  checkCooldown: (activityId: string) => boolean;
  startCooldown: (activityId: string) => void;
  getCooldownRemaining: (activityId: string) => number;
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set, get) => ({
      cooldowns: {},

      checkCooldown: (activityId) => {
        const cooldowns = get().cooldowns;
        if (!cooldowns[activityId]) return true;
        
        const now = Date.now();
        return now >= cooldowns[activityId];
      },

      startCooldown: (activityId) => {
        const cooldownMinutes = getActivityCooldown(activityId);
        const cooldownTime = cooldownMinutes * 60 * 1000; // Convert minutes to milliseconds
        
        set((state) => ({
          cooldowns: {
            ...state.cooldowns,
            [activityId]: Date.now() + cooldownTime,
          },
        }));
      },

      getCooldownRemaining: (activityId) => {
        const cooldowns = get().cooldowns;
        if (!cooldowns[activityId]) return 0;

        const remaining = Math.max(0, cooldowns[activityId] - Date.now());
        return Math.ceil(remaining / 1000); // Convert to seconds
      },
    }),
    {
      name: 'interaction-storage',
    }
  )
);