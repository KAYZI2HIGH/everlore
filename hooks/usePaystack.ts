import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  enrollUserInCourses,
  verifyPaystackPayment,
} from "@/lib/actions/sanity.actions";
import { userQueryKeys } from "@/lib/query-keys";

interface PaymentConfig {
  email: string;
  amount: number;
  courseIds: string[];
}

export const usePaystack = (queryClientOverride?: any) => {
  const defaultQueryClient = useQueryClient();
  const queryClient = queryClientOverride || defaultQueryClient;
  const [isProcessing, setIsProcessing] = useState(false);
  const [PaystackPop, setPaystackPop] = useState<any>(null);

  // Lazy load Paystack SDK on client side only
  useEffect(() => {
    const loadPaystack = async () => {
      try {
        const PaystackModule = await import("@paystack/inline-js");
        setPaystackPop(() => PaystackModule.default);
      } catch (error) {
        console.error("❌ Failed to load Paystack SDK:", error);
      }
    };
    loadPaystack();
  }, []);

  const handlePaymentSuccess = async (
    reference: string,
    courseIds: string[],
  ): Promise<void> => {
    try {
      console.log(
        "🎯 Processing successful payment with reference:",
        reference,
      );

      // Verify payment on backend
      console.log("🔍 Verifying payment with Paystack...");
      const verifyResult = await verifyPaystackPayment(reference);

      console.log("✓ Verification result:", verifyResult);

      if (!verifyResult?.success) {
        const error = verifyResult?.error || "Payment verification failed";
        console.error("❌ Verification failed:", error);
        throw new Error(error);
      }

      console.log("✓ Payment verified successfully!");
      console.log("📝 Enrolling user in courses:", courseIds);

      // Enroll user in courses
      const enrollResult = await enrollUserInCourses(courseIds);

      console.log("✓ Enrollment result:", enrollResult);

      if (!enrollResult?.success) {
        const error = enrollResult?.error || "Enrollment failed";
        console.error("❌ Enrollment failed:", error);
        throw new Error(error);
      }

      console.log("✓ User enrolled successfully!");

      // Refetch relevant queries after successful enrollment
      console.log("🔄 Refetching queries...");
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.current() });
      console.log("✓ Queries refetched successfully!");

      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error in handlePaymentSuccess:", error);
      return Promise.reject(error);
    }
  };

  const initializePayment = async (config: PaymentConfig): Promise<void> => {
    const { email, amount, courseIds } = config;

    if (!email || amount <= 0 || courseIds.length === 0) {
      throw new Error("Invalid payment configuration");
    }

    if (!PaystackPop) {
      throw new Error("Paystack SDK not loaded yet. Please try again.");
    }

    setIsProcessing(true);

    try {
      console.log("💳 Setting up Paystack payment with SDK:", {
        email,
        amount: Math.round(amount * 100),
        courseIds,
      });

      // Generate a unique reference
      const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return new Promise<void>((resolve, reject) => {
        try {
          const paystack = new PaystackPop();

          console.log("🖼️ Opening Paystack payment modal");

          paystack.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
            email,
            amount: Math.round(amount * 100),
            ref: reference,
            onSuccess: async (transaction: any) => {
              console.log("✓ Paystack onSuccess callback fired!");
              console.log("✓ Transaction:", transaction);

              const txRef = transaction?.reference || reference;
              console.log("📝 Transaction reference:", txRef);

              try {
                await handlePaymentSuccess(txRef, courseIds);
                console.log("✓ Payment flow completed successfully!");
                setIsProcessing(false);
                resolve();
              } catch (error) {
                console.error("❌ Payment flow failed:", error);
                setIsProcessing(false);
                reject(error);
              }
            },
            onCancel: () => {
              console.log("⚠️ Payment cancelled by user");
              setIsProcessing(false);
              reject(new Error("Payment cancelled"));
            },
          });
        } catch (error) {
          console.error("❌ Error setting up Paystack:", error);
          setIsProcessing(false);
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    } catch (error) {
      console.error("❌ Error in initializePayment:", error);
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    initializePayment,
    isProcessing,
  };
};
