// app/[locale]/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Heart,
  Bone,
  Battery,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { signIn } from 'next-auth/react';
import { usePetStore } from "@/store/petStore";
import { ThreeCanvas } from '@/components/3D/ThreeCanvas';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { stats } = usePetStore();

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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen 3D environment */}
      <div className="absolute inset-0">
        <ThreeCanvas />
      </div>

      {/* Stats Display */}
      <div className="absolute bottom-6 right-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
        >
          <div className="space-y-3">
            <StatBar
              icon={Heart}
              label="Happiness"
              value={Math.round(stats.happiness)}
              color="text-red-500"
            />
            <StatBar
              icon={Bone}
              label="Hunger"
              value={Math.round(stats.hunger)}
              color="text-amber-500"
            />
            <StatBar
              icon={Battery}
              label="Energy"
              value={Math.round(stats.energy)}
              color="text-blue-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface StatBarProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatBar({ icon: Icon, label, value, color }: StatBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", color)} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full", color.replace('text-', 'bg-'))}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}