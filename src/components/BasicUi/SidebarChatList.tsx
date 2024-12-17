"use client";

import { chatHrefConstructor } from "@/lib/utils/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";

interface SidebarChatListProps {
  sessionId: string;
  friends: User[];
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
//   const router = useRouter();
  const pathname = usePathname();

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
   const [activeChats, setActiveChats] = useState<User[]>(friends);

   console.log(friends);
   
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev: any) => {
        return prev.filter((msg: any) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend : any) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <Card className="w-full mb-1 border-none ">
                <li className="-mx-6 mt-auto flex items-center px-4 relative ">
                  <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                    <div className="relative h-10 w-10 bg-gray-50">
                      <Image
                        fill
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        src={friend.image || ""}
                        alt="profile picture"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-sm text-zinc-700"
                        aria-hidden="true"
                      >
                        {friend.email}
                      </span>
                    </div>
                    {unseenMessagesCount > 0 ? (
                      <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                        {unseenMessagesCount}
                      </div>
                    ) : null}
                  </div>
                </li>
              </Card>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
