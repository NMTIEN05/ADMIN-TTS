interface User {
  _id: string;
  username: string;
  email: string;
  fullname?: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user';
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type { User };