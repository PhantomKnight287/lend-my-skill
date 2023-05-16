export type RazorpayWebhookResponse = {
  entity: string;
  account_id: string;
  event: string;
  contains: Array<string>;
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id: any;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status: any;
        captured: boolean;
        description: any;
        card_id: string;
        card: {
          id: string;
          entity: string;
          name: string;
          last4: string;
          network: string;
          type: string;
          issuer: any;
          international: boolean;
          emi: boolean;
          sub_type: string;
          token_iin: any;
        };
        bank: any;
        wallet: any;
        vpa: any;
        email: string;
        contact: string;
        token_id: string;
        notes: {
          createdBy: string;
          packageId: string;
          transactionId: string;
          couponCode?: string;
        };
        fee: number;
        tax: number;
        error_code: any;
        error_description: any;
        error_source: any;
        error_step: any;
        error_reason: any;
        acquirer_data: {
          auth_code: string;
        };
        created_at: number;
        base_amount: number;
      };
    };
  };
  created_at: number;
};
