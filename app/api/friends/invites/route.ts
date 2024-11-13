// app/api/friends/invites/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invites = await prisma.invitation.findMany({
      where: {
        receiverId: session.user.id,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ data: invites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { friendId, type } = await request.json();

    const invite = await prisma.invitation.create({
      data: {
        senderId: session.user.id,
        receiverId: friendId,
        type,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ data: invite });
  } catch (error) {
    console.error('Error creating invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
