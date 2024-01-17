import { auth } from "@/auth.config";
import React from "react";
import { redirect } from "next/navigation"
import Profile from "./profile";

const page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login")
  }
  return (
    <div className="pt-32 container">
      <Profile user={session.user} />
    </div>
  );
};

export default page;
