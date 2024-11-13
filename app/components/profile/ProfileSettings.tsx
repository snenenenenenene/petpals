// app/components/profile/ProfileSettings.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell,
  Award,
  X,
  ChevronLeft,
  Volume2,
  Users,
  Star,
  Crown,
  Heart,
  Bone,
  Trophy,
  Calendar,
  Gamepad2,
  MapPin,
  Shield,
  LogOut,
  Music,
  Globe,
  BookOpen
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { ThemePicker } from '@/components/ThemePicker';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAchievements } from '@/hooks/useAchievements';
import { usePetStore } from '@/store/petStore';
import { cn } from '@/lib/utils';

type SettingsView = 'main' | 'profile' | 'preferences' | 'achievements';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const { data: session } = useSession();
  const { preferences, updatePreferences } = useUserPreferences();
  const { achievements, points: achievementPoints } = useAchievements();
  const { stats, info: petInfo } = usePetStore();

  const menuItems = [
    {
      id: 'profile',
      icon: User,
      label: 'My Profile',
      description: 'View your pet parent profile',
      color: 'bg-green-100 text-green-600',
      content: (
        <div className="space-y-6">
          {/* Profile Header */}
          <motion.div 
            className="relative bg-primary-50 rounded-2xl p-6 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <Avatar
                  src={session?.user?.image || ''}
                  alt={session?.user?.name || ''}
                  size="xl"
                />
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full px-2 py-1 text-xs font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Lv. {petInfo.level}
                </motion.div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800">{session?.user?.name}</h3>
                <p className="text-sm text-primary-600">{session?.user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-primary-600">
                    Joined {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-5">
              <Crown className="w-40 h-40" />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatsCard
              icon={Star}
              label="Pet Level"
              value={petInfo.level}
              subValue="Max Level 100"
              color="text-yellow-500"
            />
            <StatsCard
              icon={Heart}
              label="Login Streak"
              value={session?.user?.loginStreak || 0}
              subValue="Days"
              color="text-red-500"
            />
            <StatsCard
              icon={Trophy}
              label="Achievements"
              value={achievements.length}
              subValue={`${achievementPoints} Points`}
              color="text-amber-500"
            />
            <StatsCard
              icon={Bone}
              label="Total Pets"
              value={1}
              subValue="Collection"
              color="text-blue-500"
            />
          </div>

          {/* Recent Activity */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-bold text-primary-800 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              <ActivityItem
                icon={Gamepad2}
                label="Played with Buddy"
                time="2 hours ago"
                color="text-green-500"
              />
              <ActivityItem
                icon={MapPin}
                label="Morning Walk"
                time="5 hours ago"
                color="text-blue-500"
              />
              <ActivityItem
                icon={Bone}
                label="Fed breakfast"
                time="8 hours ago"
                color="text-amber-500"
              />
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'preferences',
      icon: Settings,
      label: 'Settings',
      description: 'Customize your experience',
      color: 'bg-blue-100 text-blue-600',
      content: (
        <div className="space-y-6">
          {/* Theme Settings */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-primary-800 mb-4">Theme</h3>
            <ThemePicker />
          </motion.div>

          {/* Sound & Notifications */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-primary-800 mb-4">Sound & Notifications</h3>
            <div className="space-y-4">
              <PreferenceToggle
                icon={Volume2}
                label="Sound Effects"
                description="Play sounds during interactions"
                checked={preferences.soundEnabled}
                onChange={(checked) => updatePreferences({ soundEnabled: checked })}
              />
              <PreferenceToggle
                icon={Music}
                label="Background Music"
                description="Play background music"
                checked={preferences.musicEnabled}
                onChange={(checked) => updatePreferences({ musicEnabled: checked })}
              />
              <PreferenceToggle
                icon={Bell}
                label="Notifications"
                description="Get updates about your pet"
                checked={preferences.notifications}
                onChange={(checked) => updatePreferences({ notifications: checked })}
              />
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-primary-800 mb-4">Language</h3>
            <select
              className="w-full p-3 rounded-xl border border-primary-200 bg-white focus:ring-2 focus:ring-primary-500 transition-all"
              value={preferences.language}
              onChange={(e) => updatePreferences({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="ja">日本語</option>
            </select>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-primary-800 mb-4">Privacy</h3>
            <div className="space-y-4">
              <PreferenceToggle
                icon={Shield}
                label="Profile Privacy"
                description="Only friends can see your profile"
                checked={preferences.privateProfile}
                onChange={(checked) => updatePreferences({ privateProfile: checked })}
              />
              <PreferenceToggle
                icon={Globe}
                label="Show Online Status"
                description="Let others see when you're online"
                checked={preferences.showOnlineStatus}
                onChange={(checked) => updatePreferences({ showOnlineStatus: checked })}
              />
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 'achievements',
      icon: Award,
      label: 'Achievements',
      description: 'View your milestones',
      color: 'bg-purple-100 text-purple-600',
      content: (
        <div className="space-y-6">
          {/* Achievement Summary */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary-800">Achievement Points</h3>
                <p className="text-4xl font-bold text-primary-500">{achievementPoints}</p>
              </div>
              <Trophy className="w-12 h-12 text-primary-500" />
            </div>
          </motion.div>

          {/* Achievement Categories */}
          <div className="grid grid-cols-2 gap-4">
            <AchievementCategory
              icon={Heart}
              label="Care"
              total={10}
              completed={3}
              color="text-red-500"
            />
            <AchievementCategory
              icon={Star}
              label="Training"
              total={8}
              completed={2}
              color="text-yellow-500"
            />
            <AchievementCategory
              icon={Users}
              label="Social"
              total={6}
              completed={1}
              color="text-blue-500"
            />
            <AchievementCategory
              icon={MapPin}
              label="Exploration"
              total={12}
              completed={4}
              color="text-green-500"
            />
          </div>

          {/* Achievement List */}
          <div className="grid gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-6 border-2",
                  achievement.isComplete 
                    ? "bg-primary-50 border-primary-200" 
                    : "bg-white border-gray-200"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-primary-800">
                      {achievement.name}
                    </h4>
                    <p className="text-primary-600 mt-1">
                      {achievement.description}
                    </p>
                    {!achievement.isComplete && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-primary-600">Progress</span>
                          <span className="font-medium text-primary-800">
                            {achievement.progress} / {achievement.target}
                          </span>
                        </div>
                        <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary-500"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(achievement.progress / achievement.target) * 100}%` 
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <div className="flex items-center gap-1 text-primary-500 font-bold">
                      <Star className="w-4 h-4" />
                      <span>{achievement.points}</span>
                    </div>
                    {achievement.isComplete && (
                      <span className="text-xs text-primary-500 mt-1">
                        {new Date(achievement.completedAt!).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {achievement.isComplete && (
                  <div className="absolute -right-8 -bottom-8 opacity-5">
                    <Trophy className="w-32 h-32" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-xl z-50 rounded-l-3xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <div className="flex items-center gap-3">
                {currentView !== 'main' && (
                  <button 
                    onClick={() => setCurrentView('main')}
                    className="rounded-xl p-2 hover:bg-primary-50 transition-colors"
                  >
<ChevronLeft className="w-5 h-5 text-primary-500" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-primary-800">
                  {currentView === 'main' 
                    ? 'Profile Settings' 
                    : menuItems.find(item => item.id === currentView)?.label
                  }
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-primary-50 transition-colors"
              >
                <X className="w-5 h-5 text-primary-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
              {currentView === 'main' ? (
                <div className="grid gap-4">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      className="relative overflow-hidden group w-full text-left"
                      onClick={() => setCurrentView(item.id as SettingsView)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative z-10 flex items-center gap-4 p-6 rounded-2xl bg-white border-2 border-primary-100 group-hover:border-primary-200 transition-colors">
                        <div className={cn(
                          "p-3 rounded-xl",
                          item.color
                        )}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-800">{item.label}</h3>
                          <p className="text-sm text-primary-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}

                  {/* Sign Out Button */}
                  <motion.button
                    className="w-full p-4 mt-4 text-red-500 hover:text-red-600 font-medium flex items-center justify-center gap-2 rounded-xl hover:bg-red-50 transition-colors"
                    onClick={() => signOut()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                menuItems.find(item => item.id === currentView)?.content
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper Components
interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  subValue: string;
  color: string;
}

function StatsCard({ icon: Icon, label, value, subValue, color }: StatsCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 border-2 border-primary-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className={cn("w-6 h-6 mb-2", color)} />
      <div className="space-y-1">
        <h4 className="text-sm text-primary-600">{label}</h4>
        <p className="text-2xl font-bold text-primary-800">{value}</p>
        <p className="text-xs text-primary-500">{subValue}</p>
      </div>
    </motion.div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  label: string;
  time: string;
  color: string;
}

function ActivityItem({ icon: Icon, label, time, color }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-xl bg-white",
        color
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-primary-800">{label}</p>
        <p className="text-sm text-primary-500">{time}</p>
      </div>
    </div>
  );
}

interface PreferenceToggleProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function PreferenceToggle({ 
  icon: Icon, 
  label, 
  description, 
  checked, 
  onChange 
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white text-primary-500">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-primary-800">{label}</p>
          <p className="text-sm text-primary-600">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}

interface AchievementCategoryProps {
  icon: React.ElementType;
  label: string;
  total: number;
  completed: number;
  color: string;
}

function AchievementCategory({
  icon: Icon,
  label,
  total,
  completed,
  color
}: AchievementCategoryProps) {
  const percentage = (completed / total) * 100;

  return (
    <motion.div
      className="bg-white rounded-2xl p-4 border-2 border-primary-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className={cn("w-6 h-6 mb-2", color)} />
      <div className="space-y-2">
        <h4 className="font-medium text-primary-800">{label}</h4>
        <div className="flex justify-between text-sm">
          <span className="text-primary-600">Progress</span>
          <span className="font-medium text-primary-800">{completed}/{total}</span>
        </div>
        <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full", color.replace('text-', 'bg-'))}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}