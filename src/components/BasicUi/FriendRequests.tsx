"use client";
import { Check, Frown, SendHorizontal, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "../ui/Button";

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
  return (
    <>
      <div className="w-full max-h-screen mt-24  flex  justify-center items-center">
        <div className="w-[50vw] h-[50vh] ">
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
                  type="submit"
                  className="mt-4 flex items-center justify-center  max-w-sm bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed gap-3"
                  onClick={() => {}}
                >
                  <SendHorizontal />
                  Send
                </Button>
              </>
            ) : (
              <>
                <div className="w-full h-full">
                  <CardHeader className="flex justify-start w-full ">
                    <CardTitle className="text-2xl font-semibold text-gray-700 mt-8 ">
                      Friend Request
                    </CardTitle>
                  </CardHeader>
                  <div className="">
                    {friendRequests.map((request) => (
                      <div
                        key={request.senderId}
                        className="flex gap-4 items-center"
                      >
                        <UserPlus className="text-black" />
                        <p className="font-medium text-lg">
                          {request.senderEmail}
                        </p>
                        <button
                          //   onClick={() => acceptFriend(request.senderId)}
                          aria-label="accept friend"
                          className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                        >
                          <Check className="font-semibold text-white w-3/4 h-3/4" />
                        </button>

                        <button
                          //   onClick={() => denyFriend(request.senderId)}
                          aria-label="deny friend"
                          className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                        >
                          <X className="font-semibold text-white w-3/4 h-3/4" />
                        </button>
                        
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
