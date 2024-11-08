// types/interactions.ts
export type InteractionType = 
  | 'pet' 
  | 'feed' 
  | 'play' 
  | 'walk' 
  | 'train' 
  | 'groom' 
  | 'treat' 
  | 'toy';

export interface Interaction {
  type: InteractionType;
  name: string;
  description: string;
  icon: string;
  energyCost: number;
  cooldown: number; // in minutes
  rewards: {
    happiness: number;
    experience: number;
    coins?: number;
  };
  requirements?: {
    level?: number;
    energy?: number;
    items?: string[];
  };
}