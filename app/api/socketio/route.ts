// app/api/socketio/route.ts
import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
      const io = new Server({
        path: '/api/socketio',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      // Store IO instance in global to reuse across requests
      (global as any).io = io;

      return new Response('Socket.IO server initialized', {
        status: 200,
      });
    }

    return new Response('Socket.IO server already running', {
      status: 200,
    });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return new Response('Failed to initialize socket', { status: 500 });
  }
}