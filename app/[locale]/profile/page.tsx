// app/[locale]/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Settings,
	Bell,
	Volume2,
	Music,
	Palette,
	Globe,
	Trophy,
	Calendar,
	Star,
	Clock,
	Gamepad,
	Heart
} from 'lucide-react';
import {
	Card,
	CardHeader,
	CardContent,
	Button,
	Switch,
	Achievement
} from '@/components/ui';
import { useThemeStore } from '@/lib/theme/theme-store';
import { ThemePicker } from '@/components/theme/ThemePicker';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAchievementStore } from '@/store/achievementStore';
import { usePetStore } from '@/store/petStore';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ProfileTab = 'profile' | 'preferences' | 'achievements';

interface StatCardProps {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

// Available languages
const languages = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
	{ code: 'ja', name: '日本語', flag: '🇯🇵' },
] as const;

const StatCard = ({ label, value, icon, trend }: StatCardProps) => (
	<Card className="bg-primary-50/50 backdrop-blur-sm">
		<CardContent className="p-4">
			<div className="flex items-center justify-between">
				<div className="text-primary-500">{icon}</div>
				{trend && (
					<span className={cn(
						"text-sm font-medium",
						trend.isPositive ? "text-green-600" : "text-red-600"
					)}>
						{trend.isPositive ? "+" : "-"}{trend.value}%
					</span>
				)}
			</div>
			<div className="mt-2">
				<p className="text-sm text-gray-600">{label}</p>
				<p className="text-2xl font-bold">{value}</p>
			</div>
		</CardContent>
	</Card>
);

