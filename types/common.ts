// types/common.ts
import { LucideIcon } from 'lucide-react';

export interface MinigameProps {
  onComplete: (success: boolean) => void;
  onError?: (error: Error) => void;
}

export interface Activity {
  id: string;
  name: string;
  Icon: LucideIcon;
  description: string;
  energyCost: number;
  cooldown: number;
  color: string;
  rewards: {
    happiness: number;
    experience: number;
    coins?: number;
  };
  minigameComponent?: React.ComponentType<MinigameProps>;
}