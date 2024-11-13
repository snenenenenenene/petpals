// app/dashboard/page.tsx
'use client';

import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Heart, 
  Bone, 
  Battery, 
  User,
  Users,
  Bell,
  Trophy,
  Crown,
  Search,
  MapPin,
  Gamepad2,
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ThreeCanvas } from '@/components/3D/ThreeCanvas';
import { usePetStore } from "@/store/petStore";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAchievements } from '@/hooks/useAchievements';
import { useFriends } from '@/hooks/useFriends';
import { useSocket } from '@/hooks/useSocket';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import ProfileSettings from '@/components/profile/ProfileSettings';
import FriendsOverlay from '@/components/friends/FriendsOverlay';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { stats, updateStats } = usePetStore();
  const { achievements, points: achievementPoints } = useAchievements();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const socket = useSocket();
  const toast = useToast();

  const { 
    friends, 
    pendingRequests, 
    pendingInvites,
    updateActivityStatus,
    handleFriendRequest,
    handleInvitation
  } = useFriends();

  // Handle real-time notifications
  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification) => {
      toast.addToast({
        message: notification.message,
        type: notification.type,
      });
    });

    return () => {
      socket.off('notification');
    };
  }, [socket, toast]);

  // Update activity status when interacting with pet
  const handlePetInteraction = (interaction: string) => {
    updateActivityStatus('PLAYING');
    
    // Handle the interaction
    switch (interaction) {
      case 'feed':
        updateStats({
          hunger: Math.min(stats.hunger + 30, 100),
          energy: Math.min(stats.energy + 20, 100),
          happiness: Math.min(stats.happiness + 5, 100)
        });
        break;
      case 'play':
        updateStats({
          happiness: Math.min(stats.happiness + 20, 100),
          energy: Math.max(stats.energy - 15, 0),
          hunger: Math.max(stats.hunger - 10, 0)
        });
        break;
      // Add other interactions...
    }

    // Reset status after interaction
    setTimeout(() => {
      updateActivityStatus('ONLINE');
    }, 5000);
  };

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
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-primary-800">Level {stats.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-primary-800">{achievementPoints} pts</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Friends Button */}
          <motion.button
            onClick={() => setIsFriendsOpen(true)}
            className="relative rounded-full bg-white/90 backdrop-blur-sm p-2 hover:ring-4 ring-primary-200 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-6 h-6 text-primary-500" />
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </motion.button>

          {/* Profile Button */}
          <motion.button
            onClick={() => setIsProfileOpen(true)}
            className="relative rounded-full overflow-hidden hover:ring-4 ring-primary-200 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar
              src={session?.user?.image || ''}
              alt={session?.user?.name || ''}
              size="md"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
          </motion.button>
        </div>
      </div>

      {/* Main Pet View */}
      <div className="absolute inset-0">
        <ThreeCanvas onInteract={handlePetInteraction} />
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

      {/* Activity Invites */}
      <AnimatePresence>
        {pendingInvites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute left-6 top-20 z-20"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h3 className="font-medium text-primary-800 mb-3">
                Activity Invites
              </h3>
              <div className="space-y-2">
                {pendingInvites.map((invite) => (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-white rounded-lg p-2"
                  >
                    <Avatar
                      src={invite.sender.image}
                      alt={invite.sender.name}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-800">
                        {invite.sender.name}
                      </p>
                      <p className="text-xs text-primary-600">
                        Invited you to {invite.type.toLowerCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInvitation(invite.id, 'REJECT')}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleInvitation(invite.id, 'ACCEPT')}
                      >
                        Accept
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <ProfileSettings 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <FriendsOverlay
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
        friends={friends}
        pendingRequests={pendingRequests}
        onAcceptRequest={(id) => handleFriendRequest(id, 'ACCEPT')}
        onRejectRequest={(id) => handleFriendRequest(id, 'REJECT')}
      />
    </div>
  );
}

// Stats Bar Component
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
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}