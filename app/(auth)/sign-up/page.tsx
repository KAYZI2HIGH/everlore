import type { Metadata } from "next";
import { SignUp } from "@/components/sign-up";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignUp callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />;
}
