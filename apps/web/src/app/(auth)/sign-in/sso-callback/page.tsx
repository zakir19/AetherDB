"use client";

import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  useEffect(() => {
    sessionStorage.setItem("aether-skip-intro", "1");
  }, []);

  return <AuthenticateWithRedirectCallback />;
}
