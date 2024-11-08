// app/global-error.tsx
'use client';

import { Button } from '@/components/ui/Button';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body>
				<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50">
					<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
						<h2 className="text-2xl font-bold text-primary-800 mb-4">
							Something went wrong!
						</h2>
						<p className="text-gray-600 mb-6">
							We're having trouble loading the page. Please try again.
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
			</body>
		</html>
	);
}