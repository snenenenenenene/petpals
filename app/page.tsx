// app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-800 mb-4">
          Welcome to PetPals
        </h1>
        <p className="text-lg text-primary-600 mb-8 max-w-md mx-auto">
          Your virtual pet companion awaits! Start your journey of friendship and care.
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="text-lg px-8 py-4"
        >
          Start Playing
        </Button>
      </motion.div>
    </div>
  );
}