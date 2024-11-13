/* eslint-disable @typescript-eslint/no-explicit-any */
// components/friends/FriendsOverlay.tsx
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { FriendRequest, useFriends } from '@/hooks/useFriends';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Check,
  ChevronLeft,
  Search,
  Star,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

type FriendsView = 'list' | 'requests' | 'search' | 'profile';

interface FriendsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// components/friends/FriendsOverlay.tsx
import { useRef } from 'react';

type FriendsView = 'list' | 'requests' | 'search' | 'profile';


interface SearchResult {
  id: string;
  name: string;
  username: string;
  image: string;
  onlineStatus: string;
  lastSeen: string;
  friendCount: number;
  highestPetLevel: number;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

interface FriendsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsOverlay({ isOpen, onClose }: FriendsOverlayProps) {
  const [view, setView] = useState<FriendsView>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const {
    friends,
    pendingRequests,
    isLoading,
    sendFriendRequest,
    handleFriendRequest,
    searchUsers,
  } = useFriends();

  // Handle search with proper debouncing
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length >= 3) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 5000); // 5 second delay
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, searchUsers]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Friends Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-xl z-50 rounded-l-3xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <div className="flex items-center gap-3">
                {view !== 'list' && (
                  <button
                    onClick={() => setView('list')}
                    className="rounded-xl p-2 hover:bg-primary-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary-500" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-primary-800">
                  {view === 'list' && 'Friends'}
                  {view === 'requests' && 'Friend Requests'}
                  {view === 'search' && 'Find Friends'}
                  {view === 'profile' && 'Profile'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {view === 'list' && (
                  <>
                    <button
                      onClick={() => setView('search')}
                      className="rounded-xl p-2 hover:bg-primary-50 transition-colors"
                    >
                      <Search className="w-5 h-5 text-primary-500" />
                    </button>
                    {pendingRequests.length > 0 && (
                      <button
                        onClick={() => setView('requests')}
                        className="rounded-xl p-2 hover:bg-primary-50 transition-colors relative"
                      >
                        <UserPlus className="w-5 h-5 text-primary-500" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {pendingRequests.length}
                        </span>
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 hover:bg-primary-50 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
              {view === 'list' && (
                <FriendsList
                  friends={friends}
                  onFriendSelect={(friend) => {
                    setSelectedUser(friend);
                    setView('profile');
                  }}
                  onViewRequests={() => setView('requests')}
                  requestCount={pendingRequests.length}
                />
              )}

              {view === 'search' && (
                <SearchView
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  results={searchResults}
                  isSearching={isSearching}
                  onSendRequest={sendFriendRequest}
                  onViewProfile={(user) => {
                    setSelectedUser(user);
                    setView('profile');
                  }}
                  existingFriends={friends}
                />
              )}

              {view === 'requests' && (
                <RequestsView
                  requests={pendingRequests}
                  onAccept={(id) => handleFriendRequest(id, 'ACCEPT')}
                  onReject={(id) => handleFriendRequest(id, 'REJECT')}
                  onViewProfile={(user) => {
                    setSelectedUser(user);
                    setView('profile');
                  }}
                />
              )}

              {view === 'profile' && selectedUser && (
                <UserProfile
                  user={selectedUser}
                  isFriend={friends.some(f => f.id === selectedUser.id)}
                  onSendRequest={() => sendFriendRequest(selectedUser.username)}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// components/friends/FriendsOverlay.tsx - SearchView Component
interface SearchResult {
  id: string;
  name: string;
  username: string;
  image: string;
  onlineStatus: string;
  lastSeen: string;
  friendCount: number;
  highestPetLevel: number;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

function SearchView({
  searchQuery,
  setSearchQuery,
  results,
  isSearching,
  onSendRequest,
  onViewProfile,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  onSendRequest: (username: string) => Promise<void>;
  onViewProfile: (user: SearchResult) => void;
}) {
  const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const toast = useToast();

  useEffect(() => {
    if (results.length > 0) {
      if (initialLoad) {
        setDisplayedResults(results);
        setInitialLoad(false);
      } else {
        // Update existing results and add new ones
        const updatedResults = [...displayedResults];
        results.forEach(newResult => {
          const existingIndex = updatedResults.findIndex(r => r.id === newResult.id);
          if (existingIndex === -1) {
            updatedResults.push(newResult);
          } else {
            updatedResults[existingIndex] = newResult;
          }
        });
        setDisplayedResults(updatedResults);
      }
    } else if (searchQuery.length < 3) {
      setDisplayedResults([]);
      setInitialLoad(true);
    }
  }, [results, searchQuery]);

  const handleSendRequest = async (user: SearchResult) => {
    if (pendingRequests.has(user.id)) return;

    try {
      setPendingRequests(prev => new Set(prev).add(user.id));
      await onSendRequest(user.username);

      // Update the displayed results to show pending state
      setDisplayedResults(prev =>
        prev.map(result =>
          result.id === user.id
            ? { ...result, hasPendingRequest: true }
            : result
        )
      );

      toast.addToast({
        message: `Friend request sent to ${user.name}!`,
        type: 'success'
      });
    } catch (error) {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });

      toast.addToast({
        message: 'Failed to send friend request',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pl-12 rounded-2xl border-2 border-primary-100 focus:border-primary-500 transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery.length >= 3 && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {displayedResults.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  layout: { duration: 0.3 },
                  opacity: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl p-4 border-2 border-primary-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.image}
                      alt={user.name}
                      size="md"
                    />
                    <div>
                      <h3 className="font-medium text-primary-800">{user.name}</h3>
                      <p className="text-sm text-primary-600">@{user.username}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-primary-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {user.friendCount} friends
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Level {user.highestPetLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(user)}
                    >
                      View
                    </Button>
                    {!user.isFriend && !user.hasPendingRequest && (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user)}
                        disabled={pendingRequests.has(user.id)}
                      >
                        {pendingRequests.has(user.id) ? (
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                          />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add
                          </>
                        )}
                      </Button>
                    )}
                    {(user.hasPendingRequest || pendingRequests.has(user.id)) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled
                      >
                        Pending
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {displayedResults.length === 0 && !isSearching && (
            <EmptyState
              message="No users found"
              icon={Search}
            />
          )}
        </div>
      )}

      {searchQuery.length < 3 && (
        <EmptyState
          message="Type at least 3 characters to search..."
          icon={Search}
        />
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({
  message,
  icon: Icon = Users
}: {
  message: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="text-center py-8">
      <Icon className="w-12 h-12 mx-auto text-primary-300 mb-4" />
      <p className="text-primary-600">{message}</p>
    </div>
  );
}

function FriendsList({
  friends,
  onFriendSelect,
  onViewRequests,
  requestCount
}: {
  friends: any[];
  onFriendSelect: (friend: any) => void;
  onViewRequests: () => void;
  requestCount: number;
}) {
  const onlineFriends = friends.filter(f => f.onlineStatus === 'ONLINE');
  const offlineFriends = friends.filter(f => f.onlineStatus !== 'ONLINE');

  return (
    <div className="space-y-6">
      {/* Friend Requests Button */}
      {requestCount > 0 && (
        <motion.button
          className="w-full bg-primary-50 rounded-2xl p-4 flex items-center justify-between group hover:bg-primary-100 transition-colors"
          onClick={onViewRequests}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-primary-500">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-primary-800">Friend Requests</h3>
              <p className="text-sm text-primary-600">
                {requestCount} pending request{requestCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.button>
      )}

      {/* Online Friends */}
      {onlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-primary-600 mb-3">Online</h3>
          <div className="space-y-2">
            {onlineFriends.map((friend) => (
              <FriendListItem
                key={friend.id}
                friend={friend}
                onClick={() => onFriendSelect(friend)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Offline Friends */}
      {offlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-primary-600 mb-3">Offline</h3>
          <div className="space-y-2">
            {offlineFriends.map((friend) => (
              <FriendListItem
                key={friend.id}
                friend={friend}
                onClick={() => onFriendSelect(friend)}
              />
            ))}
          </div>
        </div>
      )}

      {friends.length === 0 && (
        <EmptyState
          message="No friends yet. Start adding friends to play together!"
          icon={Users}
        />
      )}
    </div>
  );
}

function FriendListItem({
  friend,
  onClick
}: {
  friend: any;
  onClick: () => void;
}) {
  return (
    <motion.button
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <Avatar
          src={friend.image}
          alt={friend.name}
          size="md"
        />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
          friend.onlineStatus === 'ONLINE' ? 'bg-green-500' :
            friend.onlineStatus === 'PLAYING' ? 'bg-yellow-500' : 'bg-gray-400'
        )} />
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-medium text-primary-800">{friend.name}</h3>
        <p className="text-sm text-primary-600">
          {friend.onlineStatus === 'ONLINE' ? 'Online' :
            friend.onlineStatus === 'PLAYING' ? 'Playing with pet' :
              `Last seen ${formatTimeAgo(new Date(friend.lastSeen))}`}
        </p>
      </div>
    </motion.button>
  );
}

function RequestsView({
  requests,
  onAccept,
  onReject,
  onViewProfile
}: {
  requests: FriendRequest[];
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onViewProfile: (user: any) => void;
}) {
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());
  const toast = useToast();

  const handleAction = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    if (pendingActions.has(requestId)) return;

    setPendingActions(prev => new Set(prev).add(requestId));
    try {
      if (action === 'ACCEPT') {
        await onAccept(requestId);
        toast.addToast({
          message: 'Friend request accepted!',
          type: 'success'
        });
      } else {
        await onReject(requestId);
        toast.addToast({
          message: 'Friend request declined',
          type: 'info'
        });
      }
    } catch (error) {
      toast.addToast({
        message: `Failed to ${action.toLowerCase()} friend request`,
        type: 'error'
      });
    } finally {
      setPendingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      {requests.length > 0 ? (
        <AnimatePresence mode="popLayout" initial={false}>
          {requests.map((request) => (
            <motion.div
              key={request.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { duration: 0.2 }
              }}
              className="bg-white rounded-2xl p-4 border-2 border-primary-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={request.sender.image}
                    alt={request.sender.name}
                    size="md"
                  />
                  <div>
                    <h3 className="font-medium text-primary-800">{request.sender.name}</h3>
                    <p className="text-sm text-primary-600">@{request.sender.username}</p>
                    <p className="text-xs text-primary-500 mt-1">
                      Sent {formatTimeAgo(new Date(request.createdAt))}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile(request.sender)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(request.id, 'REJECT')}
                    disabled={pendingActions.has(request.id)}
                  >
                    {pendingActions.has(request.id) ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(request.id, 'ACCEPT')}
                    disabled={pendingActions.has(request.id)}
                  >
                    {pendingActions.has(request.id) ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <EmptyState
          message="No pending requests"
          icon={UserPlus}
        />
      )}
    </div>
  );
}

function UserProfile({
  user,
  isFriend,
  onSendRequest
}: {
  user: any;
  isFriend: boolean;
  onSendRequest: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="relative bg-primary-50 rounded-2xl p-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                src={user.image}
                alt={user.name}
                size="xl"
              />
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                user.onlineStatus === 'ONLINE' ? 'bg-green-500' :
                  user.onlineStatus === 'PLAYING' ? 'bg-yellow-500' : 'bg-gray-400'
              )} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800">{user.name}</h3>
              <p className="text-sm text-primary-600">@{user.username}</p>
              <p className="text-sm text-primary-500 mt-1">
                {user.onlineStatus === 'ONLINE' ? 'Online now' :
                  user.onlineStatus === 'PLAYING' ? 'Playing with pet' :
                    `Last seen ${formatTimeAgo(new Date(user.lastSeen))}`}
              </p>
            </div>
          </div>

          {!isFriend && (
            <Button
              className="w-full mt-4"
              onClick={onSendRequest}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          )}
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-5">
          <Users className="w-40 h-40" />
        </div>
      </motion.div>

      {/* User's Pets */}
      {user.pets && user.pets.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-primary-800 mb-4">Pets</h3>
          <div className="grid grid-cols-2 gap-4">
            {user.pets.map((pet: any) => (
              <motion.div
                key={pet.id}
                className="bg-white rounded-2xl p-4 border-2 border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="relative w-full aspect-square rounded-xl bg-primary-50 mb-3 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🐕
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-primary-800">
                    Lv. {pet.level}
                  </div>
                </div>
                <h4 className="font-medium text-primary-800">{pet.name}</h4>
                <p className="text-sm text-primary-600 capitalize">{pet.type}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Activity}
          label="Pet Level"
          value={user.pets?.[0]?.level || 0}
          subText="Highest level pet"
        />
        <StatCard
          icon={Star}
          label="Friends"
          value={user.friendCount || 0}
          subText="Total friends"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subText
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  subText: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-primary-100">
      <Icon className="w-5 h-5 text-primary-500 mb-2" />
      <div>
        <p className="text-sm text-primary-600">{label}</p>
        <p className="text-2xl font-bold text-primary-800">{value}</p>
        <p className="text-xs text-primary-500">{subText}</p>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default FriendsOverlay;