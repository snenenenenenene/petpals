// types/stores.ts
export interface PetStats {
	hunger: number;
	happiness: number;
	energy: number;
	hygiene: number;
	health: number;
	experience: number;
  }
  
  export interface InteractionState {
	cooldowns: Record<string, number>;
	checkCooldown: (activityId: string) => boolean;
	startCooldown: (activityId: string) => void;
	getCooldownRemaining: (activityId: string) => number;
  }