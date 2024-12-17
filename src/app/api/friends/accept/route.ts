import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth/auth.utils";
import { dbConnection } from "@/lib/database/DbConnection";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );
    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    // console.log(hasFriendRequest);

    // const [userRaw, friendRaw] = (await Promise.all([
    //   fetchRedis("get", `user:${session.user.id}`),
    //   fetchRedis("get", `user:${idToAdd}`),
    // ])) as [string, string];

    // const user = JSON.parse(userRaw) as User;
    // const friend = JSON.parse(friendRaw) as User;

    await dbConnection.sadd(`user:${session.user.id}:friends`, idToAdd);
    await dbConnection.srem(`user:${idToAdd}:friends`, session.user.id);
    await dbConnection.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 402 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
