"use client"
// app/loading.tsx
import { motion } from 'framer-motion';

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-neutral-50">
			<motion.div
				className="flex flex-col items-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
				<p className="mt-4 text-primary-600 font-medium">Loading...</p>
			</motion.div>
		</div>
	);
}