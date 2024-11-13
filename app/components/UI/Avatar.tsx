// components/ui/Avatar.tsx
import React from 'react';
import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	src?: string;
	alt?: string;
	fallback?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	status?: 'online' | 'offline' | 'away' | 'busy';
	shape?: 'circle' | 'square';
	border?: boolean;
	hoverable?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
	src,
	alt,
	fallback,
	size = 'md',
	status,
	shape = 'circle',
	border = false,
	hoverable = false,
	className,
	...props
}, ref) => {
	const sizes = {
		xs: "w-6 h-6 text-xs",
		sm: "w-8 h-8 text-sm",
		md: "w-12 h-12 text-base",
		lg: "w-16 h-16 text-lg",
		xl: "w-24 h-24 text-xl"
	};

	const statusColors = {
		online: "bg-green-500",
		offline: "bg-neutral-300",
		away: "bg-yellow-500",
		busy: "bg-red-500"
	};

	const [imageError, setImageError] = React.useState(!src);

	return (
		<motion.div
			ref={ref}
			className={cn(
				"relative inline-flex items-center justify-center",
				sizes[size],
				shape === 'circle' ? 'rounded-full' : 'rounded-lg',
				border && 'border-2 border-white dark:border-neutral-800',
				hoverable && 'cursor-pointer transition-transform hover:scale-105',
				className
			)}
			whileHover={hoverable ? { scale: 1.05 } : undefined}
			{...props}
		>
			<AnimatePresence mode="wait">
				{!imageError && src ? (
					<motion.img
						key="avatar-image"
						src={src}
						alt={alt || 'Avatar'}
						onError={() => setImageError(true)}
						className={cn(
							"object-cover",
							shape === 'circle' ? 'rounded-full' : 'rounded-lg',
							sizes[size]
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>
				) : (
					<motion.div
						key="avatar-fallback"
						className={cn(
							"flex items-center justify-center",
							sizes[size],
							shape === 'circle' ? 'rounded-full' : 'rounded-lg',
							'bg-primary-100 text-primary-800'
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						{fallback ? (
							<span className="font-medium">
								{fallback?.charAt(0).toUpperCase()}
							</span>
						) : (
							<User className={cn(
								size === 'xs' ? 'h-3 w-3' :
									size === 'sm' ? 'h-4 w-4' :
										size === 'md' ? 'h-6 w-6' :
											size === 'lg' ? 'h-8 w-8' :
												'h-12 w-12'
							)} />
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{status && (
				<motion.span
					className={cn(
						"absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-neutral-800",
						statusColors[status],
						size === 'xs' ? 'h-1.5 w-1.5' :
							size === 'sm' ? 'h-2 w-2' :
								size === 'md' ? 'h-3 w-3' :
									size === 'lg' ? 'h-4 w-4' :
										'h-5 w-5'
					)}
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.1 }}
				/>
			)}
		</motion.div>
	);
});

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		children: React.ReactNode;
		max?: number;
		spacing?: 'tight' | 'normal' | 'loose';
	}
>(({
	children,
	max,
	spacing = 'normal',
	className,
	...props
}, ref) => {
	const childrenArray = React.Children.toArray(children);
	const excess = max ? childrenArray.slice(max) : [];
	const displayed = max ? childrenArray.slice(0, max) : childrenArray;

	const spacingValues = {
		tight: '-mr-2',
		normal: '-mr-3',
		loose: '-mr-4'
	};

	return (
		<div
			ref={ref}
			className={cn("flex items-center", className)}
			{...props}
		>
			{displayed.map((child, index) => (
				<div key={index} className={spacingValues[spacing]}>
					{child}
				</div>
			))}
			{excess.length > 0 && (
				<div className={spacingValues[spacing]}>
					<Avatar>
						<span>+{excess.length}</span>
					</Avatar>
				</div>
			)}
		</div>
	);
});

AvatarGroup.displayName = 'AvatarGroup';