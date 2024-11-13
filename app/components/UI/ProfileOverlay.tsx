import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	LogOut,
	Settings,
	User,
	Star,
	Trophy,
	Calendar,
	Heart,
	Coins,
	ChevronRight,
	Bell
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { usePetStore } from '@/store/petStore';
import { useAchievements } from '@/hooks/useAchievements';

interface ProfileOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

const ProfileOverlay = ({ isOpen, onClose }: ProfileOverlayProps) => {
	const { data: session } = useSession();
	const router = useRouter();
	const { preferences } = useUserPreferences();
	const { info: petInfo, stats } = usePetStore();
	const { points: achievementPoints } = useAchievements();

	const quickStats = [
		{
			icon: Star,
			label: 'Level',
			value: petInfo.level,
			color: 'text-yellow-500'
		},
		{
			icon: Trophy,
			label: 'Points',
			value: achievementPoints,
			color: 'text-amber-500'
		},
		{
			icon: Coins,
			label: 'Coins',
			value: session?.user?.coins || 0,
			color: 'text-blue-500'
		},
		{
			icon: Heart,
			label: 'Streak',
			value: session?.user?.loginStreak || 0,
			color: 'text-red-500'
		}
	];

	const menuItems = [
		{
			icon: User,
			label: 'My Profile',
			onClick: () => router.push('/profile')
		},
		{
			icon: Settings,
			label: 'Settings',
			onClick: () => router.push('/profile?tab=preferences')
		},
		{
			icon: Bell,
			label: 'Notifications',
			onClick: () => router.push('/profile?tab=notifications')
		},
		{
			icon: LogOut,
			label: 'Sign Out',
			onClick: () => signOut(),
			variant: 'ghost' as const,
			className: 'text-red-500 hover:text-red-600'
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

					{/* Overlay Panel */}
					<motion.div
						className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
					>
						{/* User Info Section */}
						<div className="p-4 border-b border-gray-100">
							<div className="flex items-center gap-3">
								<Avatar
									src={session?.user?.image || ''}
									alt={session?.user?.name || ''}
									size="lg"
								/>
								<div className="flex-1">
									<h3 className="font-medium text-lg">{session?.user?.name}</h3>
									<p className="text-sm text-gray-500">{session?.user?.email}</p>
									<div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
										<Calendar className="w-3 h-3" />
										<span>Joined {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Stats Grid */}
						<div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
							{quickStats.map((stat, index) => (
								<div
									key={index}
									className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100"
								>
									<stat.icon className={`w-4 h-4 ${stat.color}`} />
									<div>
										<p className="text-xs text-gray-500">{stat.label}</p>
										<p className="font-medium">{stat.value}</p>
									</div>
								</div>
							))}
						</div>

						{/* Menu Items */}
						<div className="p-2">
							{menuItems.map((item, index) => (
								<Button
									key={index}
									variant={item.variant || 'ghost'}
									className="w-full justify-start gap-2 mb-1"
									onClick={item.onClick}
								>
									<item.icon className="w-4 h-4" />
									<span className="flex-1 text-left">{item.label}</span>
									<ChevronRight className="w-4 h-4 text-gray-400" />
								</Button>
							))}
						</div>

						{/* Footer */}
						<div className="p-4 bg-primary-50/50 border-t border-primary-100">
							<div className="text-xs text-center text-primary-600">
								<p>Language: {preferences.language}</p>
								<p className="mt-1">Version 1.0.0</p>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ProfileOverlay;