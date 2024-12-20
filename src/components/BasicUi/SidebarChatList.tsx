"use client";

import { chatHrefConstructor } from "@/lib/utils/utils";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";

interface SidebarChatListProps {
  sessionId: string;
  friends: User[];
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
  const pathname = usePathname();

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev: Message[]) =>
        prev.filter((msg: Message) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend: any) => {
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
