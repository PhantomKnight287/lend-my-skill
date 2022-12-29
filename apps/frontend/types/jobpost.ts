export interface JobPost {
  author: Author;
  budget: number;
  category: Category;
  claimed: boolean;
  claimedBy: Author;
  createdAt: string;
  deadline: any;
  description: string;
  id: string;
  images: string[];
  tags: string[];
  title: string;
}

export interface Author {
  username: string;
  avatarUrl: string;
  name: string;
  verified: boolean;
  profileCompleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: true;
}
export interface JobPosts {
  posts: Post[];
  next?: number;
}

export interface Post {
  title: string;
  id: string;
  slug: string;
  author: Author;
  tags: string[];
  createdAt: string;
  category: Category;
}

export interface Category {
  name: string;
}

export interface Posts {
  posts: {
    id: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      username: string;
      country: string;
      avatarUrl: string;
    };
    description: string;
    budget: number;
    title: string;
    tags: string[];
    slug: string;
  }[];
  next?: number;
}
