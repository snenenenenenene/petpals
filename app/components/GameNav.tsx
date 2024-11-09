// components/GameNav.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Home,
	User,
	Trophy,
	MapPin,
	Settings,
	Package,
	Menu,
	ChevronDown,
	Bell,
	Calendar
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Import your stores
import { useAchievementStore } from '@/store/achievementStore';
// You'd create this for tasks
// import { useTaskStore } from '@/store/taskStore';

interface NavItem {
	icon: typeof Home;
	label: string;
	path: string;
	color: string;
	description: string;
	showNotifications?: boolean;
}

interface NotificationBadgeProps {
	count: number;
	color?: string;
}

function NotificationBadge({ count, color = "bg-red-500" }: NotificationBadgeProps) {
	if (count === 0) return null;

	return (
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			className={cn(
				"absolute -top-1 -right-1 min-w-5 h-5",
				"flex items-center justify-center",
				"rounded-full text-white text-xs font-bold px-1",
				"border-2 border-white shadow-sm",
				color
			)}
		>
			{count > 99 ? '99+' : count}
		</motion.div>
	);
}

const mainNavItems: NavItem[] = [
	{
		icon: Home,
		label: 'Home',
		path: '/dashboard',
		color: 'bg-emerald-500',
		description: 'Return to your pet\'s home'
	},
	{
		icon: MapPin,
		label: 'Adventure',
		path: '/adventure',
		color: 'bg-blue-500',
		description: 'Take your pet on exciting walks and adventures'
	},
	{
		icon: Package,
		label: 'Shop',
		path: '/shop',
		color: 'bg-purple-500',
		description: 'Buy items for your pet'
	},
];

const secondaryNavItems: NavItem[] = [
	{
		icon: Bell,
		label: 'Tasks',
		path: '/tasks',
		color: 'bg-blue-500',
		description: 'Your daily and weekly tasks',
		showNotifications: true
	},
	{
		icon: User,
		label: 'Profile',
		path: '/profile',
		color: 'bg-indigo-500',
		description: 'View and edit your profile'
	},
	{
		icon: Settings,
		label: 'Settings',
		path: '/settings',
		color: 'bg-gray-500',
		description: 'Adjust game settings'
	},
];

export function GameNav({ locale }: { locale: string }) {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const { recentAchievements } = useAchievementStore();
	// You'd implement this for tasks
	const uncompletedTasks = 3; // This would come from your task store

	const handleNavigation = (item: NavItem) => {
		window.location.href = `/${locale}${item.path}`;
		setIsNavOpen(false);
	};

	const isCurrentPath = (path: string) => window.location.pathname.includes(path);

	const getNotificationCount = (item: NavItem) => {
		if (!item.showNotifications) return 0;
		if (item.path === '/achievements') return recentAchievements.length;
		if (item.path === '/tasks') return uncompletedTasks;
		return 0;
	};

	const NavButton = ({ item, showLabel = false }: { item: NavItem; showLabel?: boolean }) => (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => handleNavigation(item)}
			className={cn(
				"relative",
				showLabel ? "flex items-center gap-2 px-4 py-2" : "p-2",
				"rounded-lg",
				isCurrentPath(item.path)
					? `${item.color}/10 text-${item.color.split('-')[1]}-500`
					: 'hover:bg-primary-50'
			)}
		>
			<div className="relative">
				<item.icon className="w-6 h-6" />
				<NotificationBadge
					count={getNotificationCount(item)}
					color={item.path === '/achievements' ? 'bg-amber-500' : 'bg-blue-500'}
				/>
			</div>
			{showLabel && <span className="font-medium">{item.label}</span>}
		</motion.button>
	);

	return (
		<>
			{/* Desktop Navigation */}
			<div className="hidden lg:block">
				<motion.div
					className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-200"
					initial={{ y: -100 }}
					animate={{ y: 0 }}
				>
					<div className="max-w-7xl mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							{/* Logo/Home */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleNavigation(mainNavItems[0])}
								className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50"
							>
								<span className="text-2xl">🐕</span>
								<span className="font-heading font-bold text-xl text-primary-800">PetPals</span>
							</motion.button>

							{/* Main Navigation Items */}
							<div className="flex gap-2">
								{mainNavItems.map((item) => (
									<NavButton key={item.path} item={item} showLabel />
								))}
							</div>

							{/* Secondary Items */}
							<div className="flex gap-2">
								{secondaryNavItems.map((item) => (
									<NavButton key={item.path} item={item} />
								))}
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Mobile Navigation */}
			<div className="lg:hidden">
				{/* Full Screen Menu */}
				<AnimatePresence>
					{isNavOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
							onClick={() => setIsNavOpen(false)}
						>
							<motion.div
								initial={{ x: '-100%' }}
								animate={{ x: 0 }}
								exit={{ x: '-100%' }}
								className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 space-y-6"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="flex items-center justify-between">
									<h2 className="text-2xl font-bold text-primary-800">Menu</h2>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsNavOpen(false)}
									>
										<ChevronDown className="w-6 h-6" />
									</Button>
								</div>

								{/* Main Navigation */}
								<div className="space-y-2">
									{[...mainNavItems, ...secondaryNavItems].map((item) => (
										<motion.button
											key={item.path}
											whileHover={{ x: 4 }}
											className={cn(
												"w-full p-3 rounded-lg flex items-center gap-3",
												isCurrentPath(item.path) ? item.color + '/10' : 'hover:bg-primary-50'
											)}
											onClick={() => handleNavigation(item)}
										>
											<div className={cn(
												"relative p-2 rounded-lg",
												item.color
											)}>
												<item.icon className="w-5 h-5 text-white" />
												<NotificationBadge
													count={getNotificationCount(item)}
													color={item.path === '/achievements' ? 'bg-amber-500' : 'bg-blue-500'}
												/>
											</div>
											<div className="flex-1 text-left">
												<div className="font-medium">{item.label}</div>
												<div className="text-sm text-gray-500">{item.description}</div>
											</div>
										</motion.button>
									))}
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Bottom Navigation Bar */}
				<motion.nav
					className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-neutral-200 z-40"
					initial={{ y: 100 }}
					animate={{ y: 0 }}
				>
					<div className="max-w-7xl mx-auto px-4 py-2">
						<div className="grid grid-cols-5 gap-2">
							{mainNavItems.map((item) => (
								<motion.button
									key={item.path}
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => handleNavigation(item)}
									className={cn(
										"relative flex flex-col items-center gap-1 p-2 rounded-lg",
										isCurrentPath(item.path) ? item.color + '/10' : 'hover:bg-primary-50'
									)}
								>
									<div className="relative">
										<item.icon className={cn(
											"w-6 h-6",
											isCurrentPath(item.path) ? 'text-' + item.color.split('-')[1] + '-500' : 'text-gray-500'
										)} />
										<NotificationBadge
											count={getNotificationCount(item)}
											color={item.path === '/achievements' ? 'bg-amber-500' : 'bg-blue-500'}
										/>
									</div>
									<span className="text-xs font-medium">{item.label}</span>
								</motion.button>
							))}
							<motion.button
								whileHover={{ y: -2 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsNavOpen(true)}
								className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-primary-50"
							>
								<Menu className="w-6 h-6 text-gray-500" />
								<span className="text-xs font-medium">More</span>
							</motion.button>
						</div>
					</div>
				</motion.nav>
			</div>
		</>
	);
}