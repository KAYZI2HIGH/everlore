"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BookOpen,
  Heart,
  Settings,
  User,
  ShoppingBag,
  HelpCircle,
  LogOut,
} from "lucide-react";
import EditProfileDialog from "./edit-profile-dialog";
import { Button } from "./ui/button";

function ProfileDropdown({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, redirectUrl: "/sign-in" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-xs w-72">
        {/* User Info Header */}
        <DropdownMenuLabel className="flex items-start gap-3 p-4">
          <img
            src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
            alt="Avatar"
            width={40}
            height={40}
            className="shrink-0 rounded-full border-2 border-emerald-400"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-slate-900">
              {session?.user?.name || "User"}
            </span>
            <span className="truncate text-xs text-slate-600">
              {session?.user?.email || "email@example.com"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Main Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            asChild
          >
            <Link href="/academy/learning">
              <BookOpen
                size={16}
                strokeWidth={2}
                className="text-emerald-600"
                aria-hidden="true"
              />
              <span>My Learnings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            asChild
          >
            <Link href="/academy/wishlist">
              <Heart
                size={16}
                strokeWidth={2}
                className="text-slate-500"
                aria-hidden="true"
              />
              <span>Wishlist</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            asChild
          >
            <Link href="/academy/cart">
              <ShoppingBag
                size={16}
                strokeWidth={2}
                className="text-slate-500"
                aria-hidden="true"
              />
              <span>Shopping Cart</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Settings Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            asChild
          >
            <EditProfileDialog>
              <Button variant="ghost" className="w-full justify-start px-2 flex gap-2">
                <User
                  size={16}
                  strokeWidth={2}
                  className="text-slate-500"
                  aria-hidden="true"
                />
                <span>Edit Profile</span>
              </Button>
          </EditProfileDialog>
          </DropdownMenuItem>
         
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
