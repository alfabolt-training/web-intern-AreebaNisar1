export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In real app, this would be hashed
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  parentId?: number; // For nested comments
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
