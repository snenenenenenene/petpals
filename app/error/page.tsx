// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-primary-800 mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "Something went wrong during authentication. Please try again."}
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}