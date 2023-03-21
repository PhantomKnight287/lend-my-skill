export interface JobPost {
  title: string;
  description: string;
  tags: {
    id: string;
    slug: string;
    name: string;
  }[];
  category: {
    id: string;
    slug: string;
    name: string;
  };
  images: string[];
  deadline: Date;
  id: string;
  slug: string;
  budget: number;
  createdAt: Date;
  author: {
    name: string;
    verified: boolean;
    avatarUrl: string;
    username: string;
    profileCompleted: boolean;
  };
  claimed: boolean;
  claimedBy: {
    username: string;
    name: string;
    avatarUrl: string;
  };
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
      verified?: boolean;
    };
    description: string;
    budget: number;
    title: string;
    tags: string[];
    slug: string;
  }[];
  next?: number;
}
