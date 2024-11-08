// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User, Settings, Bell, Volume2, Music,
	Palette, Globe, Trophy, Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useTheme } from '@/hooks/useTheme';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
	const { data: session } = useSession();
	const { theme, setTheme } = useTheme();
	const { preferences, updatePreferences } = useUserPreferences();
	const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'achievements'>('profile');

	if (!session) return null;

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'preferences', label: 'Preferences', icon: Settings },
		{ id: 'achievements', label: 'Achievements', icon: Trophy },
	] as const;

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Profile Header */}
				<Card className="mb-6">
					<div className="p-6">
						<div className="flex items-center gap-4">
							<div className="relative">
								<img
									src={session.user?.image ?? ''}
									alt={session.user?.name ?? ''}
									className="w-20 h-20 rounded-full"
								/>
								<div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full px-2 py-1 text-xs font-medium">
									Lv. {session.user?.level ?? 1}
								</div>
							</div>
							<div>
								<h1 className="text-2xl font-bold">{session.user?.name}</h1>
								<p className="text-gray-600">{session.user?.email}</p>
								<div className="flex items-center gap-2 mt-2">
									<Calendar className="w-4 h-4 text-primary-500" />
									<span className="text-sm text-gray-600">
										Joined {new Date(session.user?.createdAt ?? '').toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					</div>
				</Card>

				{/* Navigation Tabs */}
				<div className="flex gap-2 mb-6">
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
					>
						{activeTab === 'profile' && (
							<Card>
								<div className="p-6">
									<h2 className="text-lg font-semibold mb-4">Stats</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="p-4 bg-primary-50 rounded-lg">
											<div className="text-sm text-gray-600">Login Streak</div>
											<div className="text-2xl font-bold">{session.user?.loginStreak} days</div>
										</div>
										<div className="p-4 bg-primary-50 rounded-lg">
											<div className="text-sm text-gray-600">Total Pets</div>
											<div className="text-2xl font-bold">{session.user?.pets?.length ?? 0}</div>
										</div>
										{/* Add more stats as needed */}
									</div>
								</div>
							</Card>
						)}

						{activeTab === 'preferences' && (
							<Card>
								<div className="p-6 space-y-6">
									<div>
										<h2 className="text-lg font-semibold mb-4">Theme</h2>
										<div className="grid grid-cols-3 gap-4">
											{['default', 'dark', 'light'].map((themeOption) => (
												<button
													key={themeOption}
													className={cn(
														"p-4 rounded-lg border-2",
														theme === themeOption
															? "border-primary-500"
															: "border-transparent"
													)}
													onClick={() => setTheme(themeOption)}
												>
													<div className="h-20 rounded bg-gradient-to-b from-primary-100 to-primary-200" />
													<div className="mt-2 text-center capitalize">{themeOption}</div>
												</button>
											))}
										</div>
									</div>

									<div className="space-y-4">
										<h2 className="text-lg font-semibold">Sound & Notifications</h2>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Volume2 className="w-5 h-5" />
													<span>Sound Effects</span>
												</div>
												<Switch
													checked={preferences.soundEnabled}
													onCheckedChange={(checked) =>
														updatePreferences({ soundEnabled: checked })
													}
												/>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Music className="w-5 h-5" />
													<span>Background Music</span>
												</div>
												<Switch
													checked={preferences.musicEnabled}
													onCheckedChange={(checked) =>
														updatePreferences({ musicEnabled: checked })
													}
												/>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Bell className="w-5 h-5" />
													<span>Notifications</span>
												</div>
												<Switch
													checked={preferences.notifications}
													onCheckedChange={(checked) =>
														updatePreferences({ notifications: checked })
													}
												/>
											</div>
										</div>
									</div>

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
											{/* Add more languages as needed */}
										</select>
									</div>
								</div>
							</Card>
						)}

						{activeTab === 'achievements' && (
							<Card>
								<div className="p-6">
									<h2 className="text-lg font-semibold mb-4">Achievements</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Add achievements list here */}
									</div>
								</div>
							</Card>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}