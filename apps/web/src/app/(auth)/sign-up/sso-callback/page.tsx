"use client";

import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // Before Clerk processes the callback and redirects to "/",
  // set the skip-intro flag so the preloader doesn't replay.
  useEffect(() => {
    sessionStorage.setItem("aether-skip-intro", "1");
  }, []);

  return <AuthenticateWithRedirectCallback />;
}
