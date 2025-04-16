// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  userId: string;
  jwt: string;
};

export interface articleObject {
  id: string,
  name: string,
  description: string,
  available: boolean,
  nombre: number,
  createdAt: string,
  updatedAt: string,
  publishedAt: string

}
