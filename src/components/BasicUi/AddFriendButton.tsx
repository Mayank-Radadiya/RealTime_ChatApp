"use client";
import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validation/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const emailValidation = addFriendValidator.parse({ email });

      axios.post("/api/friends/add", {
        email: emailValidation,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Something went wrong." });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <form>
        <Card className="flex flex-col h-[50vh] w-[90vw] max-w-lg items-center justify-center p-6 shadow-lg rounded-lg bg-white">
          <CardHeader>
            <div className="w-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail-plus"
              >
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="M19 16v6" />
                <path d="M16 19h6" />
              </svg>
            </div>
            <CardTitle className="text-4xl font-semibold text-gray-800">
              Friend Request
            </CardTitle>
          </CardHeader>

          <CardHeader className="text-center">
            <div className="flex gap-4">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Add Friend by E-Mail
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Chat with your friends
            </CardDescription>
          </CardHeader>

          <Input placeholder="example@gmail.com" />
          <div className="flex w-full justify-start items-start">
            <Button
              type="button"
              className="mt-4 flex items-center justify-center  max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed gap-3"
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-send-horizontal"
              >
                <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                <path d="M6 12h16" />
              </svg>
              Send
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddFriendButton;
