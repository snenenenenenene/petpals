// app/components/UI/Achievement.tsx
"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface AchievementProps {
	title: string;
	description: string;
}

const Achievement: FC<AchievementProps> = ({ title, description }) => (
	<motion.div
		className="bg-accent p-4 rounded-lg text-white m-2"
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.4 }}
	>
		<h3 className="text-lg font-semibold">{title}</h3>
		<p className="text-sm">{description}</p>
	</motion.div>
);

export default Achievement;
