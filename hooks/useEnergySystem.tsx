// hooks/useEnergySystem.ts
import { useState, useEffect } from 'react';
import { usePetStore } from '@/store/petStore';

export const useEnergySystem = () => {
	const { stats, updateStats } = usePetStore();
	const [lastUpdate, setLastUpdate] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const minutesElapsed = (now - lastUpdate) / 60000;

			if (stats.energy < 100 && minutesElapsed >= 1) {
				updateStats({
					energy: Math.min(stats.energy + Math.floor(minutesElapsed), 100)
				});
				setLastUpdate(now);
			}
		}, 60000); // Check every minute

		return () => clearInterval(interval);
	}, [stats.energy, lastUpdate, updateStats]);

	const hasEnoughEnergy = (cost: number) => stats.energy >= cost;

	const consumeEnergy = (amount: number) => {
		if (hasEnoughEnergy(amount)) {
			updateStats({
				energy: Math.max(stats.energy - amount, 0)
			});
			return true;
		}
		return false;
	};

	return {
		hasEnoughEnergy,
		consumeEnergy,
		currentEnergy: stats.energy
	};
};