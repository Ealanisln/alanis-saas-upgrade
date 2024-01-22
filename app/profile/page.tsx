import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation"
import Profile from "./profile";
import Pricing from "@/components/Pricing";

const page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login")
  }
  return (
    <div className="pt-32 container">
      <Profile user={session.user} />
      <Pricing />
    </div>
  );
};

export default page;
