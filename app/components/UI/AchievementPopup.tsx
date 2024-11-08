import { Achievement } from "@/types/achievements";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

// components/AchievementPopup.tsx
export const AchievementPopup = ({ achievement }: { achievement: Achievement }) => {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 360]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Trophy className="w-16 h-16 text-yellow-500" />
        </motion.div>
        <h2 className="text-xl font-bold mt-4">{achievement.title}</h2>
        <p className="text-gray-600 text-center mt-2">{achievement.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{achievement.points} Points</span>
        </div>
      </div>
    </motion.div>
  );
};