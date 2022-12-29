import { RazorpayOptions } from "~/types/razorpay";

export class Razorpay {
  private options: RazorpayOptions;
  private rzrpayInstannce: any;

  constructor(options: RazorpayOptions) {
    this.options = options;
    if (typeof window !== "undefined")
      this.rzrpayInstannce = new (window as any).Razorpay(this.options);
  }

  public on(event: string, callback: Function) {
    this.rzrpayInstannce.on(event, callback);
  }

  public open() {
    this.rzrpayInstannce.open();
  }
}
