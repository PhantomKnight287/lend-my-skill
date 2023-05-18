type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Orders {
  orders: Order[];
  next?: number;
}

// do not believe on this type, please check network tab before using it
export interface Order {
  client: {
    name: string;
    username: string;
  };
  freelancer: {
    name: string;
    username: string;
  };
  couponCode: {
    code: string;
  };
  orderState: string;
  transaction: {
    amount: number;
  };
  id: string;
  package: {
    name: string;
  };
  service: {
    slug: string;
  };
  createdAt: string;
}

export interface Package {
  id: string;
  price: number;
  description: string;
  name: string;
  service: {
    slug: string;
    freelancer: {
      username: string;
    };
  };
}

export interface Freelancer {
  username: string;
  id: string;
  name: string;
  verified: boolean;
  avatarUrl: any;
}

export interface Client {
  username: string;
  id: string;
  name: string;
  verified: boolean;
  avatarUrl: any;
}
