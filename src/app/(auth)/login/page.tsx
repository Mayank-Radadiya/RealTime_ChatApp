"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

const Page = ({}) => {
  const [IsLoading, SetIsLoading] = useState<boolean>(false);

  async function loginWithGoogle() {
    SetIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong with your login.");
      console.error(error);
    } finally {
      SetIsLoading(false);
    }
  }
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Card className="flex flex-col h-[50vh] w-[90vw] max-w-lg items-center justify-center p-6 shadow-lg rounded-lg bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            focusable="true"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-user"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to ChatApp
            </CardDescription>
          </CardHeader>
          <Button
            isLoading={IsLoading}
            type="button"
            className="mt-4 flex items-center justify-center w-full max-w-sm bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={loginWithGoogle}
          >
            {IsLoading ? null : (
              <svg
                className="mr-2 h-5 w-5"
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            Google
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Page;
