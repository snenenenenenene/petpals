// components/ui/Toast.tsx
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
	id: string;
	title: string;
	description?: string;
	type?: 'default' | 'success' | 'error' | 'warning';
	duration?: number;
	onClose: (id: string) => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
	({ id, title, description, type = 'default', duration = 5000, onClose }, ref) => {
		React.useEffect(() => {
			const timer = setTimeout(() => {
				onClose(id);
			}, duration);

			return () => clearTimeout(timer);
		}, [duration, id, onClose]);

		const variants = {
			initial: { opacity: 0, y: 50, scale: 0.3 },
			animate: { opacity: 1, y: 0, scale: 1 },
			exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
		};

		return (
			<motion.div
				ref={ref}
				className={cn(
					'rounded-lg p-4 shadow-lg',
					'bg-white dark:bg-gray-800',
					'border-l-4',
					type === 'success' && 'border-green-500',
					type === 'error' && 'border-red-500',
					type === 'warning' && 'border-yellow-500',
					type === 'default' && 'border-blue-500'
				)}
				variants={variants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
						{description && (
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
						)}
					</div>
					<button
						onClick={() => onClose(id)}
						className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
					>
						<X size={16} />
					</button>
				</div>
			</motion.div>
		);
	}
);

Toast.displayName = 'Toast';