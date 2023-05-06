interface RazorpaySuccesshandlerArgs {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler?: (args: RazorpaySuccesshandlerArgs) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
  };
  notes?: {};
  theme?: {
    hide_topbar?: boolean;
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  timeout?: number;
  remember_customer?: boolean;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: boolean;
  };
  config?: {
    display: {
      language: "en" | "ben" | "hi" | "mar" | "guj" | "tam" | "tel";
    };
  };
}
