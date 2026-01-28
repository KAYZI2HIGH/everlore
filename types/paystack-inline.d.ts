declare module "@paystack/inline-js" {
  interface Transaction {
    reference: string;
    amount: number;
    email: string;
  }

  interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    currency?: string;
    channels?: string[];
    label?: string;
    plan?: string;
    quantity?: number;
    subaccount?: string;
    bearer?: string;
    metadata?: Record<string, any>;
    onClose?: () => void;
    onSuccess?: (transaction: Transaction) => void;
    onCancel?: () => void;
  }

  class PaystackPop {
    newTransaction(config: PaystackConfig): void;
    resumeTransaction(accessCode: string): void;
  }

  export default PaystackPop;
}
