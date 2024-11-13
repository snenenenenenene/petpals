// app/api/friends/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            onlineStatus: true,
            lastSeen: true,
            pets: {
              select: {
                id: true,
                name: true,
                type: true,
                level: true,
              }
            }
          }
        },
        friend: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            onlineStatus: true,
            lastSeen: true,
            pets: {
              select: {
                id: true,
                name: true,
                type: true,
                level: true,
              }
            }
          }
        }
      }
    });

    // Transform the friendships to always return the other user
    const friends = friendships.map(friendship => {
      const otherUser = friendship.userId === userId ? friendship.friend : friendship.user;
      return {
        id: otherUser.id,
        name: otherUser.name,
        image: otherUser.image,
        username: otherUser.username,
        onlineStatus: otherUser.onlineStatus,
        lastSeen: otherUser.lastSeen,
        pets: otherUser.pets
      };
    });

    return new NextResponse(
      JSON.stringify({ data: friends }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching friends:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}