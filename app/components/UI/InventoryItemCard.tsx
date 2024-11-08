// app/components/UI/InventoryItemCard.tsx
"use client";

import { FC } from "react";
import { motion } from "framer-motion"; // Ensure correct import from 'framer-motion'

interface InventoryItemCardProps {
	itemName: string;
	itemDescription: string;
}

const InventoryItemCard: FC<InventoryItemCardProps> = ({ itemName, itemDescription }) => (
	<motion.div
		className="bg-secondary text-white rounded-lg p-4 m-2"
		whileHover={{ scale: 1.03 }}
		whileTap={{ scale: 0.97 }}
	>
		<h3 className="text-xl font-bold">{itemName}</h3>
		<p className="text-sm">{itemDescription}</p>
	</motion.div>
);

export default InventoryItemCard;
