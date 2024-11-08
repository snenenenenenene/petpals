// app/achievements/layout.tsx
import { ReactNode } from 'react';

interface AchievementsLayoutProps {
	children: ReactNode;
}

export default function AchievementsLayout({ children }: AchievementsLayoutProps) {
	return (
		<div className="bg-neutral-50 min-h-screen">
			{children}
		</div>
	);
}