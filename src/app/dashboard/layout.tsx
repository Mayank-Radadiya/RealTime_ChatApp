import { Icons } from "@/components/BasicUi/incons";
import { authOptions } from "@/lib/auth/auth.utils";
import { SidebarOption } from "@/lib/types/typings";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import Image from "next/image";
import SignOutButton from "@/components/BasicUi/SignOutButton";
import FriendRequestSidebar from "@/components/BasicUi/FriendRequestSidebar";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsById } from "@/helpers/getFriendsById";
import SidebarChatList from "@/components/BasicUi/SidebarChatList";

interface layoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "FriendZone | Dashboard",
  description: "Your dashboard",
};

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsById(session.user.id);
  

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Chat List */}
            <li>
              <div>
                <SidebarChatList
                  sessionId={session.user.id}
                  friends={friends}
                />
              </div>
            </li>

            {/* Overview Section */}
            <li className="text-xs font-semibold leading-6 text-gray-400">
              Overview
            </li>

            {/* Options */}
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li key={option.id}>
                  <Link
                    href={option.href}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{option.name}</span>
                  </Link>
                </li>
              );
            })}

            {/* Friend Requests */}
            <li>
              <div>
                <FriendRequestSidebar
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
              </div>
            </li>

            {/* User Profile */}
            <li className="-mx-6 mt-auto flex items-center relative">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>
                <div className="flex flex-col">
                  <span>{session.user.name}</span>
                  <span className="text-xs text-zinc-400">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full m-1 absolute right-1 aspect-square" />
            </li>
          </ul>
        </nav>
      </div>

      <aside className="max-h-screen container py-6 md:py-4 w-full">
        {children}
      </aside>
    </div>
  );
};

export default layout;
