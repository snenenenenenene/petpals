// types/pet.ts
export type PetMood = 'happy' | 'neutral' | 'sad' | 'tired' | 'hungry' | 'sick';
export type PetActivity = 'idle' | 'playing' | 'sleeping' | 'eating' | 'walking';

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  hygiene: number;
  health: number;
}

export interface PetInfo {
  name: string;
  age: number; // in days
  birthday: Date;
  level: number;
  experience: number;
}