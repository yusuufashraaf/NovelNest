export interface Product {
  _id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  imageCover: string;
  images: string[];
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  sold: number;
  ratingQuantity: number;
  category: {
    name: string;
  };
  subcategory: string[];
  createdAt: string;
  updatedAt: string;
}
