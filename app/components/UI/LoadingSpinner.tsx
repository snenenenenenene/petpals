// components/ui/LoadingSpinner.tsx
export function LoadingSpinner({ className }: { className?: string }) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className={cn(
				"w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin",
				className
			)} />
			<p className="mt-4 text-primary-600 animate-pulse">
				Loading...
			</p>
		</div>
	);
}