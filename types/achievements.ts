// types/achievements.ts
export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon?: string;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	points: number;
	category: 'care' | 'training' | 'social' | 'exploration';
	requirement: {
	  type: string;
	  value: number;
	  current: number;
	};
	rewards?: {
	  type: 'coins' | 'items' | 'experience';
	  amount: number;
	  itemId?: string;
	}[];
	isComplete: boolean;
	dateCompleted?: Date;
  }
  
