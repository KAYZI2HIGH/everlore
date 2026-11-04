import type { Metadata } from "next";
import { SignIn } from "@/components/sign-in";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignIn callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />;
}
