export interface Products {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  author: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  subcategory?: string[];
  ratingAverage?: number;
  ratingQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}
