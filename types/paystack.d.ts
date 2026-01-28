declare global {
  interface Window {
    PaystackPop: {
      setup(config: {
        key: string;
        email: string;
        amount: number;
        onClose?: () => void;
        onSuccess?: (transaction: { reference: string }) => void;
      }): { openIframe(): void };
    };
  }
}

export {};
