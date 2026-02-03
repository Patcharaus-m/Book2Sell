export interface IBook {
  title: string;
  author: string;
  category: string;
  isbn?: string;
  coverPrice?: number;
  sellingPrice: number;
  condition: string;
  description?: string;
  stock?: number;
  status?: "available" | "sold" | "closed";
  images?: string[];
  isDeleted?: boolean;
}
