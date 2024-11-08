// app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bone, Droplets, MapPin, 
  Camera, Gamepad2, Settings, Menu,
  User, Star
} from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { signIn } from 'next-auth/react';
import { usePetStore } from "@/store/petStore";
import { useInteractionStore } from "@/store/interactionStore";
import { PetEnvironment } from '@/components/PetInteraction/PetEnvironment';
import { ActivityManager } from '@/components/interactions/ActivityManager';
import { usePetMood } from '@/hooks/usePetMood';
import { cn } from '@/lib/utils';
import {useState} from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const { stats, info } = usePetStore();
  const mood = usePetMood();

  // Auth wall
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center"
        >
          <div className="text-6xl mb-4">🐕</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            Welcome to PetPals!
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to start your pet adventure and create your very own virtual pet!
          </p>
          <Button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Sign in with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Stats display component
  const StatIndicator = ({ 
    icon: Icon, 
    value, 
    color 
  }: { 
    icon: LucideIcon; 
    value: number; 
    color: string; 
  }) => (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm"
      whileHover={{ scale: 1.1 }}
    >
      <Icon className={cn(
        "h-6 w-6",
        value > 50 ? color : 'text-gray-300'
      )} />
    </motion.div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-primary-50 to-neutral-50">
      {/* Level and Experience Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Level {info.level}</span>
          </div>
          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(info.experience / (info.level * 100)) * 100}%` 
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {info.experience}/{info.level * 100} XP
          </span>
        </div>
      </div>

      {/* Main Pet View Area */}
      <div className="relative h-2/3 w-full bg-neutral-100/50 shadow-inner">
        <PetEnvironment environment="room" />

        {/* Status Indicators */}
        <div className="absolute top-16 left-4 flex gap-2">
          <StatIndicator 
            icon={Heart} 
            value={stats.happiness} 
            color="text-red-500" 
          />
          <StatIndicator 
            icon={Bone} 
            value={stats.hunger} 
            color="text-amber-500" 
          />
          <StatIndicator 
            icon={Droplets} 
            value={stats.energy} 
            color="text-blue-500" 
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute top-16 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Pet Name Display */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <h2 className="font-medium text-primary-800">
              {session.user?.name}'s Pet
            </h2>
          </div>
        </div>
      </div>

      {/* Interactive Area */}
      <AnimatePresence>
        <motion.div 
          className="absolute bottom-0 w-full"
          initial={false}
          animate={{ 
            height: showMenu ? '60%' : '100px'
          }}
        >
          <Card className="h-full rounded-t-3xl bg-white/80 backdrop-blur-sm border-t border-primary-100">
            {showMenu ? (
              <div className="p-6 h-full overflow-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-primary-800">Activities</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMenu(false)}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>
                
                <ActivityManager />
              </div>
            ) : (
              <div className="h-full flex justify-around items-center px-6">
                <div className="grid grid-cols-4 gap-4 w-full max-w-lg">
                  {['Feed', 'Play', 'Walk', 'Care'].map((action, index) => (
                    <motion.button
                      key={index}
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMenu(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                        {action === 'Feed' && <Bone className="h-6 w-6 text-amber-500" />}
                        {action === 'Play' && <Gamepad2 className="h-6 w-6 text-green-500" />}
                        {action === 'Walk' && <MapPin className="h-6 w-6 text-blue-500" />}
                        {action === 'Care' && <Heart className="h-6 w-6 text-red-500" />}
                      </div>
                      <span className="text-sm font-medium text-primary-700">{action}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);