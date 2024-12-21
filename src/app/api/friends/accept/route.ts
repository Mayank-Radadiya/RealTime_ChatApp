import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth/auth.utils";
import { dbConnection } from "@/lib/database/DbConnection";
import { pusherServer } from "@/lib/utils/pusher";
import { toPusherKey } from "@/lib/utils/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request payload
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if already friends
      const isAlreadyFriends = await fetchRedis(
        "sismember",
        `user:${session.user.id}:friends`,
        idToAdd
      );
    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }

    // Check for incoming friend request
  const hasFriendRequest = await fetchRedis(
    "sismember",
    `user:${session.user.id}:incoming_friend_requests`,
    idToAdd
  );
    
    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    // Fetch user and friend data
    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    if (!userRaw || !friendRaw) {
      return new Response("User not found", { status: 404 });
    }
   const user = JSON.parse(userRaw) as User;
   const friend = JSON.parse(friendRaw) as User;

   // notify added user

   await Promise.all([
     pusherServer.trigger(
       toPusherKey(`user:${idToAdd}:friends`),
       "new_friend",
       user
     ),
     pusherServer.trigger(
       toPusherKey(`user:${session.user.id}:friends`),
       "new_friend",
       friend
     ),
     dbConnection.sadd(`user:${session.user.id}:friends`, idToAdd),
     dbConnection.sadd(`user:${idToAdd}:friends`, session.user.id),
     dbConnection.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
   ]);

    return new Response("OK");
  } catch (error) {
    console.error("Error in POST handler:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    // Catch all other errors
    return new Response("Internal Server Error", { status: 500 });
  }
}
