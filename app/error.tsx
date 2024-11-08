// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
	error: Error;
	reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
	useEffect(() => {
		if (error instanceof Error) {
			console.error('Application error:', error.message);
		} else {
			console.error('Unknown error occurred');
		}
	}, [error]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
				<div className="mb-4 text-4xl">🐕</div>
				<h2 className="text-2xl font-bold text-primary-800 mb-4">
					Oops! Something went wrong
				</h2>
				<p className="text-gray-600 mb-6">
					{error instanceof Error
						? error.message
						: "Don't worry, your pet is safe! Let's try that again."}
				</p>
				<div className="space-y-4">
					<Button
						onClick={() => reset()}
						className="w-full"
					>
						Try Again
					</Button>
					<Button
						variant="outline"
						onClick={() => window.location.href = '/'}
						className="w-full"
					>
						Return Home
					</Button>
				</div>
			</div>
		</div>
	);
}