export default function ProfilePage() {
	const { data: session } = useSession();
	const { theme, setTheme } = useThemeStore();
	const { preferences, updatePreferences } = useUserPreferences();
	const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
	const router = useRouter();
	const t = useTranslations('Profile');
	const { stats, info: petInfo } = usePetStore();
	const { achievements, points: achievementPoints } = useAchievementStore();

	// Get real stats
	const getTrend = (current: number, previous: number) => {
		const diff = ((current - previous) / previous) * 100;
		return {
			value: Math.abs(Math.round(diff)),
			isPositive: diff > 0
		};
	};

	const stats = [
		{
			label: t('stats.loginStreak'),
			value: session?.user?.loginStreak || 0,
			icon: <Calendar className="w-6 h-6" />,
			trend: getTrend(session?.user?.loginStreak || 0, (session?.user?.loginStreak || 1) - 1)
		},
		{
			label: t('stats.achievementPoints'),
			value: achievementPoints,
			icon: <Trophy className="w-6 h-6" />,
			trend: getTrend(achievementPoints, achievementPoints - 50) // Example
		},
		{
			label: t('stats.petLevel'),
			value: petInfo.level,
			icon: <Star className="w-6 h-6" />,
			trend: getTrend(petInfo.level, petInfo.level - 1)
		},
		{
			label: t('stats.petHappiness'),
			value: `${stats.happiness}%`,
			icon: <Heart className="w-6 h-6" />,
		}
	];

	const tabs = [
		{ id: 'profile' as const, label: t('tabs.profile'), icon: User },
		{ id: 'preferences' as const, label: t('tabs.preferences'), icon: Settings },
		{ id: 'achievements' as const, label: t('tabs.achievements'), icon: Trophy },
	];

	const audioPreferences = [
		{
			icon: Volume2,
			label: t('preferences.soundEffects'),
			key: "soundEnabled" as keyof typeof preferences,
		},
		{
			icon: Music,
			label: t('preferences.backgroundMusic'),
			key: "musicEnabled" as keyof typeof preferences,
		},
		{
			icon: Bell,
			label: t('preferences.notifications'),
			key: "notifications" as keyof typeof preferences,
		},
	];

	// Activity History (could be stored in a store or fetched from API)
	const recentActivity = [
		{ type: 'walk', timestamp: new Date(), xp: 100 },
		{ type: 'play', timestamp: new Date(Date.now() - 3600000), xp: 50 },
		{ type: 'feed', timestamp: new Date(Date.now() - 7200000), xp: 25 },
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-100 p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Profile Header */}
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="relative">
								<div className="w-20 h-20 rounded-full overflow-hidden">
									<motion.img
										src={session?.user?.image ?? ''}
										alt={session?.user?.name ?? ''}
										className="w-full h-full object-cover"
										initial={{ scale: 0.8 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", bounce: 0.4 }}
									/>
								</div>
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
								<h1 className="text-2xl font-bold">{session?.user?.name}</h1>
								<p className="text-gray-600">{session?.user?.email}</p>
								<div className="flex items-center gap-2 mt-2">
									<Calendar className="w-4 h-4 text-primary-500" />
									<span className="text-sm text-gray-600">
										{t('profile.joinedOn', {
											date: new Date(session?.user?.createdAt ?? Date.now()).toLocaleDateString()
										})}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Navigation Tabs */}
				<div className="flex gap-2">
					{tabs.map(({ id, label, icon: Icon }) => (
						<Button
							key={id}
							variant={activeTab === id ? 'default' : 'ghost'}
							onClick={() => setActiveTab(id)}
							className="flex items-center gap-2"
						>
							<Icon className="w-4 h-4" />
							{label}
						</Button>
					))}
				</div>

				{/* Content Sections */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-6"
					>
						{activeTab === 'profile' && (
							<>
								{/* Stats Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{stats.map((stat, index) => (
										<StatCard key={index} {...stat} />
									))}
								</div>

								{/* Recent Activity */}
								<Card>
									<CardHeader>
										<h2 className="text-lg font-semibold">{t('profile.recentActivity')}</h2>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentActivity.map((activity, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
												>
													<div className="flex items-center gap-3">
														{activity.type === 'walk' && <MapPin className="w-5 h-5 text-blue-500" />}
														{activity.type === 'play' && <Gamepad className="w-5 h-5 text-green-500" />}
														{activity.type === 'feed' && <Bone className="w-5 h-5 text-amber-500" />}
														<div>
															<p className="font-medium capitalize">{activity.type}</p>
															<p className="text-sm text-gray-500">
																{new Date(activity.timestamp).toLocaleTimeString()}
															</p>
														</div>
													</div>
													<div className="flex items-center gap-1 text-primary-500">
														<Star className="w-4 h-4" />
														<span>{activity.xp} XP</span>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</>
						)}

						{activeTab === 'preferences' && (
							<Card>
								<CardContent className="p-6 space-y-6">
									{/* Theme Settings */}
									<div>
										<h2 className="text-lg font-semibold mb-4">{t('preferences.theme')}</h2>
										<ThemePicker />
									</div>

									{/* Sound & Notifications */}
									<div className="space-y-4">
										<h2 className="text-lg font-semibold">{t('preferences.soundAndNotifications')}</h2>
										<div className="space-y-4">
											{audioPreferences.map(({ icon: Icon, label, key }) => (
												<div key={key} className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Icon className="w-5 h-5" />
														<span>{label}</span>
													</div>
													<Switch
														checked={preferences[key]}
														onCheckedChange={(checked) =>
															updatePreferences({ [key]: checked })
														}
													/>
												</div>
											))}
										</div>
									</div>

									{/* Language Settings */}
									<div>
										<h2 className="text-lg font-semibold mb-4">Language</h2>
										<select
											className="w-full p-2 rounded-lg border"
											value={preferences.language}
											onChange={(e) => updatePreferences({ language: e.target.value })}
										>
											<option value="en">English</option>
											<option value="es">Español</option>
											<option value="fr">Français</option>
										</select>
									</div>
								</CardContent>
							</Card>
						)}

						{activeTab === 'achievements' && (
							<Card>
								<CardContent className="p-6">
									<h2 className="text-lg font-semibold mb-4">Achievements</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Example achievements - replace with real data */}
										<Achievement
											title="Early Bird"
											description="Log in 7 days in a row"
											icon={<Calendar className="w-5 h-5 text-primary-500" />}
											points={50}
											progress={{ current: 5, total: 7 }}
										/>
										<Achievement
											title="Pet Master"
											description="Reach level 10 with your pet"
											icon={<Trophy className="w-5 h-5 text-yellow-500" />}
											points={100}
											isComplete
										/>
										{/* Add more achievements */}
									</div>
								</CardContent>
							</Card>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}