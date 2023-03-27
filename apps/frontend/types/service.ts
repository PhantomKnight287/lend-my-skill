export interface Service {
  bannerImage: string;
  category: Category;
  createdAt: string;
  description: string;
  user: Freelancer;
  images: string[];
  id: string;
  package: Package[];
  slug: string;
  title: string;
  tags: { name: string; slug: string; id: string }[];
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface Freelancer {
  username: string;
  profileCompleted: boolean;
  name: string;
  avatarUrl: any;
  verified: boolean;
}

export interface Package {
  deliveryDays: number;
  description: any;
  features: any[];
  id: string;
  name: string;
  price: number;
}

export interface AllServicesResponse {
  services: {
    id: string;
    user: {
      id: string;
      name: string;
      username: string;
      country: string;
      avatarUrl: string;
      verified?: boolean | undefined;
    };
    createdAt: string;
    title: string;
    tags: { name: string; id: string; slug: string }[];
    slug: string;
    description: string;
    package: [
      {
        price: number;
      }
    ];
    rating: number;
    bannerImage: string;
    ratedBy: number;
  }[];
  next?: number;
}
