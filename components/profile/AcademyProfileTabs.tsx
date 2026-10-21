"use client";

import { BookOpen, Heart, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MyLearningPage from "@/app/academy/learning/page";
import WishlistPage from "@/app/academy/wishlist/page";
import CartPage from "@/app/academy/cart/page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const tabItems = [
  { value: "my-learning", label: "My Learning", icon: BookOpen },
  { value: "wishlist", label: "Wishlist", icon: Heart },
  { value: "shopping-cart", label: "Shopping Cart", icon: ShoppingCart },
];

export function AcademyProfileTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab =
    tabItems.find((tab) => searchParams.has(tab.value))?.value ||
    "my-learning";

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?${value}`);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="mb-3 h-auto min-h-10! w-full min-w-0 justify-start gap-4 overflow-x-auto overflow-y-hidden rounded-none border-b border-border bg-transparent p-0 text-foreground">
        {tabItems.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="relative shrink-0! whitespace-nowrap rounded-none px-4 py-2 text-center text-xs sm:px-6 sm:text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:border-b-3 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none!"
          >
            <Icon
              className="mr-2 size-4 opacity-70"
              aria-hidden="true"
            />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="my-learning" className="mt-4">
        <MyLearningPage />
      </TabsContent>
      <TabsContent value="wishlist" className="mt-4">
        <WishlistPage />
      </TabsContent>
      <TabsContent value="shopping-cart" className="mt-4">
        <CartPage />
      </TabsContent>
    </Tabs>
  );
}
