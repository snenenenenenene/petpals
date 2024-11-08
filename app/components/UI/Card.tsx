// app/components/UI/Card.tsx
"use client";

import { FC, ReactNode } from "react";
import { motion } from "framer-motion"; // Ensure motion is imported from framer-motion

interface CardProps {
	children: ReactNode;
}

const Card: FC<CardProps> = ({ children }) => (
	<motion.div
		className="bg-white shadow-md rounded-lg p-4 m-2"
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.3 }}
	>
		{children}
	</motion.div>
);

export default Card;
