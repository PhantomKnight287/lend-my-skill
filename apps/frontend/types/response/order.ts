type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface Orders {
  orders: Order[];
  next?: number;
}

export interface Order {
  id: string;
  package: Package;
  DiscountCode: any;
  freelancer: Freelancer;
  client: Client;
  deadline: string;
  price: number;
  createdAt: string;
  status: OrderStatus;
  amountPaid?: number;
  user: "client" | "freelancer";
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
