// app/api/friends/requests/[id]/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const requestId = params.id;
    const { status } = await req.json();

    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    if (!request) {
      return new NextResponse(JSON.stringify({ error: "Request not found" }), {
        status: 404,
      });
    }

    if (request.receiverId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (status === "ACCEPT") {
      // Create friendship and update request status in transaction
      const [updatedRequest, friendship] = await prisma.$transaction([
        prisma.friendRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED" },
        }),
        prisma.friendship.create({
          data: {
            userId: request.senderId,
            friendId: session.user.id,
          },
        }),
        // Create notification for the sender
        prisma.notification.create({
          data: {
            userId: request.senderId,
            type: "FRIEND_REQUEST_ACCEPTED",
            title: "Friend Request Accepted",
            message: `${session.user.name} accepted your friend request!`,
            data: {
              friendId: session.user.id,
              friendName: session.user.name,
            },
          },
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          request: updatedRequest,
          friendship,
        })
      );
    }

    if (status === "REJECT") {
      const updatedRequest = await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });

      return new NextResponse(JSON.stringify({ request: updatedRequest }));
    }

    return new NextResponse(JSON.stringify({ error: "Invalid status" }), {
      status: 400,
    });
  } catch (error) {
    console.error("Error handling friend request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
