// app/[locale]/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useRouter } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('Home')

  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center z-10"
      >
        {/* Pet Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-8 text-7xl animate-bounce-slight"
        >
          🐕
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-heading font-bold text-primary-800 mb-4"
        >
          {t('title')}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-primary-600 mb-8 max-w-md mx-auto"
        >
          {t('description')}
        </motion.p>

        {/* Button */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => router.push('/dashboard')}
            className="text-lg px-8 py-4 hover:scale-105 transition-transform"
          >
            {t('startButton')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left decoration */}
        <motion.div
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-20 left-[10%] text-4xl animate-float"
        >
          🦴
        </motion.div>

        {/* Top right decoration */}
        <motion.div
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
          className="absolute top-40 right-[15%] text-4xl animate-float"
          style={{ animationDelay: '1s' }}
        >
          🎾
        </motion.div>

        {/* Bottom left decoration */}
        <motion.div
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          className="absolute bottom-[20%] left-[20%] text-4xl animate-float"
          style={{ animationDelay: '0.5s' }}
        >
          ❤️
        </motion.div>

        {/* Bottom right decoration */}
        <motion.div
          variants={decorationVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.4 }}
          className="absolute bottom-[30%] right-[10%] text-4xl animate-float"
          style={{ animationDelay: '1.5s' }}
        >
          🐾
        </motion.div>
      </div>

      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-primary-100/30 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-accent-sage/20 blur-3xl" />
      </div>
    </div>
  );
}