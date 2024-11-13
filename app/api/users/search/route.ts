// app/api/users/search/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401 }
      );
    }

    // Get the search query from URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return new NextResponse(
        JSON.stringify({ data: [] }), 
        { status: 200 }
      );
    }

    // Search for users
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
          { id: { not: session.user.id } }, // Exclude current user
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        onlineStatus: true,
        lastSeen: true,
        _count: {
          select: {
            friends: true,
            friendsOf: true,
            pets: true,
          },
        },
        pets: {
          select: {
            id: true,
            name: true,
            type: true,
            level: true,
          },
          take: 1,
          orderBy: {
            level: 'desc',
          },
        },
      },
      take: 10, // Limit results
    });

    // Check if users are already friends or have pending requests
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { friendId: session.user.id },
        ],
      },
    });

    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
        status: 'PENDING',
      },
    });

    // Transform the results
    const transformedUsers = users.map(user => {
      const isFriend = friendships.some(f => 
        f.userId === user.id || f.friendId === user.id
      );

      const hasPendingRequest = pendingRequests.some(r =>
        (r.senderId === user.id && r.receiverId === session.user.id) ||
        (r.senderId === session.user.id && r.receiverId === user.id)
      );

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        onlineStatus: user.onlineStatus,
        lastSeen: user.lastSeen,
        friendCount: user._count.friends + user._count.friendsOf,
        petCount: user._count.pets,
        highestPetLevel: user.pets[0]?.level || 0,
        isFriend,
        hasPendingRequest,
      };
    });

    return new NextResponse(
      JSON.stringify({ data: transformedUsers }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error searching users:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}