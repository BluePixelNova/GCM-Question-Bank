
export interface Material {
  name: string;
  url: string;
}

export interface SearchResult {
  link: string;
  title: string;
  description: string;
  search_terms: string;
}

export enum Program {
  UG = 'UG',
  PG = 'PG',
  FYUGP = 'FYUGP'
}

export type DepartmentName = 'English' | 'Physics' | 'Electronics' | 'Development Economics' | 'Commerce';
