export interface RazorpayResponse {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: Payload;
  created_at: number;
}

export interface Payload {
  payment: Payment;
}

export interface Payment {
  entity: Entity;
}

export interface Entity {
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
  card_id: any;
  bank: any;
  wallet: any;
  vpa: string;
  email: string;
  contact: string;
  notes: Notes;
  fee: number;
  tax: number;
  error_code: any;
  error_description: any;
  error_source: any;
  error_step: any;
  error_reason: any;
  acquirer_data: AcquirerData;
  created_at: number;
  base_amount: number;
}

export interface Notes {
  sellerId: string;
  buyerId: string;
  packageId: string;
  gigId: string;
  discountCode: string;
}

export interface AcquirerData {
  rrn: string;
  upi_transaction_id: string;
}
