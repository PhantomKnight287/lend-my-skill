import { RAZORPAY_KEY, RAZORPAY_SECRET } from 'src/constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RazorpayImport = require('razorpay');

export interface OrderCreate {
  /**
   * Amount To Be Paid(in Shortest Denomination Ex: Paisa)
   */
  amount: number;
  /**
   * Currency of the Order. Currently Only `INR` is supported
   */
  currency?: string;
  /**
   * Your System Order Reference Id
   */
  receipt?: string;
  /**
   * A Key Value Pairs
   */
  notes?: object;
  /**
   * Indicates whether customers can make partial payments on the invoice . Possible values: true - Customer can make partial payments. false (default) - Customer cannot make partial payments.
   * @type Boolean
   */
  partialPayment?: boolean;
}

interface OrderCreateResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: 'INR';
  receipt: string;
  offer_id: null | any;
  status: string;
  attempts: number;
  notes: Record<any, any>[];
  created_at: number;
}

export class Razorpay {
  reference;
  constructor(
    /**
     * Your KEY ID
     */
    keyId: string,
    /**
     * Your Key Secret
     */
    keySecret: string,
  ) {
    this.reference = new RazorpayImport({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  async createOrder(props: OrderCreate): Promise<OrderCreateResponse> {
    return await this.reference.orders.create({
      amount: props.amount,
      currency: props.currency || 'INR',
      receipt: props.receipt || '',
      notes: props.notes || {},
    });
  }
}

export class API {
  hostURL;
  ua;
  headers;
  auth;
  constructor(props: {
    /**
     * URL of the Host
     */
    hostURL: string;
    /**
     * Useragent to send during requests
     */
    ua?: string;
    /**
     * Headers
     */
    headers: Headers;
    /**
     * Auth
     */
    auth: Record<any, any>;
  }) {
    this.auth = props.auth;
    this.headers = props.headers;
  }
}
export const razorpay = new Razorpay(RAZORPAY_KEY, RAZORPAY_SECRET);
