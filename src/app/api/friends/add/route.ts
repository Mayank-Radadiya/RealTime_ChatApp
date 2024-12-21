import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth/auth.utils";
import { dbConnection } from "@/lib/database/DbConnection";
import { pusherServer } from "@/lib/utils/pusher";
import { toPusherKey } from "@/lib/utils/utils";
import { addFriendValidator } from "@/lib/validation/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate email input using addFriendValidator
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // Fetch the user ID based on the provided email
    const idToAdd = (await fetchRedis("get", `user:email:${emailToAdd}`)) as
      | string
      | null;

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const currentUserId = session.user.id;

    // Prevent adding yourself as a friend
    if (idToAdd === currentUserId) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // Check if the user has already sent a friend request
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      currentUserId
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already sent a friend request to this user", {
        status: 400,
      });
    }

    // Check if they are already friends
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${currentUserId}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 });
    }

    // Valid request: send the friend request
    await Promise.all([
      // Notify the recipient via Pusher
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
        "incoming_friend_requests",
        {
          senderId: currentUserId,
          senderEmail: session.user.email,
        }
      ),
      // Add the friend request to the Redis database
      dbConnection.sadd(
        `user:${idToAdd}:incoming_friend_requests`,
        currentUserId
      ),
    ]);

    return new Response("Friend request sent successfully.", { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    // Generic error response
    return new Response("An error occurred while processing the request.", {
      status: 500,
    });
  }
}
