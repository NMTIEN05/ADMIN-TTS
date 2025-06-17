export interface Author {
  _id: string;
  name: string;
  nationality?: string;
  birth_date?: string;
  bio?: string;
}

export interface AuthorInput {
  name: string;
  nationality?: string;
  birth_date?: string;
  bio?: string;
}
