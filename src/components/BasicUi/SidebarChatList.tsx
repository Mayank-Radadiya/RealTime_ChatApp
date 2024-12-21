"use client";

import { chatHrefConstructor, toPusherKey } from "@/lib/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { pusherClient } from "@/lib/utils/pusher";
import UnseenChatToast from "./UnseenChatToast";
import toast from "react-hot-toast";

interface SidebarChatListProps {
  sessionId: string;
  friends: User[];
}
interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
  const pathname = usePathname();
 const router = useRouter();
 
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      console.log("received new user", newFriend);
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      // should be notified
      toast.custom((t: any) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev: Message[]) =>
        prev.filter((msg: Message) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (unseenMsg) => unseenMsg.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <Card className="w-full mb-1 border-none">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                  {/* Profile Photo */}
                  <div className="relative h-10 w-10 bg-gray-50 flex-shrink-0">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full object-cover"
                      src={friend.image || ""}
                      alt="profile picture"
                    />
                  </div>
                  {/* User Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-sm text-zinc-700 truncate"
                      aria-hidden="true"
                      title={friend.email}
                    >
                      {friend.email}
                    </span>
                  </div>
                  {/* Unseen Messages */}
                  {unseenMessagesCount > 0 && (
                    <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                      {unseenMessagesCount}
                    </div>
                  )}
                </div>
              </Card>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
