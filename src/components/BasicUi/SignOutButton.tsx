"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

const SignOutButton = ({ ...props }) => {
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const SignOut = async () => {
    try {
      await signOut();
      setIsSignOut(true);
    } catch (error) {
      console.error(error);
      toast.error("There was an error from signing out");
    } finally {
      setIsSignOut(false);
    }
  };
  return (
    <>
      <Button {...props} variant="ghost" onClick={SignOut}>
        {isSignOut ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </Button>
    </>
  );
};

export default SignOutButton;
