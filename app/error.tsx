// app/error.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<motion.div
			className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<h2 className="text-2xl font-bold text-primary-800 mb-4">Oops! Something went wrong</h2>
			<p className="text-primary-600 mb-8 text-center max-w-md">
				Don&quot;t worry, your pet is safe! Let&quot;s try that again.
			</p>
			<Button onClick={reset}>Try Again</Button>
		</motion.div>
	);
}