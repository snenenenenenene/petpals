// app/[locale]/adventure/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map,
  MapPin,
  Navigation2,
  Package,
  Star,
  Gift,
  Dog,
  Home,
  PawPrint,
  Clock
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
  type: 'park' | 'beach' | 'downtown' | 'trail';
  distance: number; // in minutes
  description: string;
  difficulty: 1 | 2 | 3;
  rewards: {
    minItems: number;
    maxItems: number;
    specialChance: number;
  };
  unlockLevel?: number;
}

interface WalkingEvent {
  type: 'item' | 'dog' | 'special';
  data: any;
  position: { x: number; y: number };
}

const locations: Location[] = [
  {
    id: 'central-park',
    name: 'Central Park',
    type: 'park',
    distance: 15,
    description: 'A peaceful park with plenty of grass and trees',
    difficulty: 1,
    rewards: {
      minItems: 3,
      maxItems: 6,
      specialChance: 0.1
    }
  },
  {
    id: 'sunny-beach',
    name: 'Sunny Beach',
    type: 'beach',
    distance: 20,
    description: 'A beautiful beach with shells to collect',
    difficulty: 2,
    rewards: {
      minItems: 4,
      maxItems: 8,
      specialChance: 0.15
    },
    unlockLevel: 3
  },
  {
    id: 'city-square',
    name: 'City Square',
    type: 'downtown',
    distance: 25,
    description: 'Busy streets with lots of friendly people',
    difficulty: 2,
    rewards: {
      minItems: 5,
      maxItems: 10,
      specialChance: 0.2
    },
    unlockLevel: 5
  },
  {
    id: 'forest-trail',
    name: 'Forest Trail',
    type: 'trail',
    distance: 30,
    description: 'A challenging trail with rare discoveries',
    difficulty: 3,
    rewards: {
      minItems: 6,
      maxItems: 12,
      specialChance: 0.25
    },
    unlockLevel: 8
  }
];

export default function AdventurePage() {
  const [mode, setMode] = useState<'select' | 'walking'>('select');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [walkProgress, setWalkProgress] = useState(0);
  const [events, setEvents] = useState<WalkingEvent[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const petLevel = 5; // This would come from your pet store

  // For the walking simulation
  const walkingRef = useRef<HTMLDivElement>(null);
  const [petPosition, setPetPosition] = useState({ x: 50, y: 50 });
  const [isWalking, setIsWalking] = useState(false);

  const startWalk = (location: Location) => {
    setSelectedLocation(location);
    setMode('walking');
    setWalkProgress(0);
    setEvents(generateEvents(location));
    setIsWalking(true);
  };

  const generateEvents = (location: Location) => {
    const numItems = Math.floor(
      Math.random() * 
      (location.rewards.maxItems - location.rewards.minItems + 1) + 
      location.rewards.minItems
    );

    return Array(numItems).fill(null).map(() => ({
      type: Math.random() < location.rewards.specialChance ? 'special' : 'item',
      data: generateReward(),
      position: {
        x: Math.random() * 80 + 10, // Keep away from edges
        y: Math.random() * 80 + 10
      }
    }));
  };

  const generateReward = () => {
    // This would be more complex in practice
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Mystery Item',
      rarity: Math.random() < 0.2 ? 'rare' : 'common'
    };
  };

  useEffect(() => {
    if (isWalking && selectedLocation) {
      const interval = setInterval(() => {
        setWalkProgress(prev => {
          const next = prev + (100 / (selectedLocation.distance * 60));
          return next >= 100 ? 100 : next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isWalking, selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-100">
      <AnimatePresence mode="wait">
        {mode === 'select' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Location Selection */}
              <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Choose Your Adventure</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((location) => (
                    <motion.div
                      key={location.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={cn(
                          "p-4 cursor-pointer",
                          location.unlockLevel && petLevel < location.unlockLevel
                            ? "opacity-50"
                            : "hover:shadow-md"
                        )}
                        onClick={() => {
                          if (!location.unlockLevel || petLevel >= location.unlockLevel) {
                            startWalk(location);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{location.name}</h3>
                            <p className="text-sm text-gray-600">{location.description}</p>
                          </div>
                          {location.unlockLevel && petLevel < location.unlockLevel ? (
                            <div className="bg-gray-100 rounded-full px-2 py-1 text-xs">
                              Unlocks at level {location.unlockLevel}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{location.distance} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: location.difficulty }).map((_, i) => (
                              <PawPrint
                                key={i}
                                className="w-4 h-4 text-primary-500"
                              />
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <WalkingMode
            location={selectedLocation!}
            progress={walkProgress}
            events={events}
            collected={collected}
            setCollected={setCollected}
            onEnd={() => setMode('select')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface WalkingModeProps {
  location: Location;
  progress: number;
  events: WalkingEvent[];
  collected: string[];
  setCollected: (ids: string[]) => void;
  onEnd: () => void;
}

function WalkingMode({
  location,
  progress,
  events,
  collected,
  setCollected,
  onEnd
}: WalkingModeProps) {
  const [petPosition, setPetPosition] = useState({ x: 50, y: 50 });
  const walkAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!walkAreaRef.current) return;
    
    const rect = walkAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Smooth pet movement
    setPetPosition(prev => ({
      x: prev.x + (x - prev.x) * 0.1,
      y: prev.y + (y - prev.y) * 0.1
    }));
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Walking Area */}
      <div
        ref={walkAreaRef}
        className="absolute inset-0 bg-green-100"
        onMouseMove={handleMouseMove}
      >
        {/* Pet */}
        <motion.div
          className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center"
          style={{
            left: `${petPosition.x}%`,
            top: `${petPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            x: petPosition.x,
            y: petPosition.y,
            rotate: Math.atan2(
              petPosition.y - 50,
              petPosition.x - 50
            ) * (180 / Math.PI)
          }}
        >
          🐕
        </motion.div>

        {/* Events */}
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.data.id}
              className={cn(
                "absolute w-12 h-12 rounded-full flex items-center justify-center",
                "bg-white shadow-lg cursor-pointer",
                collected.includes(event.data.id) && "opacity-50 pointer-events-none"
              )}
              style={{
                left: `${event.position.x}%`,
                top: `${event.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => {
                if (!collected.includes(event.data.id)) {
                  setCollected([...collected, event.data.id]);
                }
              }}
            >
              {event.type === 'special' ? '🎁' : '✨'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEnd}
                >
                  <Home className="w-4 h-4 mr-2" />
                  End Walk
                </Button>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{location.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>{collected.length} / {events.length} items found</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}