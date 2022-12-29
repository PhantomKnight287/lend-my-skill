const successResponse = {
  entity: 'event',
  account_id: 'acc_Hq69OG0DTBWypL',
  event: 'payment.captured',
  contains: ['payment'],
  payload: {
    payment: {
      entity: {
        id: 'pay_Kxg0zIGjYZVTJu',
        entity: 'payment',
        amount: 423463,
        currency: 'INR',
        status: 'captured',
        order_id: 'order_Kxg0cQHac7eRtj',
        invoice_id: null,
        international: false,
        method: 'upi',
        amount_refunded: 0,
        refund_status: null,
        captured: true,
        description: null,
        card_id: null,
        bank: null,
        wallet: null,
        vpa: 'success@razorpay',
        email: 'gillgurpal699@gmail.com',
        contact: '+919136445089',
        notes: {
          sellerId: 'clc36wo350000ew48nnond7zu',
          buyerId: 'clc2z4an40000ew5ohz2rvax0',
          packageId: 'clc6405ed0008ewogk3y916h6',
          gigId: 'clc6405ec0000ewogr03it7cy',
          discountCode: 'GIMME10',
        },
        fee: 9764,
        tax: 1490,
        error_code: null,
        error_description: null,
        error_source: null,
        error_step: null,
        error_reason: null,
        acquirer_data: {
          rrn: '588176432243',
          upi_transaction_id: '8E13B44B215310694DB5A4E86A42763C',
        },
        created_at: 1672306161,
        base_amount: 423463,
      },
    },
  },
  created_at: 1672306161,
};

export type RazorpayResponse = typeof successResponse;
