// components/ui/ui.tsx
'use client';

import { cn } from '@/lib/utils';
import { Loader2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { useSounds } from '@/hooks/useSounds';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
	size?: 'sm' | 'md' | 'lg';
	isLoading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
	variant = 'primary',
	size = 'md',
	isLoading = false,
	leftIcon,
	rightIcon,
	className,
	children,
	onClick,
	...props
}, ref) => {
	const { playSound } = useSounds();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		playSound('button');
		onClick?.(e);
	};

	const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

	const variants = {
		primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
		secondary: "bg-accent-sage text-primary-800 hover:bg-accent-sage/90 focus-visible:ring-accent-sage",
		outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
		ghost: "text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
		link: "text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500"
	};

	const sizes = {
		sm: "h-8 px-3 text-sm",
		md: "h-10 px-4",
		lg: "h-12 px-6 text-lg"
	};

	return (
		<motion.button
			ref={ref}
			className={cn(
				baseStyles,
				variants[variant],
				sizes[size],
				isLoading && "opacity-70",
				className
			)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			disabled={props.disabled || isLoading}
			onClick={handleClick}
			{...props}
		>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Loading...
				</>
			) : (
				<>
					{leftIcon && <span className="mr-2">{leftIcon}</span>}
					{children}
					{rightIcon && <span className="ml-2">{rightIcon}</span>}
				</>
			)}
		</motion.button>
	);
});

Button.displayName = 'Button';

// Toast System
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
		const { playSound } = useSounds();

		React.useEffect(() => {
			playSound('notification');
			const timer = setTimeout(() => onClose(id), duration);
			return () => clearTimeout(timer);
		}, [duration, id, onClose]);

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
				initial={{ opacity: 0, y: 50, scale: 0.3 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			>
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<h3 className="font-medium text-gray-900 dark:text-white">
							{title}
						</h3>
						{description && (
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								{description}
							</p>
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

export function ToastContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence mode="popLayout">{children}</AnimatePresence>
		</div>
	);
}

// Achievement Component with Sound
export interface AchievementProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	points?: number;
	progress?: {
		current: number;
		total: number;
	};
	rewards?: Array<{
		type: 'coins' | 'items' | 'experience';
		amount: number;
	}>;
	isComplete?: boolean;
	onComplete?: () => void;
}

export function Achievement({
	title,
	description,
	icon,
	points,
	progress,
	rewards,
	isComplete,
	onComplete
}: AchievementProps) {
	const { playSound } = useSounds();
	const [hasPlayedSound, setHasPlayedSound] = React.useState(false);

	React.useEffect(() => {
		if (isComplete && !hasPlayedSound) {
			playSound('notification');
			setHasPlayedSound(true);
		}
	}, [isComplete, hasPlayedSound]);

	return (
		<motion.div
			className={cn(
				"relative p-4 rounded-lg bg-white shadow-sm",
				isComplete && "bg-primary-50"
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			{/* Achievement content remains the same */}
		</motion.div>
	);
}

// Interactive Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
	className,
	interactive = false,
	onClick,
	children,
	...props
}, ref) => {
	const { playSound } = useSounds();

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (interactive) {
			playSound('button');
			onClick?.(e);
		}
	};

	return (
		<motion.div
			ref={ref}
			className={cn(
				"bg-white rounded-lg shadow-sm",
				interactive && "cursor-pointer hover:shadow-md",
				className
			)}
			whileHover={interactive ? { scale: 1.02 } : undefined}
			whileTap={interactive ? { scale: 0.98 } : undefined}
			onClick={handleClick}
			{...props}
		>
			{children}
		</motion.div>
	);
});

Card.displayName = 'Card';