// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { 
  Menu, 
  User, 
  LogOut, 
  Coins,
  ChevronDown 
} from 'lucide-react';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

export function Navbar() {
  const { data: session, status } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-neutral-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <h1 className="font-heading font-bold text-xl text-primary-800">
              PetPals
            </h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
            ) : session ? (
              <>
                {/* User's Coins */}
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">
                    {session.user?.coins || 0}
                  </span>
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <Avatar
                      src={session.user?.image}
                      fallback={session.user?.name?.[0] || '?'}
                      size="sm"
                    />
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1"
                      >
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="font-medium truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-sm text-neutral-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => signOut()}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn('google')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}