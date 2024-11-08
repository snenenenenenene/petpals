// hooks/usePetMood.ts
import { useEffect } from 'react';
import { usePetStore } from '@/store/petStore';
import { PetMood } from '@/types/pet';

export const usePetMood = () => {
  const { stats, updateStats } = usePetStore();
  
  useEffect(() => {
    // Update stats every minute
    const interval = setInterval(() => {
      updateStats({
        hunger: Math.max(stats.hunger - 0.5, 0),
        happiness: Math.max(stats.happiness - 0.3, 0),
        energy: Math.max(stats.energy - 0.4, 0),
        hygiene: Math.max(stats.hygiene - 0.2, 0),
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [stats, updateStats]);

  const calculateMood = (): PetMood => {
    const averageStats = (
      stats.hunger + 
      stats.happiness + 
      stats.energy + 
      stats.hygiene + 
      stats.health
    ) / 5;

    if (stats.hunger < 20) return 'hungry';
    if (stats.energy < 20) return 'tired';
    if (stats.health < 50) return 'sick';
    
    if (averageStats >= 80) return 'happy';
    if (averageStats >= 50) return 'neutral';
    return 'sad';
  };

  return calculateMood();
};