// app/[locale]/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import {
  Bone,
  Heart,
  Star,
  Trophy,
  Gamepad,
  MapPin,
  Package,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: Gamepad,
    title: "Interactive Care",
    description: "Play and bond with your virtual pet",
    color: "bg-emerald-500",
    delay: 0.2
  },
  {
    icon: MapPin,
    title: "Daily Adventures",
    description: "Explore exciting locations together",
    color: "bg-blue-500",
    delay: 0.3
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Complete quests and earn rewards",
    color: "bg-amber-500",
    delay: 0.4
  },
  {
    icon: Package,
    title: "Pet Shop",
    description: "Buy toys and treats for your pet",
    color: "bg-purple-500",
    delay: 0.5
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-neutral-50">
        <motion.div
          className="absolute top-20 left-[10%] text-4xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          🦴
        </motion.div>
        <motion.div
          className="absolute top-40 right-[15%] text-4xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          🎾
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[20%] text-4xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          ❤️
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[10%] text-4xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
        >
          🐾
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              🐕
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-heading font-bold text-primary-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to PetPals
          </motion.h1>

          <motion.p
            className="text-xl text-primary-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your virtual pet companion awaits! Start your journey of friendship and care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start Playing</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
              className="relative group"
            >
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className={`${feature.color} text-white rounded-xl p-3 w-12 h-12 mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100/50 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Status Indicators */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Level System</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-medium">Care System</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-medium">Achievements</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}