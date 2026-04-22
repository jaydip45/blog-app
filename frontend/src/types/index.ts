export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
  avatar?: string;
  profile?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  primaryKeywords?: string;
  secondaryKeywords?: string;
  longTailKeywords?: string;
  coverImage?: string;
  published: boolean;
  views: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    profile?: string;
  };
  category: Category;
  tags: Tag[];
  comments?: Comment[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
  token: string;
}
