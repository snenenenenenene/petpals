// data/activities.ts
import {
	Heart,
	Bone,
	Bath,
	Navigation2 as WalkIcon,
	BookOpen,
	Gamepad,
	type LucideIcon
} from 'lucide-react';

import { WalkGame } from '@/components/interactions/minigames/WalkGame';

export interface Activity {
	id: string;
	name: string;
	Icon: LucideIcon;
	description: string;
	energyCost: number;
	cooldown: number;
	color: string;
	rewards: {
		happiness: number;
		experience: number;
		coins?: number;
	};
	minigameComponent?: React.ComponentType<{ onComplete: (success: boolean) => void }>;
}

export const activities: Activity[] = [
	{
		id: 'feed',
		name: 'Feed Pet',
		Icon: Bone,
		description: 'Give your pet some delicious food',
		energyCost: 5,
		cooldown: 180,
		color: 'text-amber-500',
		rewards: {
			happiness: 15,
			experience: 5,
			coins: 2
		}
	},
	{
		id: 'play',
		name: 'Play Time',
		Icon: Gamepad,
		description: 'Play fun games with your pet',
		energyCost: 15,
		cooldown: 30,
		color: 'text-green-500',
		rewards: {
			happiness: 25,
			experience: 10,
			coins: 5
		},
		minigameComponent: <></>
	},
	{
		id: 'walk',
		name: 'Go Walking',
		Icon: WalkIcon,
		description: 'Take your pet for a refreshing walk',
		energyCost: 20,
		cooldown: 120,
		color: 'text-blue-500',
		rewards: {
			happiness: 30,
			experience: 15,
			coins: 8
		},
		minigameComponent: WalkGame
	},
	{
		id: 'groom',
		name: 'Grooming',
		Icon: Bath,
		description: 'Keep your pet clean and healthy',
		energyCost: 10,
		cooldown: 240,
		color: 'text-purple-500',
		rewards: {
			happiness: 20,
			experience: 8,
			coins: 4
		},
		minigameComponent: <></>
	},
	{
		id: 'train',
		name: 'Training',
		Icon: BookOpen,
		description: 'Teach your pet new tricks',
		energyCost: 25,
		cooldown: 360,
		color: 'text-indigo-500',
		rewards: {
			happiness: 15,
			experience: 20,
			coins: 10
		},
		minigameComponent: <></>
	},
	{
		id: 'pet',
		name: 'Pet & Care',
		Icon: Heart,
		description: 'Show your pet some love',
		energyCost: 5,
		cooldown: 15,
		color: 'text-red-500',
		rewards: {
			happiness: 10,
			experience: 3,
			coins: 1
		}
	}
];

export const getActivity = (id: string): Activity | undefined => {
	return activities.find(activity => activity.id === id);
};

export const getActivityCooldown = (id: string): number => {
	const activity = getActivity(id);
	return activity ? activity.cooldown : 0;
};