// hooks/useFriends.ts
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export interface Friend {
  id: string;
  name: string;
  username: string;
  image: string;
  onlineStatus: "ONLINE" | "OFFLINE" | "PLAYING";
  lastSeen: Date;
  pets: {
    id: string;
    name: string;
    type: string;
    level: number;
    image?: string;
  }[];
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
}

export interface Invitation {
  id: string;
  type: "WALK" | "PLAY" | "TRAINING";
  senderId: string;
  sender: {
    name: string;
    image: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  expiresAt: Date;
  createdAt: Date;
}

export function useFriends() {
  const { data: session } = useSession();
  const toast = useToast();
  const socket = useSocket();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // hooks/useFriends.ts (update the fetch handling)
  // hooks/useFriends.ts
  const fetchFriends = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/friends");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setFriends(result.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err instanceof Error ? err.message : "Failed to load friends");
      toast.addToast({
        message: "Failed to load friends",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  const fetchInvites = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/friends/invites");
      if (!response.ok) throw new Error("Failed to fetch invitations");
      const { data } = await response.json();
      setPendingInvites(data);
    } catch (err) {
      setError("Failed to load invitations");
      console.error("Error fetching invitations:", err);
      toast.addToast({
        message: "Failed to load invitations",
        type: "error",
      });
    }
  }, [session?.user?.id, toast]);

  // Fetch friend requests
  const fetchRequests = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/friends/requests");
      if (!response.ok) throw new Error("Failed to fetch friend requests");
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      setError("Failed to load friend requests");
      console.error("Error fetching friend requests:", err);
      toast.addToast({
        message: "Failed to load friend requests",
        type: "error",
      });
    }
  }, [session?.user?.id, toast]);

  // Initial data fetch
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      Promise.all([fetchFriends(), fetchRequests(), fetchInvites()]).finally(
        () => setIsLoading(false)
      );
    }
  }, [session?.user?.id, fetchFriends, fetchRequests, fetchInvites]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for friend status changes
    socket.on("friendOnlineStatus", ({ userId, status }) => {
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === userId ? { ...friend, onlineStatus: status } : friend
        )
      );
    });

    // Listen for new friend requests
    socket.on("friendRequest", (request: FriendRequest) => {
      setPendingRequests((prev) => [...prev, request]);
      toast.addToast({
        message: `New friend request from ${request.sender.name}!`,
        type: "info",
      });
    });

    // Listen for game invites
    socket.on("gameInvite", (invitation: Invitation) => {
      setPendingInvites((prev) => [...prev, invitation]);
      toast.addToast({
        message: `${
          invitation.sender.name
        } invited you to ${invitation.type.toLowerCase()}!`,
        type: "info",
      });
    });

    // Listen for friend request responses
    socket.on("friendRequestResponse", ({ requestId, status }) => {
      if (status === "ACCEPTED") {
        fetchFriends(); // Refresh friends list
        toast.addToast({
          message: "Friend request accepted!",
          type: "success",
        });
      }
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    });

    return () => {
      socket.off("friendOnlineStatus");
      socket.off("friendRequest");
      socket.off("gameInvite");
      socket.off("friendRequestResponse");
    };
  }, [socket, toast, fetchFriends]);

  // Send friend request
  // hooks/useFriends.ts
  const sendFriendRequest = async (username: string) => {
    try {
      const response = await fetch("/api/friends/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }

      await response.json();
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  // Handle friend request
  const handleFriendRequest = async (
    requestId: string,
    action: "ACCEPT" | "REJECT"
  ) => {
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} friend request`);
      }

      const data = await response.json();

      // Update local state
      if (action === "ACCEPT") {
        setFriends((prev) => [...prev, data.friendship]);
      }

      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );

      return data;
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing friend request:`, error);
      throw error;
    }
  };

  // Remove friend
  const removeFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove friend");

      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      toast.addToast({
        message: "Friend removed",
        type: "success",
      });
    } catch (err) {
      toast.addToast({
        message: "Failed to remove friend",
        type: "error",
      });
    }
  };

  // Send activity invitation
  const sendInvitation = async (friendId: string, type: Invitation["type"]) => {
    if (!socket) {
      toast.addToast({
        message: "Connection error. Please try again.",
        type: "error",
      });
      return;
    }

    try {
      socket.emit("sendGameInvite", { friendId, type });
      toast.addToast({
        message: `${type} invitation sent!`,
        type: "success",
      });
    } catch (err) {
      toast.addToast({
        message: "Failed to send invitation",
        type: "error",
      });
    }
  };

  // Handle invitation
  const handleInvitation = async (
    inviteId: string,
    action: "ACCEPT" | "REJECT"
  ) => {
    try {
      const response = await fetch(`/api/friends/invites/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) throw new Error("Failed to handle invitation");

      setPendingInvites((prev) =>
        prev.filter((invite) => invite.id !== inviteId)
      );

      if (action === "ACCEPT") {
        toast.addToast({
          message: "Invitation accepted!",
          type: "success",
        });
      }
    } catch (err) {
      toast.addToast({
        message: "Failed to handle invitation",
        type: "error",
      });
    }
  };

  // Update activity status
  const updateActivityStatus = (status: "ONLINE" | "PLAYING" | "OFFLINE") => {
    if (socket) {
      socket.emit("updateActivity", { status });
    }
  };

  // Search friends
  const searchUsers = async (query: string) => {
    try {
      if (query.length < 3) return [];

      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search users");

      const { data } = await response.json();
      return data;
    } catch (err) {
      toast.addToast({
        message: "Failed to search users",
        type: "error",
      });
      return [];
    }
  };

  return {
    friends,
    pendingRequests,
    pendingInvites,
    isLoading,
    error,
    sendFriendRequest,
    handleFriendRequest,
    removeFriend,
    sendInvitation,
    handleInvitation,
    searchUsers,
    updateActivityStatus,
    refresh: {
      friends: fetchFriends,
      requests: fetchRequests,
      invites: fetchInvites,
    },
  };
}

export default useFriends;
