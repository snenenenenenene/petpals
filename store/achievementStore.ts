  // store/achievementStore.ts
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';
  
  interface AchievementState {
	achievements: Achievement[];
	recentAchievements: Achievement[];
	points: number;
	addAchievement: (achievement: Achievement) => void;
	updateProgress: (type: string, value: number) => void;
	clearRecentAchievements: () => void;
  }
  
  export const useAchievementStore = create<AchievementState>()(
	persist(
	  (set, get) => ({
		achievements: [],
		recentAchievements: [],
		points: 0,
  
		addAchievement: (achievement) => {
		  set((state) => ({
			achievements: [...state.achievements, achievement],
			recentAchievements: [...state.recentAchievements, achievement],
			points: state.points + achievement.points,
		  }));
		},
  
		updateProgress: (type, value) => {
		  const { achievements } = get();
		  const updatedAchievements = achievements.map((achievement) => {
			if (achievement.requirement.type === type && !achievement.isComplete) {
			  const newCurrent = achievement.requirement.current + value;
			  const isComplete = newCurrent >= achievement.requirement.value;
			  
			  return {
				...achievement,
				requirement: {
				  ...achievement.requirement,
				  current: newCurrent,
				},
				isComplete,
				dateCompleted: isComplete ? new Date() : undefined,
			  };
			}
			return achievement;
		  });
  
		  set({ achievements: updatedAchievements });
		},
  
		clearRecentAchievements: () => {
		  set({ recentAchievements: [] });
		},
	  }),
	  {
		name: 'achievement-storage',
	  }
	)
  );