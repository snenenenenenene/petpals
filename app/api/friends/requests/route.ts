// app/api/friends/requests/route.ts
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
  
	  const requests = await prisma.friendRequest.findMany({
		where: {
		  receiverId: session.user.id,
		  status: 'PENDING'
		},
		include: {
		  sender: {
			select: {
			  id: true,
			  name: true,
			  image: true,
			  username: true
			}
		  }
		}
	  });
  
	  return NextResponse.json(requests);
	} catch (error) {
	  console.error('Error fetching friend requests:', error);
	  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
  }
  
  export async function POST(req: Request) {
	try {
	  const session = await getServerSession(authOptions);
	  if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	  }
  
	  const { username } = await req.json();
  
	  // Find user by username
	  const receiver = await prisma.user.findUnique({
		where: { username }
	  });
  
	  if (!receiver) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	  }
  
	  // Check if a friendship already exists
	  const existingFriendship = await prisma.friendship.findFirst({
		where: {
		  OR: [
			{
			  userId: session.user.id,
			  friendId: receiver.id
			},
			{
			  userId: receiver.id,
			  friendId: session.user.id
			}
		  ]
		}
	  });
  
	  if (existingFriendship) {
		return NextResponse.json({ error: 'Already friends' }, { status: 400 });
	  }
  
	  // Check if request already exists
	  const existingRequest = await prisma.friendRequest.findFirst({
		where: {
		  OR: [
			{
			  senderId: session.user.id,
			  receiverId: receiver.id,
			  status: 'PENDING'
			},
			{
			  senderId: receiver.id,
			  receiverId: session.user.id,
			  status: 'PENDING'
			}
		  ]
		}
	  });
  
	  if (existingRequest) {
		return NextResponse.json({ error: 'Friend request already exists' }, { status: 400 });
	  }
  
	  const request = await prisma.friendRequest.create({
		data: {
		  senderId: session.user.id,
		  receiverId: receiver.id,
		  status: 'PENDING'
		},
		include: {
		  sender: {
			select: {
			  name: true,
			  image: true,
			  username: true
			}
		  }
		}
	  });
  
	  return NextResponse.json(request);
	} catch (error) {
	  console.error('Error sending friend request:', error);
	  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
  }
  
  // app/api/friends/requests/[id]/route.ts
  export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
  ) {
	try {
	  const session = await getServerSession(authOptions);
	  if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	  }
  
	  const { status } = await req.json();
	  const requestId = params.id;
  
	  const request = await prisma.friendRequest.findUnique({
		where: { id: requestId },
		include: { sender: true }
	  });
  
	  if (!request) {
		return NextResponse.json({ error: 'Request not found' }, { status: 404 });
	  }
  
	  if (request.receiverId !== session.user.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	  }
  
	  if (status === 'ACCEPTED') {
		// Create friendship and update request status in transaction
		const [updatedRequest, friendship] = await prisma.$transaction([
		  prisma.friendRequest.update({
			where: { id: requestId },
			data: { status }
		  }),
		  prisma.friendship.create({
			data: {
			  userId: request.senderId,
			  friendId: session.user.id
			}
		  })
		]);
  
		return NextResponse.json({ request: updatedRequest, friendship });
	  }
  
	  // If rejected, just update the request status
	  const updatedRequest = await prisma.friendRequest.update({
		where: { id: requestId },
		data: { status }
	  });
  
	  return NextResponse.json({ request: updatedRequest });
	} catch (error) {
	  console.error('Error handling friend request:', error);
	  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
  }