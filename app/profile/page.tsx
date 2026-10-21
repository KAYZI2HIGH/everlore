import { redirect } from "next/navigation";
import { BadgeCheck, UserPen } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/actions/sanity.actions";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { AcademyProfileTabs } from "@/components/profile/AcademyProfileTabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  const session = await auth();
  const user = await getCurrentUser();

  if (!session?.user?.id || !user) {
    redirect("/sign-in");
  }

  const name = user.name || session.user.name || "Everlore learner";
  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-6xl px-4 py-25 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="flex flex-col gap-6 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-background shadow-sm ring-1 ring-border">
              <AvatarImage src={user.image || session.user.image || undefined} alt={name} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                {name}
                <BadgeCheck className="size-5 text-academy-accent" aria-label="Verified profile" />
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.email || session.user.email}
              </p>
              <p className="mt-1 text-sm font-medium text-academy-accent">
                Everlore learner
              </p>
            </div>
          </div>

          <EditProfileDialog>
            <Button variant="outline" size="sm" className="w-fit rounded-full">
              <UserPen className="mr-2 size-4 text-muted-foreground" />
              Edit Profile
            </Button>
          </EditProfileDialog>
        </section>

        <AcademyProfileTabs />
      </div>
    </main>
  );
};

export default ProfilePage;
