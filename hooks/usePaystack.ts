"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { completeCheckout, startCheckout } from "@/lib/actions/checkout.actions";

type PaystackPopCtor = typeof import("@paystack/inline-js").default;

/**
 * Pays for the signed-in user's cart. The server prices the cart and creates
 * the reference; after Paystack reports success the server verifies it again
 * before enrolling. Resolves with the purchased course ids.
 */
export function usePaystack() {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const popRef = useRef<PaystackPopCtor | null>(null);

  useEffect(() => {
    import("@paystack/inline-js")
      .then((m) => (popRef.current = m.default))
      .catch((e) => console.error("Failed to load Paystack", e));
  }, []);

  const checkout = async (): Promise<string[]> => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!key) throw new Error("Payments are not configured yet.");
    if (!popRef.current) throw new Error("Payment window is still loading. Try again.");

    setIsProcessing(true);
    try {
      const start = await startCheckout();
      if (!start.success) throw new Error(start.error);

      const reference = await new Promise<string>((resolve, reject) => {
        const pop = new popRef.current!();
        pop.newTransaction({
          key,
          email: start.email,
          amount: start.amount,
          currency: start.currency,
          ref: start.reference,
          onSuccess: (tx) => resolve(tx?.reference || start.reference),
          onCancel: () => reject(new Error("Payment cancelled")),
        });
      });

      const done = await completeCheckout(reference);
      if (!done.success) throw new Error(done.error);

      await Promise.all(
        ["cart", "account", "learning"].map((k) =>
          queryClient.invalidateQueries({ queryKey: [k] }),
        ),
      );
      return done.courseIds;
    } finally {
      setIsProcessing(false);
    }
  };

  return { checkout, isProcessing };
}
