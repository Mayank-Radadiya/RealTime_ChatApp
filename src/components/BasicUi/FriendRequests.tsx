"use client";
import { Check, Frown, SendHorizontal, UserPlus, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { FC, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "../ui/Button";
import Image from "next/image";
import axios from "axios";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };
  return (
    <>
      <div className="w-full max-h-screen mt-24  flex  justify-center items-center">
        <div className="w-[50vw] h-[50vh] overflow-scroll scroll-smooth">
          <Card className="flex flex-col h-full w-full  items-center justify-center p-6 shadow-lg rounded-lg bg-white">
            {friendRequests.length === 0 ? (
              <>
                <CardTitle className="text-4xl font-semibold text-gray-700 justify-center flex gap-2 items-center">
                  Nothing to show here...
                  <Frown />
                </CardTitle>

                <CardTitle className="text-2xl font-semibold text-gray-500 mt-8 ">
                  But You Can Send Friend Request
                </CardTitle>
                <Button
                  type="button"
                  className="mt-4 flex items-center justify-center  max-w-sm bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed gap-3"
                  onClick={() => {
                    redirect("add");
                  }}
                >
                  <SendHorizontal />
                  Add New Friend
                </Button>
              </>
            ) : (
              <>
                <div className="w-full h-full">
                  <CardHeader className="flex justify-start w-full ">
                    <CardTitle className="text-2xl font-semibold text-gray-700  ">
                      Friend Request
                    </CardTitle>
                  </CardHeader>
                  <div className="relative">
                    {friendRequests.map((request) => (
                      <div
                        key={request.senderId}
                        className="flex gap-4 items-center ml-4"
                      >
                        <Card className="w-full shadow-md mb-2">
                          <li className="-mx-6 mt-auto flex items-center px-4 relative ">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                              <div className="relative h-10 w-10 bg-gray-50">
                                <Image
                                  fill
                                  referrerPolicy="no-referrer"
                                  className="rounded-full"
                                  src={request.senderImage || ""}
                                  alt="profile picture"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className="text-sm text-zinc-500"
                                  aria-hidden="true"
                                >
                                  {request.senderEmail}
                                </span>
                              </div>
                              <div className="absolute right-10 gap-3 flex items-center">
                                <Button
                                  onClick={() => acceptFriend(request.senderId)}
                                  variant="ghost"
                                  className="border w-20 px-4 py-2 rounded-md shadow-md  hover:shadow-lg hover:bg-green-400 hover:text-white group transition duration-300 ease-in-out"
                                >
                                  <span className="group-hover:hidden">
                                    Accept
                                  </span>
                                  <Check className="hidden group-hover:inline-block" />
                                </Button>

                                {/* Reject Button */}
                                <Button
                                  onClick={() => denyFriend(request.senderId)}
                                  variant="ghost"
                                  className="border w-20 px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-red-400 hover:text-white group transition duration-300 ease-in-out"
                                >
                                  <span className="group-hover:hidden">
                                    Reject
                                  </span>
                                  <X className="hidden group-hover:inline-block" />
                                </Button>
                              </div>
                            </div>
                          </li>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default FriendRequests;
