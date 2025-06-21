export interface Author {
  _id: string;
  id: string;
  name: string;
  bio: string;
  birth_date: string;
  nationality: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorInput {
  name: string;
  bio: string;
  birth_date: string;
  nationality: string;
  avatar?: string;
}
