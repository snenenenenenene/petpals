// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';

export const useSocket = () => {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const socketInitializer = async () => {
      try {
        await fetch('/api/socketio');

        if (!socket.current) {
          socket.current = io({
            path: '/api/socketio',
            auth: {
              userId: session.user.id
            }
          });

          socket.current.on('connect', () => {
            console.log('Socket connected');
            addToast({
              message: 'Connected to real-time server',
              type: 'success'
            });
          });

          socket.current.on('disconnect', () => {
            addToast({
              message: 'Lost connection to server',
              type: 'warning'
            });
          });

          socket.current.on('error', (error) => {
            console.error('Socket error:', error);
            addToast({
              message: 'Connection error. Please try again.',
              type: 'error'
            });
          });
        }
      } catch (error) {
        console.error('Socket initialization error:', error);
        addToast({
          message: 'Failed to connect to server',
          type: 'error'
        });
      }
    };

    socketInitializer();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [session?.user?.id, addToast]);

  return socket.current;
};