import { SignInForm } from "@/components/SignInForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Box } from "@chakra-ui/react";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <Box w={"100%"} h={"100%"} alignContent={"center"}>
      <SignInForm />
    </Box>
  );
}
