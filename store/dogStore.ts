// app/store/dogStore.ts
import { create } from "zustand";

interface DogState {
  hunger: number;
  happiness: number;
  energy: number;
  feedDog: () => void;
  playWithDog: () => void;
  restDog: () => void;
  updateHunger: (value: number) => void;
  updateHappiness: (value: number) => void;
  updateEnergy: (value: number) => void;
}

export const useDogStore = create<DogState>((set) => ({
  hunger: 100,
  happiness: 100,
  energy: 100,

  // Function to feed the dog, increasing hunger and happiness
  feedDog: () =>
    set((state) => ({
      hunger: Math.min(state.hunger + 10, 100), // Cap at 100
      happiness: Math.min(state.happiness + 5, 100),
    })),

  // Function to play with the dog, increasing happiness but decreasing energy
  playWithDog: () =>
    set((state) => ({
      happiness: Math.min(state.happiness + 10, 100),
      energy: Math.max(state.energy - 10, 0), // Ensure energy doesn't go below 0
    })),

  // Function to rest the dog, increasing energy and decreasing hunger slightly
  restDog: () =>
    set((state) => ({
      energy: Math.min(state.energy + 15, 100),
      hunger: Math.max(state.hunger - 5, 0), // Ensure hunger doesn't go below 0
    })),

  // General-purpose functions to update each stat individually
  updateHunger: (value: number) =>
    set((state) => ({ hunger: Math.min(Math.max(state.hunger + value, 0), 100) })),
  updateHappiness: (value: number) =>
    set((state) => ({ happiness: Math.min(Math.max(state.happiness + value, 0), 100) })),
  updateEnergy: (value: number) =>
    set((state) => ({ energy: Math.min(Math.max(state.energy + value, 0), 100) })),
}));
