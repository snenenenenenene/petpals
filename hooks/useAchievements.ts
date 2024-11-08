// hooks/useAchievements.ts
import { useCallback } from 'react';
import { useAchievementStore } from '@/store/achievementStore';
import { Achievement } from '@/types/achievements';

export const useAchievements = () => {
  const { 
    achievements, 
    recentAchievements, 
    points,
    addAchievement,
    updateProgress,
    clearRecentAchievements 
  } = useAchievementStore();

  const checkProgress = useCallback((type: string, value: number) => {
    updateProgress(type, value);
    
    // Get newly completed achievements
    const newlyCompleted = achievements.filter(achievement => 
      achievement.requirement.type === type &&
      !achievement.isComplete &&
      achievement.requirement.current + value >= achievement.requirement.value
    );

    // Trigger rewards and notifications for newly completed achievements
    newlyCompleted.forEach(achievement => {
      addAchievement({
        ...achievement,
        isComplete: true,
        dateCompleted: new Date()
      });
    });

    return newlyCompleted;
  }, [achievements, addAchievement, updateProgress]);

  const getProgress = useCallback((type: string) => {
    return achievements
      .filter(achievement => achievement.requirement.type === type)
      .map(achievement => ({
        ...achievement,
        percentage: (achievement.requirement.current / achievement.requirement.value) * 100
      }));
  }, [achievements]);

  const getCategoryProgress = useCallback((category: Achievement['category']) => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const completed = categoryAchievements.filter(a => a.isComplete).length;
    const total = categoryAchievements.length;
    
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }, [achievements]);

  return {
    achievements,
    recentAchievements,
    points,
    checkProgress,
    getProgress,
    getCategoryProgress,
    clearRecentAchievements
  };
};