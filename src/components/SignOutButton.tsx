"use client";

import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button
      colorPalette="brand"
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/login" })}
      spinnerPlacement="start"
    >
      Sign Out
    </Button>
  );
}
