"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { usePaystack } from "@/hooks/usePaystack";
import { categoryLabel, formatPrice } from "@/lib/config";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, isLoading, removeFromCart, isRemovingFromCart } = useCart();
  const { checkout, isProcessing } = usePaystack();
  const subtotal = cartItems.reduce((sum, c) => sum + c.price, 0);

  const pay = async () => {
    try {
      const ids = await checkout();
      toast.success(`Payment confirmed — you're enrolled in ${ids.length} course${ids.length === 1 ? "" : "s"}!`);
      router.push("/academy/learning");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      if (msg === "Payment cancelled") toast.message("Payment cancelled");
      else toast.error(msg);
    }
  };

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Checkout</p>
      <h1 className="mt-3 text-4xl font-extrabold">Your cart</h1>

      {isLoading ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      ) : cartItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <Image src="/empty-cart.svg" alt="" width={200} height={150} />
          <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Find a course that fits your goals and add it here to check out.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link href="/academy">
              Browse courses <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="space-y-4">
            {cartItems.map((c) => (
              <li key={c._id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:gap-5">
                <Link
                  href={`/academy/courses/${c.slug.current}`}
                  className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44"
                >
                  <Image src={c.image} alt="" fill sizes="176px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-xs font-medium text-muted-foreground">{categoryLabel(c.category)}</p>
                  <Link href={`/academy/courses/${c.slug.current}`} className="mt-0.5 line-clamp-2 font-bold hover:text-brand">
                    {c.title}
                  </Link>
                  {c.instructor && <p className="mt-1 text-sm text-muted-foreground">by {c.instructor}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <p className="text-lg font-extrabold">{formatPrice(c.price)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        removeFromCart(c._id, {
                          onSuccess: () => toast.success("Removed from cart"),
                          onError: (e) => toast.error(e.message),
                        })
                      }
                      disabled={isRemovingFromCart || isProcessing}
                    >
                      <Trash2 /> Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {cartItems.length} course{cartItems.length === 1 ? "" : "s"}
                </dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            <Button size="lg" className="mt-6 h-12 w-full rounded-full text-base" onClick={pay} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="animate-spin" /> : <Lock />} Pay {formatPrice(subtotal)}
            </Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-success" /> Secured by Paystack · cards, transfer, USSD
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
